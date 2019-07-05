const express = require('express');
const app = express();
const cors = require('cors');

// Read .env file from the project
const dotenv = require('dotenv')
dotenv.config();

// Logger
const morgan  = require('morgan');
app.use(morgan('combined')); 


// Import all the controllers here
const contacts = require('./controllers/contacts.js');
const messages = require('./controllers/messages.js');
const users = require('./controllers/users.js');


// Import all helpers here.
const checkToken = require('./helpers/token.js').checkToken;


// Setting Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// CORS
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

app.use(cors({
    origin: true, //['http://localhost:2000','https://m.tripshire.com','http://localhost:2001','http://localhost:3000','https://www.tripshire.com', 'https://insider.tripshire.com','https://kdhingra307.github.io','https://admin.tripshire.com','tripshire.com'],
    credentials: true
}));

// Routes
app.get('/', (request, response) => {
  response.json({ info: 'Kisan Network task APIs are up.' })
})

// Non authenticated routes
app.post('/user/register', users.createUser);
app.post('/user/login', users.login);
app.get('/user/check/:username', users.checkUsername);


const routes = express.Router();
routes.use(function(req, res, next) {
	checkToken(req, res, next);
});

app.use('/', routes);

// Users controller Routes
app.get('/user/profile', users.getProfile);
app.put('/user/updatePassword', users.updatePassword);
app.put('/user/update', users.updateUser);


// Contacts controller routes
app.get('/contacts/getContacts', contacts.getAllContacts);
app.post('/contacts/create', contacts.createContact);
app.put('/contacts/update/:contactId', contacts.updateContact);


// Messages controller routes
app.post('/messages/send', messages.sendMessage);
app.get('/messages/getMessages', messages.getAllMessages);
app.get('/messages/getMessagesById/:contactId', messages.getMessagesById);


// Listen to the server
app.listen(process.env.APP_PORT, () => {
  console.log(`App running on port ${process.env.APP_PORT}.`);
})

module.exports = app; // for testing