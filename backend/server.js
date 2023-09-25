const express = require("express");//import express
const app = express();
const cors = require("cors");
const mysql = require("mysql2"); // Import the mysql2 library

app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "miniproject"
});

//verifying connection to the database is establshed or not
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});
//creating a table userDetails
db.query(`
  CREATE TABLE IF NOT EXISTS usersDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeId VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL
  )
`, (err, results) => {
  if (err) {
    console.error("Error creating 'users' table:", err);
  } else {
    console.log("'usersDetails' table created");
  }
});
 // Middleware to parse JSON request bodies
 app.use(express.json());

 app.post("/api/signup", (req, res) => {
    const userdetails = req.body;
  
    // Check if the username or email already exists in the table
    db.query(
      "SELECT * FROM usersDetails WHERE username = ? OR email = ?",
      [userdetails.username, userdetails.email],
      (err, results) => {
        if (err) {
            console.log("checking");
          console.error("Error checking existing user details:", err);
          res.status(500).json({ message: "Error checking user details" });
        } else {
           if(results.length==0) {
            // Insert user details into the table usersDetails
            db.query(
              "INSERT INTO usersDetails (employeeId,username, password, email,phonenumber) VALUES (?,?, ?, ?,?)",
              [userdetails.employeeId,userdetails.username, userdetails.password, userdetails.email,userdetails.phonenumber],
              (err, insertResults) => {
                if (err) {
                   
                  console.log("500");
                  res.status(500).json({ message: "Error inserting user details" });
                } else {
                  console.log("User registered successfully");
                  res.status(201).json({ message: "User registered successfully" });
                }
              }
            );
          }
        else{
            // User with the same username or email already exists
            console.log(res.statusCode);
            res.status(200).json({ message: "User already exists" });
            
          }
        }
      }
    );
  });

//API for login page
app.post("/api/login", (req, res) => {
    const { userlogindetails } = req.body;
  
    // Check if the username and password match a record in the database
    db.query(
      "SELECT * FROM usersDetails WHERE username = ? AND password = ?",
      [userlogindetails.username, userlogindetails.password],
      (err, results) => {
        if (err) {
            console.log("500");
          console.error("Error checking user details:", err);
          res.status(500).json({ message: "Error checking user details" });
        } else {
          if (results.length > 0) {
            
            // User with the provided username and password exists
            const user = results[0];
            res.status(200).json({ message: "Login successful",user });
          } else {
            // No user with matching credentials found
            res.status(401).json({ message: "Invalid credentials" });
          }
        }
      }
    );
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

