const accessList = require("./access-list.json");

module.exports = function (req, res, next) {
  let roles = [];

  if (req.session?.user?.role) {
    //for (let userRole of req.session.user.roles) {
      roles.push(req.session.user.role);
    //}
  } else {
    roles = ["anonymous"];
  }

  roles.push("*");

  console.log({
    "req.path": req.path,
    "req.method": req.method,
    "req.body": req.body,
    "req.session.user": req.session.user,
    roles: roles,
    accessList: accessList,
  });

  let found = false;

  for (access of accessList) {
    if (req.path.match(new RegExp(access.path))) {
      for (role of access.roles) {
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
