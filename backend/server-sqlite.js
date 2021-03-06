const crypto = require("crypto");
const { join } = require("path");
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

  const db = new sqlite.Database("./database/travel.db");

  const util = require("util");
  db.all = util.promisify(db.all);

  // REST routes (endpoints)

  // Inloggning
  app.post("/rest/login", async (request, response) => {
    try {
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
        if (user.blocked) {
          response.status(403);
          response.json({ blocked: true });
        } else {
          roleName = await db.all(
            "SELECT roleName FROM rolesXusers WHERE userId= ?",
            [user.id]
          );
          roleName = roleName[0].roleName;

          request.session.user = user;

          console.log(request.session.user);
          request.session.passwordAttempts = 0;
          user.loggedIn = true;
          user.role = roleName;
          response.json({ loggedIn: true });
        }
      } else {
        request.session.passwordAttempts++;
        response.status(401);
        response.json({ loggedIn: false, message: "no matching user" });
      }
    } catch (e) {
      console.log(e);
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
      delete user.password;
      roleName = await db.all(
        "SELECT roleName FROM rolesXusers WHERE userId= ?",
        [user.id]
      );
      roleName = roleName[0].roleName;
      user.role = roleName;
      response.json(user);
    } else {
      response.status(401);
      response.json({ loggedIn: false, message: "not logged in" });
    }
  });

  //Logga ut
  app.delete("/rest/login", async (request, response) => {
    request.session.destroy(() => {
      response.json({ loggedIn: false });
    });
  });

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
      result = await db.all("INSERT INTO users VALUES(?,?,?,?,?,?)", [
        null,
        user.username,
        encryptedPassword,
        "",
        "",
        false,
      ]);

      let lastInsertedUser = await db.all(
        "SELECT * FROM users WHERE username = ?",
        user.username
      );
      let userId = lastInsertedUser[0].id;
      await db.all("INSERT INTO rolesXusers VALUES(?,?,?)", [
        null,
        userId,
        "member",
      ]);
      response.json(result);
    } catch (e) {
      console.error(e);
      response.status(400).send("Bad request");
    }
  });

  app.get("/rest/users/:id", (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      let user = row;
      delete user.password;
      res.json({
        message: "Great success",
        data: user,
      });
    });
  });

  //Deleting user from db
  app.delete("/rest/users/:id", async (req, res) => {
    try {
      let thisUser = await db.all("SELECT * FROM users WHERE users.id = ?", [
        req.params.id,
      ]);

      await db.all("DELETE FROM users WHERE users.id = ?", [req.params.id]);
      await db.all("DELETE FROM rolesXusers WHERE rolesXusers.userId = ?", [
        req.params.id,
      ]);

      let commentsOfUser = await db.all(
        "SELECT id FROM comments WHERE comments.author = ?",
        [thisUser[0].username]
      );

      await db.all("DELETE FROM comments WHERE comments.author = ?", [
        thisUser[0].username,
      ]);

      let allGroups = await db.all("SELECT * FROM groups");
      for (let group of allGroups) {
        let groupCommentIds = group.commentIds.split(" ");

        for (let commentId of groupCommentIds) {
          for (let userComment of commentsOfUser) {
            if (commentId == userComment.id) {
              groupCommentIds.splice(groupCommentIds.indexOf(commentId, 1));
            }
          }
        }

        await db.all("UPDATE groups SET commentIds = ? WHERE groups.id = ?", [
          groupCommentIds.join(" "),
          group.id,
        ]);

        let joinedMembersArr = group.groupMembers.split(" ");
        if (joinedMembersArr.includes(req.params.id)) {
          joinedMembersArr.splice(joinedMembersArr.indexOf(req.params.id), 1);
          if (joinedMembersArr.length > 0) {
            await db.all(
              "UPDATE groups SET groupMembers = ? WHERE groups.id = ?",
              [joinedMembersArr.join(" "), group.id]
            );
          } else {
            await db.all(
              "UPDATE groups SET groupMembers = ? WHERE groups.id = ?",
              ["", group.id]
            );
          }
        }
      }

      res.json({
        deleted: "true",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: "Something went wrong",
      });
    }
  });

  app.get("/rest/users/name/:username", (req, res) => {
    const query = "SELECT * FROM users WHERE username = ?";
    const params = [req.params.username];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      let user = row;
      delete user.password;
      res.json({
        data: user,
      });
    });
  });

  //Blocking user
  app.patch("/rest/users/block/:id", async (req, res) => {
    try {
      await db.all("UPDATE users SET blocked = ? WHERE users.id = ?", [
        true,
        req.params.id,
      ]);
      res.json({
        blocked: "true",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: "Something went wrong",
      });
    }
  });

  //Unblock user
  app.patch("/rest/users/unblock/:id/", async (req, res) => {
    try {
      await db.all("UPDATE users SET blocked = ? WHERE users.id = ?", [
        false,
        req.params.id,
      ]);
      res.json({
        unblocked: "true",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: "Something went wrong",
      });
    }
  });

  app.patch("/api/user/joinedgroup/:id", (req, res) => {
    var data = {
      joinedGroups: req.body.groupIds,
    };
    db.run(
      `UPDATE users set 
           joinedGroups = COALESCE(?,joinedGroups)
           WHERE id = ?`,
      [data.joinedGroups, req.params.id],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({
          message: "success",
          data: data,
          changes: this.changes,
        });
      }
    );
  });

  app.patch("/api/user/createdgroup/:id", (req, res) => {
    var data = {
      createdGroups: req.body.createdGroupIds,
      joinedGroups: req.body.joinedGroupIds,
    };
    db.run(
      `UPDATE users set 
           createdGroups = COALESCE(?,createdGroups),
           joinedGroups = COALESCE(?,joinedGroups)
           WHERE id = ?`,
      [data.createdGroups, data.joinedGroups, req.params.id],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({
          message: "success",
          data: data,
          changes: this.changes,
        });
      }
    );
  });

  app.get("/rest/groups", async (req, res) => {
    let query = "SELECT * FROM groups";
    let result = await db.all(query);
    res.json(result);
  });

  app.get("/rest/groups/:id", (req, res) => {
    const query = "SELECT * FROM groups WHERE id = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.json({
        message: "Great success",
        data: row,
      });
    });
  });

  app.patch("/api/groups/:id", (req, res) => {
    var data = {
      groupMembers: req.body.userIds,
    };
    db.run(
      `UPDATE groups set 
           groupMembers = COALESCE(?,groupMembers)
           WHERE id = ?`,
      [data.groupMembers, req.params.id],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({
          message: "success",
          data: data,
          changes: this.changes,
        });
      }
    );
  });

  //Posting new group
  app.post("/rest/groups", async (req, res) => {
    const newGroup = req.body;
    const sql =
      "INSERT INTO groups (creatorUserId, groupName, groupAccess, commentIds, groupMembers, groupModerators) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [
      newGroup.creatorUserId,
      newGroup.groupName,
      newGroup.groupAccess,
      newGroup.commentIds,
      newGroup.groupMembers,
      newGroup.groupModerators,
    ];

    if (req.session.user.role !== "groupAdmin") {
      await db.all(
        "UPDATE rolesXusers SET roleName = ? WHERE rolesXusers.userId = ?",
        ["groupAdmin", newGroup.creatorUserId]
      );
      req.session.user.role = "groupAdmin";
    }

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
      res.json({
        success: "Post group to db succeeded",
        id: this.lastID,
      });
    });
  });

  app.patch("/rest/groups/:id", async (req, res) => {
    try {
      let data = await db.all(
        "UPDATE groups SET commentIds = ? WHERE groups.id = ?",
        [req.body.str, req.params.id]
      );
      if (!req.body.str || !req.params.id) {
        res.json({ error: "No empty fields allowed" });
        return;
      }
      if (res.error) {
        res.status(400).json({ error: res.error.message });
        return;
      }

      res.json({
        message: "PUT into groups.commentId Success",
      });
    } catch (e) {
      console.log(e);
    }
  });

  //Deleting group
  app.delete("/rest/groups/:id", async (req, res) => {
    try {
      await db.all("DELETE FROM groups WHERE groups.id = ?", [req.params.id]);
      await db.all(
        "DELETE FROM groupsXcategories WHERE groupsXcategories.groupId = ?",
        [req.params.id]
      );

      let allUsers = await db.all("SELECT * FROM users");

      for (let user of allUsers) {
        let createdGroupsArr = user.createdGroups.split(" ");
        let joinedGroupsArr = user.joinedGroups.split(" ");
        if (createdGroupsArr.includes(req.params.id)) {
          createdGroupsArr.splice(createdGroupsArr.indexOf(req.params.id), 1);

          await db.all(
            "UPDATE users SET createdGroups = ? WHERE users.id = ?",
            [createdGroupsArr.join(" ").toString(), user.id]
          );
        }
        if (joinedGroupsArr.includes(req.params.id)) {
          joinedGroupsArr.splice(joinedGroupsArr.indexOf(req.params.id), 1);
          await db.all("UPDATE users SET joinedGroups = ? WHERE users.id = ?", [
            joinedGroupsArr.join(" ").toString(),
            user.id,
          ]);
        }
      }
      res.json({
        deleted: "true",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: "Something went wrong",
      });
    }
  });

  app.post("/rest/comments", (req, res) => {
    const newComment = req.body;
    const sql =
      "INSERT INTO comments (userId, date, content, author) VALUES (?, ?, ?, ?)";
    const params = [
      newComment.userId,
      newComment.date,
      newComment.content,
      newComment.author,
    ];

    if (
      !newComment.userId ||
      !newComment.date ||
      !newComment.content.trim() ||
      !newComment.author
    ) {
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

  app.get("/rest/comments/:id", (req, res) => {
    const query = "SELECT * FROM comments WHERE id = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.json({
        message: "Great success",
        data: row,
      });
    });
  });

  //Deleting comment from a group
  app.delete("/rest/comments/:id", async (req, res) => {
    try {
      await db.all("DELETE FROM comments WHERE comments.id = ?", [
        req.params.id,
      ]);

      let allGroups = await db.all("SELECT * FROM groups");
      for (let group of allGroups) {
        let commentsArr = group.commentIds.split(" ");

        if (commentsArr.includes(req.params.id)) {
          commentsArr.splice(commentsArr.indexOf(req.params.id), 1);
          await db.all("UPDATE groups SET commentIds = ? WHERE groups.id = ?", [
            commentsArr.join(" ").toString(),
            group.id,
          ]);
        }
      }
      res.json({
        deleted: "true",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: "Something went wrong",
      });
    }
  });

  app.get("/rest/categories", async (req, res) => {
    let query = "SELECT * from categories";
    let result = await db.all(query);
    res.json(result);
  });

  app.get("/rest/categories/:id", (req, res) => {
    const query = "SELECT * FROM categories WHERE id = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.log("row ", row);
      res.json({
        message: "Great success",
        data: row,
      });
    });
  });

  app.get("/rest/groupsxcategories", async (req, res) => {
    let query =
      "SELECT COUNT(*) as groupAmount,categories.name,categories.id FROM groupsXcategories, categories, groups WHERE groupsXcategories.categoryId = categories.id AND groupsXcategories.groupId = groups.id GROUP BY categories.name";
    let result = await db.all(query);
    res.json(result);
  });

  app.post("/rest/groupsxcategories", (req, res) => {
    const newRow = req.body;
    const sql =
      "INSERT INTO groupsXcategories (groupId, categoryId) VALUES (?, ?)";
    const params = [newRow.groupId, newRow.categoryId];

    if (!newRow.groupId || !newRow.categoryId) {
      res.json({ error: "No empty fields allowed" });
      return;
    }

    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ success: "Post to groupsXcategories db succeeded" });
    });
  });

  app.get("/rest/groupsxcategories/:id", async (req, res) => {
    const query = "SELECT groupId FROM groupsXcategories WHERE categoryId = ?";
    const params = [req.params.id];
    let result = await db.all(query, params);
    res.json(result);
  });

  //Get created groups of user
  app.get("/rest/created-groups/:userId", async (req, res) => {
    let group;

    if (req.params.userId !== undefined) {
      try {
        user = await db.all("SELECT * FROM users WHERE id = ?", [
          req.params.userId,
        ]);
        user = user[0];

        if (user.createdGroups !== "") {
          let groupsIdsArr = user.createdGroups.split(" ");

          let createdGroupsArr = [];
          try {
            for (let groupdId of groupsIdsArr) {
              group = await db.all("SELECT * FROM groups WHERE id = ?", [
                groupdId,
              ]);
              group = group[0];
              console.log("group is", group);
              let categoryName = await db.all(
                "SELECT name from categories INNER JOIN groupsXcategories ON groupsXcategories.groupId=? AND groupsXcategories.categoryId=categories.id",
                [group.id.toString()]
              );
              console.log("name is ", categoryName[0]);
              group.category = categoryName[0].name;

              createdGroupsArr.push(group);
            }
            res.json(createdGroupsArr);
          } catch (e) {
            console.log(e);
            response.status(400).send("Bad request");
          }
        } else {
          let emptyArr = [];
          res.json(emptyArr);
        }
      } catch (e) {
        console.error(e);
        response.status(400).send("Bad request");
      }
    }
  });

  //Get created groups of user
  app.get("/rest/joined-groups/:userId", async (req, res) => {
    let group;

    if (req.params.userId !== undefined) {
      try {
        user = await db.all("SELECT * FROM users WHERE id = ?", [
          req.params.userId,
        ]);
        user = user[0];

        if (user.joinedGroups !== "") {
          let groupsIdsArr = user.joinedGroups.split(" ");

          let joinedGroupsArr = [];
          try {
            for (let groupdId of groupsIdsArr) {
              group = await db.all("SELECT * FROM groups WHERE id = ?", [
                groupdId,
              ]);
              group = group[0];
              let categoryName = await db.all(
                "SELECT name from categories INNER JOIN groupsXcategories ON groupsXcategories.groupId=? AND groupsXcategories.categoryId=categories.id",
                [group.id.toString()]
              );
              group.category = categoryName[0].name;
              joinedGroupsArr.push(group);
            }
            res.json(joinedGroupsArr);
          } catch (e) {
            console.log(e);
            response.status(400).send("Bad request");
          }
        } else {
          let emptyArr = [];
          res.json(emptyArr);
        }
      } catch (e) {
        console.error(e);
        response.status(400).send("Bad request");
      }
    }
  });

  app.get("/rest/groups/:id", (req, res) => {
    const query = "SELECT * FROM groups WHERE id = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.json({
        message: "Great success",
        data: row,
      });
    });
  });

  app.patch("/api/groups/:id", (req, res) => {
    var data = {
      groupMembers: req.body.userIds,
    };
    db.run(
      `UPDATE groups set 
           groupMembers = COALESCE(?,groupMembers)
           WHERE id = ?`,
      [data.groupMembers, req.params.id],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.json({
          message: "success",
          data: data,
          changes: this.changes,
        });
      }
    );
  });

  app.post("/rest/comments", (req, res) => {
    const newComment = req.body;
    const sql =
      "INSERT INTO comments (userId, date, content, author) VALUES (?, ?, ?, ?)";
    const params = [
      newComment.userId,
      newComment.date,
      newComment.content,
      newComment.author,
    ];

    if (
      !newComment.userId ||
      !newComment.date ||
      !newComment.content.trim() ||
      !newComment.author.trim()
    ) {
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

  app.get("/rest/comments/:id", (req, res) => {
    const query = "SELECT * FROM comments WHERE id = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.json({
        message: "Great success",
        data: row,
      });
    });
  });

  app.get("/rest/commentsByUser/:id", (req, res) => {
    const query = "SELECT id FROM comments WHERE userId = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.json({
        message: "Great success",
        data: row,
      });
    });
  });

  app.get("/rest/groupsxcategories", async (req, res) => {
    let query =
      "SELECT COUNT(*) as groupAmount,categories.name,categories.id FROM groupsXcategories, categories, groups WHERE groupsXcategories.categoryId = categories.id AND groupsXcategories.groupId = groups.id GROUP BY categories.name";
    let result = await db.all(query);
    res.json(result);
  });

  app.post("/rest/groupsxcategories", (req, res) => {
    const newRow = req.body;
    const sql =
      "INSERT INTO groupsXcategories (groupId, categoryId) VALUES (?, ?)";
    const params = [newRow.groupId, newRow.categoryId];

    if (!newRow.groupId || !newRow.categoryId) {
      res.json({ error: "No empty fields allowed" });
      return;
    }

    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ success: "Post to groupsXcategories db succeeded" });
    });
  });

  app.get("/rest/categories", async (req, res) => {
    let query = "SELECT * from categories";
    let result = await db.all(query);
    res.json(result);
  });

  app.get("/rest/categories/:id", (req, res) => {
    const query = "SELECT * FROM categories WHERE id = ?";
    const params = [req.params.id];
    db.get(query, params, (error, row) => {
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.log("row ", row);
      res.json({
        message: "Great success",
        data: row,
      });
    });
  });

  app.get("/rest/groupsxcategories/:id", async (req, res) => {
    const query = "SELECT groupId FROM groupsXcategories WHERE categoryId = ?";
    const params = [req.params.id];
    let result = await db.all(query, params);
    res.json(result);
  });
  app.patch("/rest/groups/:id", async (req, res) => {
    try {
      let data = await db.all(
        "UPDATE groups SET commentIds = ? WHERE groups.id = ?",
        [req.body.str, req.params.id]
      );
      if (!req.body.str || !req.params.id) {
        res.json({ error: "No empty fields allowed" });
        return;
      }
      if (res.error) {
        res.status(400).json({ error: res.error.message });
        return;
      }

      res.json({
        message: "PUT into groups.commentId Success",
      });
    } catch (e) {
      console.log(e);
    }
  });
  app.patch("/rest/users/:id", async (req, res) => {
    try {
      let thisUser = await db.all("SELECT * FROM users WHERE users.id = ?", [req.params.id]);
      let commentsOfUser = await db.all("SELECT id FROM comments WHERE comments.author = ?", [thisUser[0].username]);

      await db.all("DELETE FROM comments WHERE comments.author = ?", [thisUser[0].username,]);


      let allGroups = await db.all("SELECT * FROM groups");
      for (let group of allGroups) {

        let userGroups = thisUser[0].joinedGroups.split(" ");
        for (let userGroup of userGroups) {

          if (userGroup == group.id) {
            userGroups.splice(userGroups.indexOf(userGroup), 1);
          }
        }

        let groupCommentIds = group.commentIds.split(" ")

        for (let commentId of groupCommentIds) {
          for (let userComment of commentsOfUser) {
            if (commentId == userComment.id) {

              groupCommentIds.splice(groupCommentIds.indexOf(commentId, 1));
            }
          }
        }
        await db.all("UPDATE users SET joinedGroups = ? WHERE joinedGroups = ?", [
          userGroups.join(" "),
          group.id,
        ]);
        await db.all("UPDATE groups SET commentIds = ? WHERE groups.id = ?", [
          groupCommentIds.join(" "),
          group.id,
        ]);

        let joinedMembersArr = group.groupMembers.split(" ");
        if (joinedMembersArr.includes(req.params.id)) {
          joinedMembersArr.splice(joinedMembersArr.indexOf(req.params.id), 1);
          if (joinedMembersArr.length > 0) {
            await db.all(
              "UPDATE groups SET groupMembers = ? WHERE groups.id = ?",
              [joinedMembersArr.join(" "), group.id]
            );
          } else {
            await db.all(
              "UPDATE groups SET groupMembers = ? WHERE groups.id = ?",
              ["", group.id]
            );
          }
        }
      }

      res.json({
        removed: "true",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: "Something went wrong",
      });
    }
  });
  return db;
};
