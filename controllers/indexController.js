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
