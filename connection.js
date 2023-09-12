const mysql = require('mysql2');
const connectionUtil = require('./util/connectionUtil');

const configObject = connectionUtil.getYaml();

let connection = mysql.createConnection({
    host: String(configObject.server.database.host),
    port: String(configObject.server.database.port),
    user: String(configObject.server.database.username),
    password: String(configObject.server.database.password),
    database: String(configObject.server.database.dbname)
});

connection.connect(
    (err) =>
        !err ? console.log('Connected') : console.error(err)
);

module.exports = connection;

