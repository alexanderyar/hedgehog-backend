import { ConnectionOptions, DataSource } from "typeorm";
import defaultConfig from "../ormconfig";

const dbConnectionConfiguration = <ConnectionOptions>{
  ...defaultConfig,
};
const AppDataSource = new DataSource(dbConnectionConfiguration);

export default AppDataSource;
