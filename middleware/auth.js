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
        req.role = decoded.role || "Staff"; // Use role from token or default to Staff
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

