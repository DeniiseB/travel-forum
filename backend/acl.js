const accessList = require("./access-list.json");

module.exports = function (req, res, next) {
  let roles = [];

  if (req.session?.user?.role) {
      roles.push(req.session.user.role);
  } else {
    roles = ["anonymous"];
  }

  roles.push("*");

  let found = false;

  for (access of accessList) {
    if (req.path.match(new RegExp(access.path))) {
      for (let role of access.roles) {
        if (roles.includes(role.role)) {
          if (role.methods.includes(req.method)) {
            found = true;
          }
        }
      }
    }
  }

  if (found) {
    next();
  } else {
    res.status(403);
    res.json({ error: "You don't have access" });
  }
};
