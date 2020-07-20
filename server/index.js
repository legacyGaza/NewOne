// reuiring express and data base and cors
const express = require('express');
const database = require('./../database/index');
const cors = require('cors');
var bodyParser = require('body-parser');
// const users = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// calling Schema
let expensesModel = database.expensesModel;
let user = database.users;

// invoking express
let app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);


//app.use(express.static(__dirname + '/../front-end/dist'));
// app.use(express.static('build'));

// Routes for using users db
// var Users = require('./routes/Users');
// app.use('/users', Users);

//Post request
app.post('/expenses', (req, res) => {
  console.log(req.body);
  const {
    expensesTypes,
    amount,
    createdAt,
    description,
    first_name,
    last_name,
    email,
  } = req.body;

  //Create document for saving expenses
  let expensesDocument = new expensesModel({
    expensesTypes: expensesTypes,
    amount: amount,
    createdAt: createdAt,
    description: description,
    first_name: first_name,
    last_name: last_name,
    email: email,
  });

  //save function for expenses
  expensesDocument.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(201).send('Saved expenses !');
    }
  });
});

//Post request
app.get('/expenses', (req, res) => {
  expensesModel
    .find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

//search request by email
app.get('/expenses/:email', (req, res) => {
  const emailVal = req.params.email;
  expensesModel
    .find({ email: emailVal })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});
/////////////////////////////////////////////////////////////////////////
// post request for register
app.post('users/register', (req, res) => {
  const today = new Date();
  var { first_name, last_name, email, password } = req.body;
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today,
  };
  // find user by email function
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then((user) => {
              res.json({ status: user.email + 'Registered!' });
            })
            .catch((err) => {
              res.send.status(400)('error: ' + err);
            });
        });
      } else {
        res.status(400).json({ error: 'User does not exist' });
      }
    })
    .catch((err) => {
      res.status(400).send('error: ' + err);
    });
});

//////////////////////////////////////////////////////////////
// post request for login
app.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Passwords match
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440,
          });
          res.send(token);
        } else {
          // Passwords don't match
          res.status(400).json({ error: 'User does not exist' });
        }
      } else {
        res.json({ error: 'User does not exist' });
      }
    })
    .catch((err) => {
      res.send('error: ' + err);
    });
});

//////////////////////////////////////////////////////////////////
// get request for profile
app.get('/profile', (req, res) => {
  var decoded = jwt.verify(
    req.headers['authorization'],
    process.env.SECRET_KEY
  );
  // find user by id function

  User.findOne({
    _id: decoded._id,
  })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.send('User does not exist');
      }
    })
    .catch((err) => {
      res.send('error: ' + err);
    });
});

/////////////////////////////////////////////////////////
//default port and lisetning
var port = process.env.PORT || 4040;

if (process.env.NODE_ENV === 'production') {
  console.log('==================>', __dirname);
  app.use(express.static('smak/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'smak', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`app listen to port ${port}`);
});
