const express = require('express')
const User = require('./src/entities/user.entity')
const app = express()
const port = 4200

const {Pool, Client} = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

const client = new Client({
	user: 'dbuser',
	host: 'database.server.com',
	database: 'mydb',
	password: 'secretpassword',
	port: 3211,
  })
  client.connect()

let Users = [];
let id = 0;

let u = new User(id++, "Ed", "mdp");
Users.push(u);
u = new User(id++, "Micka", "mdp");
Users.push(u);
u = new User(id++, "Flo", "mdp");
Users.push(u);
u = new User(id++, "Kevin", "mdp");
Users.push(u);

// Middleware
app.use(express.json());

// Default route
app.get('/', (req, res) => {
	res.send('Hello World!')
})

// Get all users
app.get('/users', (req,res) => {
	res.status(200).json(Users);
	console.log("Request all users");
})

// Get a user by id
app.get('/users/:id', (req, res) => {
	const id = parseInt(req.params.id);
	res.status(200).json(Users.find(Users => Users.id === id));
	console.log("Request a user by id ", id, "user -> ", Users.find(Users => Users.id === id));
})

app.post('/users', (req,res) => {
	Users.push(req.body)
	res.status(200).json(Users)
})

app.listen(port, () => {
	console.log(`Matcha listening on port ${port}`)
})
