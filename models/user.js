const   mongoose                    = require("mongoose");

const userSchema = mongoose.Schema({
    name : String,
    contact : String,
    email : String,
    password : String,
    role : String, // Whether the user is a customer or an admin
});

module.exports = mongoose.model("User", userSchema);
