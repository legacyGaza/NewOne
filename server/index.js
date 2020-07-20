// reuiring express and data base and cors
const express = require("express");
const database = require("./../db/index");
const cors = require("cors");
var bodyParser = require("body-parser");

// calling Schema
let expensesModel = database.expensesModel;

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
app.use(express.static("build"));

// Routes for using users db
var Users = require("./routes/Users");
app.use("/users", Users);

//Post request
app.post("/expenses", (req, res) => {
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
      res.status(201).send("Saved expenses !");
    }
  });
});

//Post request
app.get("/expenses", (req, res) => {
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
app.get("/expenses/:email", (req, res) => {
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

//default port and lisetning
var port = process.env.PORT || 4040;
app.listen(port, () => {
  console.log(`app listen to port ${port}`);
});
