import path from "path";
// почему в твоем проекте дотэнв работал без испорта????
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.DB_NAME);
export = {
  type: "postgres",
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // change BEFORE PRODUCTION!!!!
  synchronize: true,
  ssl: process.env.DB_USE_SSL,
  logging: process.env.ENV === "dev",

  entities: [path.join(__dirname, "src/entity/**/*.{ts,js}")],
  //!!!!!
  // проверить настройки ниже
  // !!!!
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
    subscribersDir: "src/subscriber",
  },
};
