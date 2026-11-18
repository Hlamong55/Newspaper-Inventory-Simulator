// server/src/index.js  --  Express app entry point
const express = require("express");
const path = require("path");
const fs = require("fs");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", routes);

// Unknown /api route and bad JSON handling
app.use("/api", (req, res) => res.status(404).json({ error: "Unknown API route" }));

// Production: serve the built React app (client/dist) from the same server.
const dist = path.join(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: status === 400 ? "Invalid JSON body" : "Server error" });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
