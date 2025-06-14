const express = require('express');
const zod = require('zod');
const { User } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const { authMiddleware } = require('../middleware');
const router = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});
router.post("/signup", async (req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success){
        return res.json({
         message : "Email already exists or invalid input",
        })
    }

    const user = User.findOne({
        username: body.username
    }) 



    if(user._id){
        return res.json({
            message: "User already exists/ invalid input"
        })
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId: dbUser._id,
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        totken: token
    })
        
    
})

const signinBody = zod.object({
    username: zod.string(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
    username: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => {
    const { success} = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid input"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "User updated successfully"
    })
})

router.get("/bulk", async(req, res) => {
     const filter = req.query.filter || "";

     const users = await User.find({
         $or: [
             { firstName: { $regex: filter } },
             { lastName: { $regex: filter } }
         ]
     });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user._id
        }))
    });

})

module.exports = router;