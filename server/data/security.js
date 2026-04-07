const crypto = require("crypto");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, hash, salt) {
  if (!hash || !salt) {
    return false;
  }

  const incoming = crypto.scryptSync(String(password || ""), salt, 64);
  const stored = Buffer.from(hash, "hex");

  if (incoming.length !== stored.length) {
    return false;
  }

  return crypto.timingSafeEqual(incoming, stored);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
