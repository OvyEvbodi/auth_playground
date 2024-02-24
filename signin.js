import mysql2 from 'mysql2';
import jsonwebtoken from 'jsonwebtoken';

// setup mysql connection
// set database parameters
const host = process.env.MYSQL_DB_HOST;
const user = process.env.MYSQL_DB_USER;
const password = process.env.MYSQL_DB_PASSWORD;
const database = process.env.MYSQL_DB_DATABASE;

// jsonwebtoken setup
const secret = process.env.JWT_SECRET;

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

    // establish database connection
    try {
        dbConnection.connect();
        console.log(`connected to ${database}`)
    } catch (error) {
        console.log(error)
    }
};

const getJwt = (user) => {
    // signs a json web token for a verified user
    const token = jsonwebtoken.sign(user, secret, { expiresIn: 120 });
    console.log(token);
}

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
            console.log(results)
            getJwt({name, password})
        } else {
            console.log('incorrect password')
        }
        return 0
    })
}


connectToDatabase()
verifyUser('chee', 'notsosecure')

// close db connection
dbConnection.end()