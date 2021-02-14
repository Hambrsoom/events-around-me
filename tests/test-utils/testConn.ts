import { createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const testConn = async(drop = false) => {
  return await createConnection({
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
    namingStrategy:  new SnakeNamingStrategy()
  });
};