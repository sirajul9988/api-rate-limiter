const express = require("express");
const app = express();

const requests = {};
const LIMIT = 5;
const WINDOW = 60 * 1000;

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requests[ip]) {
    requests[ip] = [];
  }

  requests[ip] = requests[ip].filter(
    timestamp => now - timestamp < WINDOW
  );

  if (requests[ip].length >= LIMIT) {
    return res.status(429).json({
      message: "Too many requests. Try again later."
    });
  }

  requests[ip].push(now);
  next();
}

app.use(rateLimiter);

app.get("/", (req, res) => {
  res.json({ message: "Request successful" });
});

app.listen(3000, () => {
  console.log("API Rate Limiter running on port 3000");
});
