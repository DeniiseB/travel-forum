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
  const sqlite = require("sqlite3");
  // öppnar och ansluter till databasen
  const db = new sqlite.Database("./database/travel.db");
  // vi gör om metoderna all och run till promise-metoder så att vi kan använda async/await för att vänta på databasen
  const util = require("util");
  db.all = util.promisify(db.all);
  //  db.run = util.promisify(db.run);

  // REST routes (endpoints)
  app.get("/rest/users", async (req, res) => {
    let query = "SELECT * FROM users";
    let result = await db.all(query);
    res.json(result);
  });

  // Registrering
  app.post("/rest/users", async (request, response) => {
    let user = request.body;
    let encryptedPassword = getHash(user.password); // encrypted password
    let result;
    let userExists = await db.all(
      "SELECT * FROM users WHERE username = ?",
      user.username
    );
    userExists = userExists[0];

    try {
      result = await db.all("INSERT INTO users VALUES(?,?,?,?,?)", [
        null,
        user.username,
        encryptedPassword,
        null,
        null,
      ]);
      response.json(result);
    } catch (e) {
      console.error(e);
      response.status(400).send("Bad request");
    }
  });

  // Inloggning
  app.post("/rest/login", async (request, response) => {
    request.setTimeout(10);
    request.session.passwordAttempts = request.session.passwordAttempts || 1;

    if (request.session.passwordAttempts > 3) {
      await sleep(60000);
      request.session.passwordAttempts = 0; //Setting password attempts to 0 after 1 min
      response.status(403);
      response.json({
        error: "Attempts are now restored",
      });
      return;
    }

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    let encryptedPassword = getHash(request.body.password);
    let user = await db.all(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [request.body.username, encryptedPassword]
    );

    user = user[0];

    if (user && user.username) {
      request.session.user = user;
      request.session.passwordAttempts = 0;
      user.loggedIn = true;
      user.roles = ["user"]; // mock (@todo skapa roles tabell i databasen och joina med users)
      response.json({ loggedIn: true });
    } else {
      request.session.passwordAttempts++;
      response.status(401); // unauthorized  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.json({ loggedIn: false, message: "no matching user" });
    }
  });

  // Hämta inloggad användare
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

  //Logga ut
  app.delete("/rest/login", async (request, response) => {
    request.session.destroy(() => {
      response.json({ loggedIn: false });
    });
  });

  app.get("/rest/groups", async (req, res) => {
    let query = "SELECT * FROM groups";
    let result = await db.all(query);
    res.json(result);
  });

  // ADD crosstable for groupMembers, groupModerators and categories
  app.post("/rest/groups", (req, res) => {
    const newGroup = req.body;
    const sql =
      "INSERT INTO groups (creatorUserId, groupName, groupAccess, commentIds) VALUES (?, ?, ?, ?)";
    const params = [
      newGroup.creatorUserId,
      newGroup.groupName,
      newGroup.groupAccess,
      newGroup.commentIds,
    ];

    if (
      !newGroup.creatorUserId ||
      !newGroup.groupName.trim() ||
      !newGroup.groupAccess.trim() ||
      !newGroup.commentIds.trim()
    ) {
      res.json({ error: "No empty fields allowed" });
      return;
    }

    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ success: "Post group to db succeeded" });
    });
  });

  app.post("/rest/comments", (req, res) => {
    const newComment = req.body;
    const sql = "INSERT INTO comments (userId, date, content) VALUES (?, ?, ?)";
    const params = [newComment.userId, newComment.date, newComment.content];

    if (!newComment.userId || !newComment.date || !newComment.content.trim()) {
      res.json({ error: "No empty fields allowed" });
      return;
    }

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

  app.get("/rest/categories", async (req, res) => {
    let query =
      "SELECT COUNT(*) as groupAmount,categories.name,categories.id FROM groupsXcategories, categories, groups WHERE groupsXcategories.categoryId = categories.id AND groupsXcategories.groupId = groups.id GROUP BY categories.name";
    let result = await db.all(query);
    res.json(result);
  });

  app.get("/rest/categories/:id", (req, res) => {
    const query = "SELECT * FROM categories WHERE id = ?"
    const params = [req.params.id]
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.log("row ", row)
      res.json({
        message: "Great success",
        data: row,
      });
    });
  })

  return db;
};
