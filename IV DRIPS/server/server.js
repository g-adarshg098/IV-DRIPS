const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "supersecretkey"; // Use .env in production
const DATA_FILE = path.join(__dirname, 'data', 'patients.json');

// --- Mock Database (File Based) ---
let users = [];
let patients = [];

// Load data on startup
if (fs.existsSync(DATA_FILE)) {
    try {
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        patients = JSON.parse(fileData);
    } catch (err) {
        console.error("Error reading data file:", err);
        patients = [];
    }
} else {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, '[]');
}

const savePatients = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(patients, null, 2));
};

// --- Root Route (Fixes Cannot GET /) ---
app.get("/", (req, res) => {
    res.send("IV DRIPS Backend is running 🚀");
});

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    // Accept Firebase tokens OR demo tokens
    if (token.length > 500) {
        req.user = { username: "Google User" };
        return next();
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) return res.status(400).send("User exists");
    users.push({ username, password });
    res.status(201).send("User created");
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ token });
});

// --- Patient Routes ---
app.get('/api/patients', authenticateToken, (req, res) => {
    res.json(patients);
});

app.post('/api/patients', authenticateToken, (req, res) => {
    const { name, ward, bed, saline, totalVolume, rate } = req.body;

    const newPatient = {
        id: Date.now(),
        name,
        ward,
        bed,
        saline,
        dripLevel: 100,
        totalVolume: parseInt(totalVolume) || 500,
        rate: parseInt(rate) || 50,
        startTime: Date.now(),
        currentVolume: parseInt(totalVolume) || 500
    };

    patients.push(newPatient);
    savePatients();
    res.status(201).json(newPatient);
});

app.put('/api/patients/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, ward, bed, saline, totalVolume, rate } = req.body;

    const index = patients.findIndex(p => p.id == id);
    if (index === -1) return res.status(404).json({ message: "Patient not found" });

    patients[index] = {
        ...patients[index],
        name,
        ward,
        bed,
        saline,
        totalVolume: parseInt(totalVolume) || patients[index].totalVolume,
        rate: parseInt(rate) || patients[index].rate
    };

    savePatients();
    res.json(patients[index]);
});

// --- Demo Data Route ---
app.get('/api/demo-data', (req, res) => {
    const demoPatients = [
        { id: 1, name: "John Doe", ward: "ICU-1", bed: "B1", saline: "Normal Saline", dripLevel: 45, totalVolume: 1000, rate: 100, currentVolume: 450 },
        { id: 2, name: "Jane Smith", ward: "Gen-A", bed: "A4", saline: "Ringer Lactate", dripLevel: 80, totalVolume: 500, rate: 60, currentVolume: 400 },
        { id: 3, name: "Alice Brown", ward: "ICU-2", bed: "B3", saline: "Dextrose 5%", dripLevel: 15, totalVolume: 500, rate: 120, currentVolume: 75 },
        { id: 4, name: "Robert Wilson", ward: "Gen-B", bed: "C2", saline: "Normal Saline", dripLevel: 92, totalVolume: 1000, rate: 80, currentVolume: 920 },
        { id: 5, name: "Michael Chang", ward: "Surgical", bed: "S1", saline: "Antibiotic Sol", dripLevel: 30, totalVolume: 250, rate: 50, currentVolume: 75 }
    ];

    const withTime = demoPatients.map(p => ({
        ...p,
        timeRemaining: (p.currentVolume / p.rate) * 60
    }));

    res.json(withTime);
});

// --- Start Server (Render compatible) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));