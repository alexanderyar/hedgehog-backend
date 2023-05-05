import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Errback } from "express";
import cors from "cors";
import morgan from "morgan";

import AppDataSource from "./dataSource";

import authRouter from "./routes/api/authRouter";
import { Response } from "@sendgrid/helpers/classes";

const app = express();
const port = parseInt(process.env.PORT || "3001");
// console.log(process.env);
AppDataSource.initialize()
  .then(() => {
    app.use(morgan("dev"));
    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRouter);

    app.use((req, res) => {
      res.status(404).json({ message: "Not found" });
    });

    app.use((err: any, req: any, res: any, next: any) => {
      const { status = 500, message = "Server error" } = err;
      res.status(status).json({ message });
    });

    app.listen(port, "0.0.0.0", async () => {
      console.log(`Server is running. Use our API on port:${port}`);
    });
  })

  .catch((error) => {
    console.log(`error while running "app.ts": ${error.message}`);
    process.exit(1);
  });
