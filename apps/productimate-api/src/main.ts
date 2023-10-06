import "dotenv/config";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as path from "path";

import { goalsRouter } from "./goals";
import { reminderRouter } from "./reminder";

const app = express();

const corsOptions = {
  origin: process.env.PUBLIC_ROOT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(cookieParser());
app.use(bodyParser.json());

//This is the middleware function which will be called before any routes get hit which are defined after this point, i.e. in your index.js
app.use(function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const userId = token;

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
app.use("/api/reminders", reminderRouter);
app.use("/api/goals", goalsRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
