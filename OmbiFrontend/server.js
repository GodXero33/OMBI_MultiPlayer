const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Use PORT from .env or default to 5500 if not specified
const PORT = process.env.PORT || 5500;

// Set up MySQL database connection using credentials from .env
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

// Connect to the MySQL database
db.connect((err) => {
	if (err) {
		console.error("Database connection failed: " + err.stack);
		return;
	}
	
	console.log("Connected to database");
});

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Example API endpoint to get all employees from the 'emple' table
app.get("/api/employees", (req, res) => {
	const query = "SELECT * FROM emple"; // Adjust table name if needed

	db.query(query, (err, results) => {
		if (err) {
			console.error("Error fetching employees: " + err.stack);
			return res.status(500).json({ success: false, error: err.message });
		}

		res.json({ success: true, data: results });
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
