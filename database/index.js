// Require mongoose
const mongoose = require("mongoose");
// Connecting mongoose
mongoose
  .connect("mongodb+srv://Khaled_20:258852@cluster0.gpjac.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err);
  });

// Create expensesSchema
let expensesSchema = mongoose.Schema({
  expensesTypes: {
    type: String,
    required: [true, "Please add some expensesTypes"],
  },
  amount: {
    type: Number,
    required: [true, "Please add a positive or negative number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: [true, "Please add some description"],
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
});

// Creating expensesModel
let expensesModel = mongoose.model("expenses", expensesSchema);

//Document and save function
// let expDocu = new expensesModel({expensesTypes: "Khaled",amount: 100 ,createdAt:12/07/2020});
// expDocu.save((err) => {
//   if(err){
//     console.log("err while save db" , err);
//   }else{
//     console.log("expensesDB saved");
//   }
//   });

// Export expensesModel
module.exports.expensesModel = expensesModel;
