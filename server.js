const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); // Dodajemy obsługę sesji

const app = express();

// Konfiguracja sesji
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // W produkcji zmień na true i użyj HTTPS
}));

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb+srv://matiwitkowski311:qkaXQmxTwfyc5ol0@cluster0.ter8xk2.mongodb.net/test', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('Połączono z MongoDB');
})
.catch(error => console.error('Błąd połączenia z MongoDB:', error));

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    position: String
});

// Model użytkownika na podstawie schematu
const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Middleware do logowania żądań
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
});

// Strona główna aplikacji
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'pages', 'index.html'));
});

// Endpoint do logowania użytkownika
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        console.error('Brak nazwy użytkownika lub hasła.');
        return res.status(400).json({ error: 'Brak nazwy użytkownika lub hasła.' });
    }

    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            console.error('Nieprawidłowa nazwa użytkownika:', username);
            return res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            console.error('Nieprawidłowe hasło dla użytkownika:', username);
            return res.status(401).json({ error: 'Nieprawidłowe hasło.' });
        }

        // Zapisanie nazwy użytkownika w sesji
        req.session.username = username;

        console.log('Logowanie udane dla użytkownika:', username);
        return res.status(200).json({ message: 'Logowanie udane' });
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        return res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
    }
});

// Endpoint do pobierania informacji o zalogowanym użytkowniku
app.get('/userinfo', async (req, res) => {
    // Pobranie nazwy użytkownika z sesji
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ error: 'User is not logged in.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Zwrócenie danych użytkownika
        return res.status(200).json({ position: user.position, username: user.username });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Nasłuch na porcie 3000
app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
