const   express             = require("express");
const   Index               = require("./routes/index");

const app = express();

require("dotenv").config();

// CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

// ROUTES
app.use("/", Index);

// LISTENING ON PORT
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
});
