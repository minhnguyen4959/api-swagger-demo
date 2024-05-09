import app from "./app";
// import * as open from "open";
import config from "./config";
// import * as dayjs from "dayjs";
// import * as multer from "multer";
import connect from "./utils/connectDB"
// import Logger from "./loaders/logger";
// import { queryTable } from "./utils/mysql";
import verifyToken from "./middlewares/verifyToken";
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(config.options);

import {
  login,
  register,
  update,
  remove,
} from "./routes/http";

app.post("/login", (req, res) => {
  login(req, res);
});

app.post("/register", (req, res) => {
  register(req, res);
});

app.patch("/users/:id", verifyToken, (req, res) => {
  update(req, res);
});
app.get("/test", verifyToken, (req, res) => {
  res.json({message: "success"})
});

app.delete("/users/:id", verifyToken, (req, res) => {
  remove(req, res);
});



app
  .listen(config.port, async () => {
    await connect();
    console.log(`Running on: http://localhost:${config.port}`)
  })
  .on("error", (err) => {
    console.log(`Run fail`)
    process.exit(1);
  });

// open(`http://localhost:${config.port}`); // 自动打开默认浏览器
