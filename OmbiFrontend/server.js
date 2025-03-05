const express = require("express");
const cors = require("cors");

const app = express();

// Use PORT from environment variables or default to 5500
const PORT = process.env.PORT || 5500;

// Middlewares
app.use(express.static("public"));
app.use(cors());

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
