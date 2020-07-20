//User db
//Require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create UserSchema
const UserSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export UserSchema
module.exports = User = mongoose.model("users", UserSchema);
