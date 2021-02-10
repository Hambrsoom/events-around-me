import { createConnection } from "typeorm"
const typeormNamingStrategies = require('typeorm-naming-strategies');

export const testConn = (drop = false) => {
    return createConnection({
        "name": "default",
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "password",
        "database": "events-around-me-test",
        "synchronize": drop,
        "logging": false,
        "dropSchema": false,
        "entities": [
           "src/entities/*.ts"
        ],
        "namingStrategy": new typeormNamingStrategies.SnakeNamingStrategy(),
        "cli": {
           "entitiesDir": "src/entities"
        }
    })
}