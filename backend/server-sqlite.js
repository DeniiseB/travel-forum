const crypto = require("crypto");
const salt = "öoaheriaheithfd".toString("hex");
function getHash(password) {
  // utility att skapa kryperade lösenord
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString("hex");
  return hash;
}


module.exports = function (app) {
  // mysqlite
  const sqlite = require("sqlite3");
  // öppnar och ansluter till databasen
  const db = new sqlite.Database("./database/travel.db");
  // vi gör om metoderna all och run till promise-metoder så att vi kan använda async/await för att vänta på databasen
  const util = require("util");
  db.all = util.promisify(db.all);
  db.run = util.promisify(db.run);

  // REST routes (endpoints)
  app.get("/rest/users", async (req, res) => {
    let query = "SELECT * FROM users";
    let result = await db.all(query);
    res.json(result);
  });

  //Registrering
  app.post("/rest/users", async (request, response) => {
    let user = request.body;
    let encryptedPassword = getHash(user.password); // encrypted password
    let result;
    let userExists = await db.all("SELECT * FROM users WHERE username = ?", user.username);
    userExists = userExists[0]
    
      try {
        result = await db.all("INSERT INTO users VALUES(?,?,?)", [
          null,
          user.username,
          encryptedPassword,
        ]);
         response.json(result); 
      } catch (e) {
        console.error(e);
        response.status(400).send("Bad request");

      }
    
    
   
    
  });

  //inloggning
  app.post("/rest/login", async (request, response) => {
    let encryptedPassword = getHash(request.body.password);
    let user = await db.all(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [request.body.username, encryptedPassword]
    );

    user = user[0];
    console.log("request.session.verification", request.session.verification);

    if (user && user.username) {
      request.session.user = user;
      user.loggedIn = true;
      user.roles = ["user"]; // mock (@todo skapa roles tabell i databasen och joina med users)
      response.json({ loggedIn: true });
    } else {
      response.status(401); // unauthorized  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.json({ loggedIn: false, message: "no matching user" });
    }
  });

  //Hämta inloggad användare
  app.get("/rest/login", async (request, response) => {
    let user;
    if (request.session.user) {
      user = await db.all(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [request.session.user.username, request.session.user.password]
      );
      user = user[0];
    }
    if (user && user.username) {
      user.loggedIn = true;
      delete user.password; // skicka aldrig password till frontend
      response.json(user);
    } else {
      response.status(401); // unauthorized  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.json({ loggedIn: false, message: "not logged in" });
    }
  });

  // logga ut
  app.delete("/rest/login", async (request, response) => {
    request.session.destroy(() => {
      response.json({ loggedIn: false });
    });
  });

  return db;
};
