import mysql2 from 'mysql2';
import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';

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

// Allow CORS 
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Origin', '*');
    res.setHeader('Content-Type', 'Application/json');
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

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
                res.status(404)
                res.type('json')
                res.send('user not found, please sign in')
                res.end()
            }
            try {
                const saltRounds = 8;
                const match = bcrypt.compareSync(password, results[0].password);
                if ( match ) {
                    console.log(`password correct! Welcome ${name}`)
                    const token = jsonwebtoken.sign({ name, password }, secret, { expiresIn: 120 });
                    res.status(200)
                    res.type('json')
                    res.send({
                        "jwt": token,
                        "user": results[0].name
                    })
                } else {
                    console.log('incorrect password, please try again')
                    res.type('json')
                    res.status(401)
                    res.send('incorrect password')
                }
        } catch (error) {
            console.log(error)
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
