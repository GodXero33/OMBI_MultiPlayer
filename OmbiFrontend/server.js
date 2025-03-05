const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware to log requests
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

// Disable caching
app.use((req, res, next) => {
	res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");
	next();
});

// Serve static files
app.use(express.static("public", {
	etag: false,
	lastModified: false,
	cacheControl: false
}));

app.use(cors());

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
