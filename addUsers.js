const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb+srv://username:password@your-cluster.mongodb.net/your-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Połączono z MongoDB');
  createUsers(); // Wywołanie funkcji do dodawania użytkowników po poprawnym połączeniu
})
.catch(error => console.error('Błąd połączenia z MongoDB:', error));

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Tworzenie modelu użytkownika
const User = mongoose.model('User', userSchema);

// Funkcja do dodawania użytkowników
async function createUsers() {
  const users = [
    { username: 'allowedUser1', password: 'password1' },
    { username: 'allowedUser2', password: 'password2' }
    // Możesz dodać więcej użytkowników według potrzeb
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({ username: user.username, password: hashedPassword });
    await newUser.save();
    console.log(`Użytkownik ${user.username} został dodany do bazy danych.`);
  }

  console.log('Wszyscy użytkownicy zostali dodani.');
  mongoose.disconnect(); // Rozłączenie po zakończeniu dodawania użytkowników
}
