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
  // roles.push("member");

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
            // @todo case independent match?
            found = true;
          }
        }
      }
    }
  }

  if (found) {
    next();
  } else {
    res.status(403); // @todo skriva logik för att ge "rätt" felmeddelande, som 401 eller 403 beroende på om jag är inloggad eller inte
    res.json({ error: "You don't have access" });
  }
};
