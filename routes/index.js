const   express                 = require("express"),
        indexController         = require("../controllers/indexController");

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        if(req.user.role === "Customer"){
            return next();
        }
        res.redirect("/login");
    }else{
        res.redirect("/logout");
    }
}

// ROOT ROUTE
router.get("/", indexController.index);

// ABOUT ROUTE
router.get("/about", indexController.about);

// SERVICES ROUTE
router.get("/services", indexController.services);

// ROOMS ROUTE
router.get("/rooms", isLoggedIn, indexController.rooms);

// SINGLE ROOM
router.get("/room/:id", isLoggedIn, indexController.singleRoom);

// CONTACT ROUTE
router.get("/contact", indexController.contact);

// CONTACT FORM LOGIC
router.post("/contact", indexController.contactLogic);

// REGISTER PAGE
router.get("/register", indexController.register);

// REGISTER FORM LOGIC
router.post("/register", indexController.registerLogic);

// PROFILE PAGE
router.get("/profile/:id", isLoggedIn, indexController.profile);

// PROFILE FORM LOGIC
router.put("/profile/:id", indexController.profileLogic);

// LOGIN ROUTE
router.get("/login", indexController.login);

// LOGIN FORM LOGIC
router.post("/login", indexController.loginLogic);

// LOGOUT LOGIC
router.get("/logout", indexController.logout);

// RESERVE ROOM LOGIC
router.post("/reserve/:id", isLoggedIn, indexController.reserve);

// CANCEL ROOM RESERVATION
router.post("/reserve/:id/cancel", isLoggedIn, indexController.cancelreservation);

// BOOKING
router.get("/booking/:id", isLoggedIn,  indexController.booking);

// CHECKOUT SUCCESS
router.get("/checkout/:id", indexController.checkoutSuccess);

// EXPORTING ROUTER
module.exports = router;
