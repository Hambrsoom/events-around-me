import { createConnection } from "typeorm";
const typeormNamingStrategies = require('typeorm-naming-strategies');

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "events-around-me-test",
    synchronize: drop,
    dropSchema: drop,
    entities: ["./src/entities/*.*"],
    namingStrategy: new typeormNamingStrategies.SnakeNamingStrategy()
  });
};