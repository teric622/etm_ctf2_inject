const express = require('express');
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Simulated database for the challenge
const secretsTable = {
    part1: "Q1RGe2V0bXNr",     // Base64 for "CTF{etms"
    part2: "aWJpZGlfNDgz",     // Base64 for "kibidi_483"
    part3: "c3FsX2luamVjdGlvbn0=" // Base64 for "sql_injection}"
};

// Serve the frontend HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle login submissions
app.post('/login', (req, res) => {
    console.log("Raw req.body:", req.body); // Debugging line

    // Validate inputs
    const username = req.body.username ? req.body.username.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";

    console.log(`Parsed username: "${username}", password: "${password}"`); // Verify parsed values

    // Console hints for the player
    if (username === "") {
        console.log("Hint: Start by testing with simple SQL Injection payloads, like ' OR '1'='1");
    } else if (username.toUpperCase().includes("UNION")) {
        console.log("Hint: You’re close! Try extracting 'part1', 'part2', and 'part3' columns.");
    }

    // Check if username or password is missing
    if (!username || !password) {
        return res.send("Error: Missing username or password.");
    }

    // Simulated normal login
    if (username === "admin" && password === "password123") {
        return res.send("Welcome, admin!");
    }

    // Simulated SQL Injection for UNION SELECT
    if (username.toUpperCase().includes("UNION SELECT")) {
        const query = username.toUpperCase();
        if (query.includes("PART1") && query.includes("PART2") && query.includes("PART3")) {
            console.log("Well done! You've extracted the correct columns.");
            return res.send(`
                Flag Parts: ${secretsTable.part1} ${secretsTable.part2} ${secretsTable.part3}
                <br>(OOOPS, looks like this is encoded. Can you figure it out?)
                <br>FLAG_FOUND
            `);
        }
        console.log("Hint: Check your column names carefully.");
        return res.send("Error: Invalid column names or query structure.");
    }

    // Invalid input
    console.log("Invalid attempt. Keep trying!");
    return res.send("Incorrect login or invalid query.");
});

// Handle flag submission
app.post('/submit-flag', (req, res) => {
    const submittedFlag = req.body.flag ? req.body.flag.trim() : "";
    const correctFlag = "CTF{etmskibidi_483sql_injection}";

    if (submittedFlag === correctFlag) {
        console.log("Correct flag submitted.");
        return res.send("Congrats!");
    } else {
        console.log("Incorrect flag submitted.");
        // Respond with a message and embed the GIF
        return res.send(`
            <div>
                <p>❌ Incorrect flag. Try again!</p>
                <iframe src="https://giphy.com/embed/ra75UYT9LjKSY" width="480" height="480" frameborder="0" allowfullscreen></iframe>
                <p><a href="https://giphy.com/gifs/ra75UYT9LjKSY">via GIPHY</a></p>
            </div>
        `);
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
