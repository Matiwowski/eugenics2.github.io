// Pobierz element wyświetlający datę i godzinę
const dateTimeElement = document.querySelector(".date-time");

// Utwórz obiekt Date
const now = new Date();

// Sformatuj datę i godzinę
const formattedDateTime = now.toLocaleString();

// Wyświetl sformatowaną datę i godzinę
dateTimeElement.textContent = formattedDateTime;
