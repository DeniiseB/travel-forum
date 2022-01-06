module.exports = function (app) {
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

  app.get("/rest/groups", async (req, res) => {
    let query = "SELECT * FROM groups";
    let result = await db.all(query);
    res.json(result);
  });

  app.post("/rest/groups", async (req, res) => {
    const newGroup = req.body;
    console.log("newGroup: ", newGroup);
    try {
      let result = db.run("INSERT INTO groups (creatorUserId, groupName) VALUES (?, ?)", [newGroup.creatorUserId, newGroup.groupName]);
      res.json({ success: "Post to db successful" }, result);
    } catch {
      res.json({ error: "Post to db failed" });
    }
  });

  return db;
};
