const typeormNamingStrategies = require('typeorm-naming-strategies');

module.exports = {
   "type": "mysql",
   "host": "localhost",
   "port": 3306,
   "username": "root",
   "password": "password",
   "database": "events-around-me",
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entities/*.ts"
   ],
   "namingStrategy": new typeormNamingStrategies.SnakeNamingStrategy(),
   "cli": {
      "entitiesDir": "src/entities"
   }
}