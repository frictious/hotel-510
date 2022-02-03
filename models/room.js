const   mongoose                    = require("mongoose");

const roomSchema = mongoose.Schema({
    name : String,
    description : String,
    price : Number,
    from : Date,
    to : Date,
    type : String,
    picture : String,
    status : {
        type : String,
        default : "Available"
    }, // The status specifies if the room has been booked/reserved or is vacant/available
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

module.exports = mongoose.model("Rooms", roomSchema);
