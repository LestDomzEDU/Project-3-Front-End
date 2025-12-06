
// server.js - simple Express server for Heroku
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// This is where Expo's web build will live
const buildPath = path.join(__dirname, "web-build");

// Serve static files (JS, CSS, images)
app.use(express.static(buildPath));

// For any route (/, /oauth, /settings, etc), send index.html
// so React Router / Expo Router can handle it on the client.
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on port ${PORT}`);
});
