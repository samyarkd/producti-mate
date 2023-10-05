import cookieParser from "cookie-parser";
import express from "express";
import * as path from "path";
import { reminderRouter } from "./reminder";

const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(cookieParser());

//This is the middleware function which will be called before any routes get hit which are defined after this point, i.e. in your index.js
app.use(function (req, res, next) {
  if (req.cookies) {
    const userId = req.cookies?.userId;

    if (userId && typeof Number(userId) === "number") {
      return next();
    } else {
      return res.status(400).send("Bad Request!");
    }
  } else {
    return res.status(403).send("Unauthorised!");
  }
});

// use reminderRouter
app.use("/reminders", reminderRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
