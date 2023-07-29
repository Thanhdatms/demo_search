const express = require("express");
const app = express();
const mysql = require("mysql");
const ejs = require("ejs");

const db = mysql.createConnection({
    host: "dangdatdatabase.cixu2ufy0ujz.ap-southeast-2.rds.amazonaws.com",
    port: "3306",
    user: "DatDang", 
    password: "Dat1234nam",
    database: "demoDangDat",
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Database is connected");
});

// Set EJS as the view engine
app.set("view engine", "ejs");

// Route to display the data
app.get("/", (req, res) => {
    const query = "SELECT * FROM users"; // Replace 'users' with your table name

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching data from the database:", err.message);
            return;
        }
        res.render("index", { users: result }); // Pass the fetched data to the "index.ejs" template
    });
});

// Route to display the search page

app.get("/search", (req, res) => {
    res.render("search");
});

// Route to handle search based on keyword
app.get("/search/:keyword", (req, res) => {
    const keyword = req.params.keyword;
    const query = "SELECT * FROM users WHERE name LIKE ?"; // Assuming the column for user names is "name"

    db.query(query, [`%${keyword}%`], (err, result) => {
        if (err) {
            console.error("Error fetching data from the database:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        res.json(result);
    });
});



const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});