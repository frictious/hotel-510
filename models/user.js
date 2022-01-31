const   mongoose                    = require("mongoose");

const userSchema = mongoose.Schema({
    name : String,
    contact : String,
    email : String,
    password : String,
    picture : String,
    pictureName : String,
    status : String, // An Agents status is used to activate or deactivate an agents status in the system. A deactivated agent will not be able to use the system
    role : String // Whether the user is an agent or an admin
});

module.exports = mongoose.model("User", userSchema);
