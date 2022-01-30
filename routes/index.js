const   express                 = require("express"),
        indexController         = require("../controllers/indexController");

const router = express.Router();

// ROOT ROUTE
router.get("/", indexController.index);

// ABOUT ROUTE
router.get("/about", indexController.about);

// SERVICES ROUTE
router.get("/services", indexController.services);

// ROOMS ROUTE
router.get("/rooms", indexController.rooms);

// SINGLE ROOM
router.get("/room/:id", indexController.singleRoom);

// CONTACT ROUTE
router.get("/contact", indexController.contact);

// EXPORTING ROUTER
module.exports = router;
