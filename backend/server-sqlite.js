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

  // UPDATE with correct values ***********************
  app.post("/rest/groups", async (req, res) => {
    const newGroup = req.body;
    try {
      db.run(
        "INSERT INTO groups (creatorUserId, groupName, groupAccess) VALUES (?, ?, ?)",
        [newGroup.creatorUserId, newGroup.groupName, newGroup.groupAccess]
      );
      res.json({ success: "Post group to db succeeded" });
    } catch {
      res.json({ error: "Post group to db failed" });
    }
  });

  app.post("/rest/comments", async (req, res) => {
    const newComment = req.body;
    try {
      db.run("INSERT INTO comments (userId, date, content) VALUES (?, ?, ?)", [
        newComment.userId,
        newComment.date,
        newComment.content,
      ]);
      res.json({ success: "Post comment to db succeeded", response: res });
    } catch {
      res.json({ error: "Post comment to db failed" });
    }
  });

  return db;
};
