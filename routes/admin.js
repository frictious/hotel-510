const   express                     = require("express"),
        adminController             = require("../controllers/admin/adminController"),
        mongoose                    = require("mongoose"),
        crypto                      = require("crypto"),
        path                        = require("path"),
        multer                      = require("multer"),
        {GridFsStorage}             = require("multer-gridfs-storage"),
        Grid                        = require("gridfs-stream");

const router = express.Router();

require("dotenv").config();
//CONFIG

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

//Uploading multiple room images
const cpUpload = files.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 },
{name : 'inside', maxCount : 1}, {name : 'outside', maxCount : 1}]);

//Login checker
const isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        if(req.user.role === "Admin"){
            return next();
        }else{
            res.redirect("/admin/logout");
        }
    }else{
        res.redirect("/admin/login");
    }
};

// ROOT ROUTE
router.get("/", isLoggedIn, adminController.index);

// SET PASSWORD
router.get("/setpassword/:id", isLoggedIn, adminController.setpassword);

// SET PASSWORD LOGIC
router.put("/setpassword/:id", adminController.setpasswordLogic);

// roomS
router.get("/rooms", isLoggedIn,  adminController.rooms);

// ADD room FORM
router.get("/room/add", isLoggedIn,  adminController.addRoom);

// VIEW room
router.get("/room/:id", isLoggedIn, adminController.getroom);

// ADD room LOGIC
router.post("/room/add", files.single("picture"), adminController.addroomLogic);

// UPDATE room
router.get("/room/:id/edit", isLoggedIn, adminController.updateroom);

// UPDATE room LOGIC
router.put("/room/:id", files.single("picture"), adminController.updateroomLogic);

// DELETE room
router.delete("/room/:id", adminController.deleteroom);

// RESERVATIONS
router.get("/reservations", isLoggedIn, adminController.reservations);

// CANCEL RESERVATIONS
router.put("/reservation/:id",  adminController.cancelReservation);

// ADMIN REGISTRATION
router.get("/register", isLoggedIn, adminController.register);

// ADMIN REGISTRATION LOGIC
router.post("/register", adminController.registerLogic);

// LOGIN
router.get("/login", adminController.login);

// LOGIN LOGIC
router.post("/login", adminController.loginLogic);

// LOGOUT ROUTE
router.get("/logout", adminController.logout);

// PROFILE ROUTE
router.get("/profile/:id", isLoggedIn, adminController.profile);

// UPDATE PROFILE LOGIC
router.put("/profile/:id", adminController.updateProfile);

// RESET PASSWORD
router.get("/resetpassword/:id", adminController.resetpassword);

// RESET PASSWORD LOGIC
router.put("/resetpassword/:id", adminController.forgotpasswordLogic);

// FORGOT PASSWORD
router.get("/forgotpassword", adminController.forgotpassword);

// FORGOT PASSWORD LOGIC
router.post("/forgotpassword", adminController.forgotpasswordLogic);

// ADMINS
router.get("/admins", isLoggedIn, adminController.admins);

// DELETE ADMIN
router.delete("/:id", adminController.deleteAdmin);

// CUSTOMERS
router.get("/customers", isLoggedIn, adminController.customers);

// DELETE CUSTOMER
router.delete("/customer/:id", adminController.deleteCustomer);

// GET FILES
router.get("/files/:filename", adminController.files);

module.exports = router;
