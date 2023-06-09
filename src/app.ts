import dotenv from "dotenv";
dotenv.config();
import configDefaultEnv from "./defaultEnv";
configDefaultEnv();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fileUpload from 'express-fileupload';
const logger = morgan("dev")

import AppDataSource from "./dataSource";

import routes from "./routes";

const app = express();
const port = parseInt(process.env.PORT || "3001");

AppDataSource.initialize()
  .then(() => {
    app.use(logger);
    app.use(cors());
    app.use(express.json());
    app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }));


      app.use('/api', routes)

    app.use((req, res) => {
      res.status(404).json({ message: "Not found" });
    });

    app.use((err: any, req: any, res: any, next: any) => {
      const { status = 500, message = "Server error" } = err;
      console.error(err);
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
