import { createConnection, Db } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import config from "../../config/config";

export const testConn = async(drop = false) => {
  return await createConnection({
    name: "default",
    type: "mysql",
    host: "localhost",
    port: config.dbPort,
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbTestName,
    synchronize: drop,
    dropSchema: drop,
    entities: [
    "./src/entities/*.entity.ts*",
    "./src/entities/user/*.entity.ts",
    "src/entities/address/*.entity.ts"
  ],
    namingStrategy:  new SnakeNamingStrategy()
  });
};