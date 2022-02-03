const   nodemailer              = require("nodemailer"),
        Room                    = require("../models/room"),
        Customer                = require("../models/user"),
        bcrypt                  = require("bcryptjs"),
        passport                = require("passport");
const user = require("../models/user");

require("dotenv").config();

// CONFIG
require("../config/login")(passport);

// NODEMAILER CONFIGURATION
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
});

exports.index = (req, res) => {
    res.render("index", {
        title : "Hotel 5 | 10 Homepage"
    });
}

// ABOUT PAGE
exports.about = (req, res) => {
    res.render("about", {
        title : "About Hotel 5 | 10"
    });
}

// SERVICES PAGE
exports.services = (req, res) => {
    res.render("services", {
        title : "Hotel 5 | 10 Services"
    });
}

// ROOMS PAGE
exports.rooms = (req, res) => {
    Room.find({})
    .then(rooms => {
        if(rooms){
            res.render("rooms", {
                title : "Room 5 | 10 Rooms",
                rooms : rooms
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// SINGLE ROOM
exports.singleRoom = (req, res) => {
    Room.findById({_id : req.params.id})
    .then(room => {
        if(room){
            res.render("singleRoom", {
                title : "Hotel 5 | 10 Room",
                room : room
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// CONTACT PAGE
exports.contact = (req, res) => {
    res.render("contact", {
        title : "Hotel 5 | 10 Contact"
    });
}

// CONTACT PAGE LOGIC
exports.contactLogic = (req, res) => {
    const mailoptions = {
        from : req.body.email,
        to : process.env.EMAIL,
        subject : `HOTEL 5 |-10 Contact Form Message: ${req.body.subject}`,
        html : `<p>The message from the contact form is<br></p>
        <p>${req.body.message}</p>
        `
    }

    transport.sendMail(mailoptions, (err, mail) => {
        if(!err){
            console.log("MAIL SENT SUCCESSFULLY");
            res.redirect("back");
        }else{
            console.log(err);
        }
    });
}

// REGISTER PAGE
exports.register = (req, res) => {
    res.render("register", {
        title : "Hotel 5 | 10 Customer Registration"
    });
}

// REGISTER FORM LOGIC
exports.registerLogic = (req, res) => {
    if(req.body.password === req.body.repassword && (req.body.password !== undefined)){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                Customer.create({
                    name : req.body.name,
                    email : req.body.email,
                    contact : req.body.contact,
                    password : hash,
                    role : "Customer"
                })
                .then(customer => {
                    if(customer){
                        console.log("ACCOUNT CREATED SUCCESSFULLY");
                        res.redirect("/login");
                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect("back");
        });
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// LOGIN PAGE
exports.login = (req, res) => {
    res.render("login", {
        title : "Hotel 5 | 10 Customer Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/rooms",
        failureRedirect : "/login"
    })(req, res, next);
}

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/login");
}

// RESERVATION ROOM LOGIC
exports.reserve = (req, res) => {
    Room.findById({_id : req.params.id})
    .then(foundRoom => {
        if(foundRoom.status !== "Reserved"){
            Room.findByIdAndUpdate({_id : req.params.id}, {
                status : "Reserved",
                from : req.body.from,
                to : req.body.to,
                customer : req.user._id
            })
            .then(room => {
                if(room){
                    console.log("ROOM RESERVED");
                    res.redirect(`/room/${room._id}`);
                }
            })
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// CANCEL RESERVED ROOM LOGIC
exports.cancelreservation = (req, res) => {
    Room.findByIdAndUpdate({_id : req.params.id}, {
        status : "Available",
        customer : null
    })
    .then(canceled => {
        if(canceled){
            console.log("CANCELED ROOM RESERVATION");
            res.redirect("back");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// BOOKING
exports.booking =(req, res) => {
    Room.findById({_id : req.params.id})
    .then(room => {
        if(room){
            Customer.findById({_id : room.customer})
            .then(customer => {
                if(customer){
                    res.render("booking", {
                        title : "Hotel 5 | 10 Room Booking Page",
                        room : room,
                        customer : customer
                    });
                }
            })
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// CHECKOUT SUCCESS
exports.checkoutSuccess = (req, res) => {
    Room.findByIdAndUpdate({_id : req.params.id}, {
        status : "Booked"
    })
    .then(room => {
        if(room){
            Room.findById({_id : req.params.id})
            .then(foundRoom => {
                if(foundRoom){
                    Customer.findById({_id : room.customer})
                    .then(customer => {
                        if(customer){
                            res.render("confirmation", {
                                title : "Hotel 5 | 10 Room Booking Confirmation Page",
                                foundRoom : foundRoom,
                                customer : customer
                            });
                        }
                    })
                }
            })
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}
