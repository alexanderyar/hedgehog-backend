import dotev from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import AppDataSource from "./dataSource";

dotev.config();

const app = express();
const port = parseInt(process.env.PORT || "3001");

AppDataSource.initialize()
  .then(() => {
    app.use(morgan("dev"));
    app.use(cors());
    app.use(express.json());

    // позже добавить раутер
    app.use("/api/auth", authRouter);

    app.listen(port, "0.0.0.0", async () => {
      console.log(`Server is running. Use our API on port:${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
