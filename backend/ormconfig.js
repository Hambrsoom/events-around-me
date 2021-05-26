const typeormNamingStrategies = require('typeorm-naming-strategies');

module.exports = {
   "type": "mysql",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USERNAME,
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_NAME,
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entities/*.entity.ts",
      "src/entities/user/*.entity.ts",
      "src/entities/address/*.entity.ts"
   ],
   "namingStrategy": new typeormNamingStrategies.SnakeNamingStrategy(),
   "cli": {
      "entitiesDir": "src/entities"
   }
}