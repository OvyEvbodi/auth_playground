import mysql2 from 'mysql2';
import jsonwebtoken from 'jsonwebtoken';
import express from 'express';

// setup mysql connection
// set database parameters
const host = process.env.MYSQL_DB_HOST;
const user = process.env.MYSQL_DB_USER;
const password = process.env.MYSQL_DB_PASSWORD;
const database = process.env.MYSQL_DB_DATABASE;

// jsonwebtoken setup
const secret = process.env.JWT_SECRET;

// express parameters
const port = process.env.PORT || 8080;

const databaseDetails = {
    host,
    user,
    password,
    database
};
let dbConnection;
var tok;


// instantiate express app
const app = express();

// express middleware
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>navigate to <a href=\'/signin\'>signin</a> or signup</h1>')
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.end()
})

// signin
app.post('/signin', (req, res) => {
    const { name, password } = req.body;
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

    const verifyUser = (name, password) => {
        // verifies a user
        dbConnection.query(`SELECT * FROM users WHERE name='${name}' LIMIT 1;`, (error, results, fields) => {
            if (error) {
                console.log(error)
            }
            if (results.length != 1) {
                console.log('no valid user found')
            }
            console.log(results)
            if (results[0].password == password) {
                console.log(`password correct! Welcome ${name}`)
                console.log(results)
                const token = jsonwebtoken.sign({ name, password }, secret, { expiresIn: 120 });
                res.type('json')
                res.send({
                    "jwt": token,
                    "user": results[0]
                })
            } else {
                console.log('incorrect password')
            }
        })
    };
    connectToDatabase()
    verifyUser(name, password)

    // close db connection
    dbConnection.end()
})

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`)
})
