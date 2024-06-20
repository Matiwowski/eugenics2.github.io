const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Pobierz model użytkownika
const User = require('../models/User');

// Wyświetl stronę logowania
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'frontend/pages' });
});

// Zaloguj użytkownika
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Znajdź użytkownika po nazwie użytkownika
  const user = await User.findOne({ username });

  // Sprawdź, czy użytkownik istnieje
  if (!user) {
    return res.status(404).send('Użytkownik nie istnieje');
  }

  // Porównaj hasła
  const isMatch = await bcrypt.compare(password, user.password);

  // Sprawdź, czy hasła się zgadzają
  if (!isMatch) {
    return res.status(401).send('Nieprawidłowe hasło');
  }

  // Utwórz token JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Wyślij token JWT do klienta
  res.json({ token });
});

module.exports = router;
