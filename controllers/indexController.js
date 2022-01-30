const   nodemailer              = require("nodemailer");

require("dotenv").config();
// NODEMAILER CONFIGURATION
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
})

exports.index = (req, res) => {
    res.render("index", {
        title : "Hotel 5 |10 Homepage"
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
    res.render("rooms", {
        title : "Room 5 | 10 Rooms"
    });
}

// SINGLE ROOM
exports.singleRoom = (req, res) => {
    res.render("singleRoom", {
        title : "Hotel 5 | 10 Room"
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
