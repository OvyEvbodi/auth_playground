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
let dbConnection;

const connectToDatabase = () => {
    // creates a mysql database connection
    dbConnection = mysql2.createConnection(databaseDetails);

    //establish database connection
    try {
        dbConnection.connect();
        console.log(`connected to ${database}`)
    } catch (error) {
        console.log(error)
    }
};


// dummy user
// name should come from the api call

const verifyUser = (name, password) => {
    // verifies a user
    dbConnection.query(`SELECT * FROM users WHERE name='${name}' LIMIT 1;`, (error, results, fields) => {
        if (error) {
            console.log(error)
            return 1
        }
        if (results.length != 1) {
            console.log('no valid user found')
            return 1
        }
        if (results[0].password == password) {
            console.log(`password correct! Welcome ${name}`)
        } else {
            console.log('incorrect password')
        }
        console.log(results)
        console.log(results.length)
        return 0
    })
}

connectToDatabase()

verifyUser('vdee', 'notsecure')
// console.log(verifyUser('chee', 'notsecure'))

// close db connection
dbConnection.end()