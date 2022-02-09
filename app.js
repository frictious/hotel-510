const   express                 = require("express"),
        Index                   = require("./routes/index"),
        Admin                   = require("./routes/admin"),
        mongoose                = require("mongoose"),
        methodoverride          = require("method-override"),
        passport                = require("passport"),
        session                 = require("express-session");

const app = express();

require("dotenv").config();

// CONFIG
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodoverride("_method"));

// MONGODB CONNECTION
global.Promise = mongoose.Promise;
mongoose.connect(process.env.MONGODB, {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify : false
});

app.use(session({
    secret : "Hotel 5 | 10 Session",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// ROUTES
app.use("/", Index);
app.use("/admin", Admin);

// LISTENING ON PORT
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
});
