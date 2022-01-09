module.exports = function (app) {
  const sqlite = require("sqlite3");
  // öppnar och ansluter till databasen
  const db = new sqlite.Database("./database/travel.db");
  // vi gör om metoderna all och run till promise-metoder så att vi kan använda async/await för att vänta på databasen
  const util = require("util");
  // db.all = util.promisify(db.all);
  // db.run = util.promisify(db.run);

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

  // ADD crosstable for groupMembers, groupModerators and categories
  app.post("/rest/groups", async (req, res) => {
    const newGroup = req.body;
    const sql =
      "INSERT INTO groups (creatorUserId, groupName, groupAccess, commentIds) VALUES (?, ?, ?, ?)";
    const params = [
      newGroup.creatorUserId,
      newGroup.groupName,
      newGroup.groupAccess,
      newGroup.commentIds,
    ];
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ success: "Post group to db succeeded" });
    });
  });

  app.post("/rest/comments", async (req, res) => {
    const newComment = req.body;
    const sql = "INSERT INTO comments (userId, date, content) VALUES (?, ?, ?)";
    const params = [newComment.userId, newComment.date, newComment.content];

    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "Returning comment ID",
        id: this.lastID,
      });
    });
  });

  return db;
};
