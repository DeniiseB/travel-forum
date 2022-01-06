// välj SQL-version
const selectedSQL = ["sqlite"][0]; // 0 = sqlite, 1 = mysql, 2 = mssql

// server port
let port = 8000;

// express server
let express = require("express");
const app = express();

//Flood control
const floodControl = require("./flood-control.js")
app.use(floodControl)



// set limit for json request body
app.use(express.json({ limit: "100MB" }));

// serve frontend files (built)
app.use(express.static("../frontend"));

// läser in modulen body-parser
const bodyParser = require("body-parser");
// registrerar den som middleware
app.use(bodyParser.json());

// läser in modulen...
let cookieParser = require("cookie-parser");
// registrerar den som middleware
app.use(cookieParser());

// läser in module...
let session = require("express-session");
// registrerar den som middleware
app.use(
  session({
    secret: "keyboard cat jksfj<khsdka",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
    }, 
  })
);



// ACL
const acl = require("./acl.js");
app.use(acl);

 
// database specific REST ROUTES
const db = require("./server-" + selectedSQL + ".js")(app);




// start av webbservern
app.listen(port, async () => {
     if(db.connect){ // connect to db server if there is one (sqlite does not use one)
        await db.connect()
    } 
    console.log(`http://localhost:${port}/rest/`)
    console.log('server running on port ' + port)
})