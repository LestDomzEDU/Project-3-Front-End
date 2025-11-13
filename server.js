const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Check which directory exists (dist or web-build)
const distPath = path.join(__dirname, 'dist');
const webBuildPath = path.join(__dirname, 'web-build');
const staticDir = fs.existsSync(distPath) ? distPath : webBuildPath;

console.log(`Serving static files from: ${staticDir}`);
console.log(`Directory exists: ${fs.existsSync(staticDir)}`);

// Serve static files
app.use(express.static(staticDir));

// Handle client-side routing - return index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h1>Build files not found</h1>
      <p>Expected directory: ${staticDir}</p>
      <p>Please check Heroku build logs to see where Expo exported the files.</p>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Static directory: ${staticDir}`);
});

