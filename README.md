# test mini bloh

## Install Module
- Expressjs [link](https://expressjs.com)
- JWT [link](https://jwt.io)
- Sequelize(Node.js ORM MySQL) [link](https://sequelize.org/master/)

## Database Connection
- Mysql Datbase (connection detail in email) - edit connnection in model.js

## Start API localhost
- open terminal
- run command
```bash
node server.js
```

## API
|Path | Method|Headers|Description|
|--|--|--|--|
|/refresh_token|POST|-|generate new token|
|/new_user|POST|-|create new user|
|/create|POST|Authorization: \<token\>|create new blog|
|/:card_name|GET|Authorization: \<token\>|get blog|
|/delete/:id|GET|Authorization: \<token\>|delete blog|
|/update|POST|Authorization: \<token\>|update blog|

