const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);


// app.use is used to mount the middleware on the application.
// In this case, it mounts the mainRouter on the path "/api/v1".

//app.use is used to route the requests that start with a certain substring over to other routers this means that 
// all requests that start with "/api/v1" will be handled by the mainRouter.

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
