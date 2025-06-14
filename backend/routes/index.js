const express = require('express');

const userRouter = require('./user');
const accountRouter = require('./accounts');
const { authMiddleware } = require('../middleware');

const router = express.Router();
router.use("/user", userRouter);
router.use("/accounts", authMiddleware, accountRouter);

module.exports = router;

