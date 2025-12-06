// server.js - simple Express server for Heroku
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// This is where Expo's web build will be exported
const buildPath = path.join(__dirname, "web-build");

// Serve static files (JS, CSS, images)
app.use(express.static(buildPath));

// Catch-all route: send index.html for any path
// This pattern works fine with Express 4
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on port ${PORT}`);
});
