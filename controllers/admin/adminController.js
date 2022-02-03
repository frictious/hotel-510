const   Room                    = require("../../models/room"),
        Admin                   = require("../../models/user"),
        Customer                = require("../../models/user"),
        passport                = require("passport"),
        mongoose                = require("mongoose"),
        bcrypt                  = require("bcryptjs"),
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream"),
        nodemailer              = require("nodemailer");

require("dotenv").config();

// CONFIG
require("../../config/login")(passport);

// NODEMAILER CONFIG
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
});

//GRIDFS File db connection
const URI = process.env.MONGOOSE;
const conn = mongoose.createConnection(URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

//GRIDFS CONFIG FOR IMAGES
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("files");
});

//GRIDFS STORAGE CONFIG
const storage = new GridFsStorage({
    url: URI,
    options : {useUnifiedTopology : true},
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: "files"
            };
            resolve(fileInfo);
            });
        });
    }
});

//Multer config for images
const files = multer({ storage });

//Uploading multiple house images
const cpUpload = files.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 },
{name : 'inside', maxCount : 1}, {name : 'outside', maxCount : 1}]);


// Admin ROOT ROUTE
exports.index = (req, res) => {
    Customer.find({role : "Customer"})
    .then(customers => {
        if(customers){
            Room.find({})
            .then(rooms => {
                if(rooms){
                    res.render("Admin/index", {
                        title : "Hotel 5 | 10 Admin Dashboard",
                        customers : customers,
                        rooms : rooms
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

// REGISTER PAGE
exports.register = (req, res) => {
    res.render("admin/register", {
        title : "Hotel 5 | 10 Admin Registration"
    });
}

// REGISTER LOGIC
exports.registerLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcrypt.genSalt(10)
        .then(salt => {
            if(salt){
                bcrypt.hash(req.body.password, salt)
                .then(hash => {
                    Admin.create({
                        name : req.body.name,
                        email : req.body.email,
                        contact : req.body.contact,
                        password : hash,
                        role : "Admin"
                    })
                    .then(admin => {
                        if(admin){
                            console.log("ADMIN ACCOUNT CREATED SUCCESSFULLY");
                            res.redirect("/admin/login");
                        }
                    })
                })
            }
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// ADMINS
exports.admins = (req, res) => {
    Admin.find({})
    .then(admins => {
        if(admins){
            res.render("admin/admins", {
                title : "Hotel 5 | 10 Admins",
                admins : admins
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

// DELETE ADMIN
exports.deleteAdmin = (req, res) => {
    Admin.findByIdAndDelete({_id : req.params.id})
    .then(admin => {
        if(admin){
            console.log("ADMIN ACCOUNT DELETED SUCCESSFULLY");
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

// LOGIN PAGE
exports.login = (req, res) => {
    res.render("admin/login", {
        title : "Hotel 5 | 10 Admin Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/admin",
        failureRedirect : "/admin/login"
    })(req, res, next);
}

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout;
    res.redirect("/admin/login");
}

// PROFILE FORM
exports.profile = (req, res) => {
    Admin.findById({_id : req.params.id})
    .then(admin => {
        if(admin){
            res.render("admin/profile", {
                title : "Hotel 5 | 10 Admin Profile",
                admin : admin
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

// UPDATE PROFILE
exports.updateProfile = (req, res) => {
    if(req.body.password !== undefined) {
        bcrypt.genSalt(10)
        .then(salt => {
            if(salt){
                bcrypt.hash(req.body.password, salt)
                .then(hash => {
                    if(hash){
                        Admin.findByIdAndUpdate({_id : req.params.id}, {
                            name : req.body.name,
                            contact : req.body.contact,
                            email : req.body.email,
                            password : hash
                        })
                        .then(Admin => {
                            if(Admin){
                                console.log("ADMIN PROFILE UPDATED SUCCESSFULLY");
                                res.redirect("back");
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
    }else{
        Admin.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            contact : req.body.contact,
            email : req.body.email
        })
        .then(Admin => {
            if(Admin){
                console.log("ADMIN PROFILE UPDATED SUCCESSFULLY");
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
}

// SET PASSWORD FORM
exports.setpassword = (req, res) => {
    Admin.findById({_id : req.params.id})
    .then(Admin => {
        if(Admin){
            res.render("Admin/setpassword", {
                title : "Hotel 5 | 10 Admin Set Password and Profile Picture area",
                Admin : Admin
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

// SET PASSWORD LOGIC
exports.setpasswordLogic = (req, res) => {
    if(req.body.password === req.body.repassword) {
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                if(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg"){
                    Admin.findByIdAndUpdate({_id : req.params.id}, {
                        password : hash,
                        status : "Activated",
                        picture : req.file.filename,
                        pictureName : req.file.originalname
                    })
                    .then(Admin => {
                        if(Admin){
                            console.log("Admin PASSWORD AND PICTURE ADDED SUCCESSFULLY");
                            res.redirect("/Admin/login");
                        }
                    })   
                }     
            })
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }
}

// FORGOT PASSWORD FORM
exports.forgotpassword = (req, res) => {
    res.render("Admin/forgotpassword", {
        title : "Hotel 5 | 10 Admin Forgot Password"
    });
}

// FORGOT PASSWORD LOGIC
exports.forgotpasswordLogic = (req, res) => {
    Admin.findOne({email : req.body.email})
    .then(Admin => {
        const link = `${req.headers.host}/Admin/resetpassword/${Admin._id}`;
        const mailOptions = {
            from : process.env.EMAIL,
            to : req.body.email,
            subject : "Hotel 5 | 10 Admin Reset Password",
            html : `<p>Dear ${Admin.name},</p>
            <p>A request was made using your email to reset your password. </p>
            <p>If this was you, please use the link below to reset your password.</p>
            <p>If this was not you, please use the link below to reset your password/secure your account so others cannot gain access to your account.</p>
    
            <a href=http://${link}>Click Here</a>
    
            <p>Regards</p>
    
            <p>Hotel 5 | 10 Management</p>
            `
        }

        transport.sendMail(mailOptions, (err, mail) => {
            if(!err){
                console.log("MAIL SENT TO Admin SUCCESSFULLY");
                res.redirect("/Admin/login");
            }
        });
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// RESET PASSWORD FORM
exports.resetpassword = (req, res) => {
    Admin.findById({_id : req.params.id})
    .then(Admin => {
        if(Admin){
            res.render("Admin/resetpassword", {
                title : "Hotel 5 | 10 Admin Password Reset Form"
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

// RESET PASSWORD LOGIC
exports.resetpasswordLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                Admin.findByIdAndUpdate({_id : req.params.id}, {password : hash})
                .then(Admin => {
                    if(Admin){
                        console.log("Admin PASSWORD CHANGED SUCCESSFULLY");
                        res.redirect("/Admin/login");
                    }
                })
            })
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// ROOMS
exports.rooms = (req, res) => {
    Room.find({})
    .then(rooms => {
        if(rooms){
            res.render("admin/room/rooms", {
                title : "Hotel 5 | 10 Rooms",
                rooms : rooms
            });
        }else{
            res.render("admin/room/rooms", {
                title : "Hotel 5 | 10 Rooms"
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

// GET ADD ROOM FORM
exports.addRoom = (req, res) => {
    res.render("admin/room/addroom", {
        title : "Hotel 5 | 10 Room Adding"
    });
}

// ADD ROOM LOGIC
exports.addroomLogic = (req, res) => {
    Room.create({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        from : req.body.from,
        to : req.body.to,
        Status : "Available",
        type : req.body.type,
        picture : req.file.filename
    })
    .then(room => {
        if(room){
            console.log("ROOM ADDED SUCCESSFULLY");
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

// VIEW ROOM INFORMATION
exports.getroom = (req, res) => {
    Room.findById({_id : req.params.id})
    .then(room => {
        if(room){
            res.render("admin/room/viewroom", {
                title : "Single Room",
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

// UPDATE ROOM INFORMATION
exports.updateroom = (req, res) => {
    Room.findById({_id : req.params.id})
    .then(room => {
        if(room){
            res.render("Admin/room/updateroom", {
                title : "Hotel 5 | 10 Room Update",
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

// UPDATE ROOM INFORMATION LOGIC
exports.updateroomLogic = (req, res) => {
    if(req.body.picture !== undefined) {
        Room.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            description : req.body.description,
            price : req.body.price,
            type : req.body.type,
            picture : req.file.filename,
        })
        .then(room => {
            if(room){
                console.log("ROOM INFORMATION UPDATED SUCCESSFULLY");
                res.redirect(`/admin/room/${room._id}`);
            }
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }else{
        Room.findByIdAndUpdate({_id : req.params.id}, req.body)
        .then(room => {
            if(room){
                console.log("ROOM INFORMATION UPDATED SUCCESSFULLY");
                res.redirect(`/admin/room/${room._id}`);
            }
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }
}

// DELETE ROOM INFORMATION
exports.deleteroom = (req, res) => {
    Room.findByIdAndDelete({_id : req.params.id})
    .then(room => {
        if(room){
            console.log("ROOM INFORMATION DELETED SUCCESSFULLY");
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

// RESERVATIONS
exports.reservations = (req, res) => {
    Room.find({})
    .then(reservedRooms => {
        if(reservedRooms){
            res.render("admin/reservations", {
                title : "Hotel 5 | 10 Room Reservations",
                reservedRooms : reservedRooms
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

// CANCEL RESERVATIONS
exports.cancelReservation = (req, res) => {
    Room.findByIdAndUpdate({_id : req.params.id}, {
        status : "Available",
        customer : null
    })
    .then( canceledReservation => {
        if(canceledReservation){
            console.log("RESERVATION CANCELED");
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

// CUSTOMERS
exports.customers = (req, res) => {
    Customer.find({})
    .then(customers => {
        if(customers){
            res.render("admin/customers", {
                title : "Hotel 5 | 10 Customers",
                customers : customers
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

// DELETE CUSTOMER
exports.deleteCustomer = (req, res) => {
    Customer.findByIdAndDelete({_id : req.params.id})
    .then(customer => {
        if(customer){
            console.log("CUSTOMER ACCOUNT DELETED SUCCESSFULLY");
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

//Getting the files
exports.files = (req, res) => {
    gfs.files.findOne({filename : req.params.filename}, (err, foundFiles) => {
        if(foundFiles){
            const readstream = gfs.createReadStream(foundFiles.filename);
            readstream.pipe(res);
        }else{
            console.log(err);
        }
    });
}
