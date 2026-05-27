const jwt = require("jsonwebtoken");
const STAFF = require("../model/staff");
const CUSTOMER = require("../model/customer");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "Fail", message: "No token" });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || "digitalks_secret_key";
    const decoded = jwt.verify(token, secretKey);

    let userVerify;
    if (decoded.role === "Customer") {
      userVerify = await CUSTOMER.findById(decoded.id);
      if (userVerify) {
        req.user = userVerify;
        req.role = "Customer";
      }
    } else {
      userVerify = await STAFF.findById(decoded.id);
      if (userVerify) {
        req.user = userVerify;
        req.role = decoded.role || userVerify.role || "Staff"; // Prefer role from token, then user doc

        // Fetch permissions for the role
        const ROLE = require("../model/role");
        const roleData = await ROLE.findOne({ name: req.role });
        let permissions = roleData ? roleData.permissions : {};

        // Special handling for Admin: ensure full access to all panels
        if (req.role === "Admin") {
          const PANELS = ["Dashboard", "Staff", "Customers", "Projects", "Tasks", "Teams", "Reports", "Roles", "Archive", "Support", "Finance"];
          const ACTIONS = ["create", "read_all", "read_own", "update", "delete"];
          PANELS.forEach(p => {
            permissions[p] = {};
            ACTIONS.forEach(a => permissions[p][a] = true);
          });
        }
        req.permissions = permissions;
      }
    }

    if (!userVerify) {
      return res.status(401).json({ status: "Fail", message: "Invalid token" });
    }

    next();
  } catch (err) {
    res.status(401).json({ status: "Fail", message: "Invalid token" });
  }
}

module.exports = authMiddleware;

