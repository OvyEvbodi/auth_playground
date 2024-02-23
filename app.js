console.log('we running!')
import mysql2 from 'mysql2';

// setup mysql connection

// set database parameters
const host = process.env.MYSQL_DB_HOST;
const user = process.env.MYSQL_DB_USER;
const password = process.env.MYSQL_DB_PASSWORD;
const database = process.env.MYSQL_DB_DATABASE;

const databaseDetails = {
    host,
    user,
    password,
    database
};

const dbConnection = mysql2.createConnection(databaseDetails);

//establish database connection
try {
    dbConnection.connect();
    console.log(`connected to ${database} `)
} catch (error) {
    console.log(error)
}

// close db connection
dbConnection.end();