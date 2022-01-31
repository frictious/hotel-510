const   mongoose                    = require("mongoose");

const roomSchema = mongoose.Schema({
    name : String,
    description : String,
    price : String,
    from : Date,
    to : Date,
    type : String,
    picture : String,
    status : {
        type : String,
        default : "Available"
    }, // The status specifies if the room has been booked or is vacant/available
});

module.exports = mongoose.model("Rooms", roomSchema);
