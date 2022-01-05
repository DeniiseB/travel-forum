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


  return db;
}