document.addEventListener('DOMContentLoaded', function() {
    // Funkcja potwierdzenia przed wylogowaniem
    function confirmLogout() {
        if (confirm('Czy na pewno chcesz się wylogować?')) {
            window.location.href = '/pages/index.html'; // Przekierowanie po potwierdzeniu
        }
    }

    // Pobranie aktualnej daty i godziny
    function getCurrentDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return now.toLocaleDateString('pl-PL', options);
    }

    // Aktualizacja wyświetlania daty i godziny co sekundę
    function updateDateTime() {
        const currentDateTimeElement = document.getElementById('current-date-time');
        if (currentDateTimeElement) {
            currentDateTimeElement.textContent = getCurrentDateTime();
        }
    }

    // Uruchomienie aktualizacji na starcie i co sekundę
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Pobranie informacji o zalogowanym użytkowniku
    async function fetchUserInfo() {
        try {
            const response = await fetch('/userinfo'); // Endpoint do pobrania informacji o użytkowniku
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const userData = await response.json();
            const userRoleElement = document.getElementById('position');
            const usernameElement = document.getElementById('username');
            if (userRoleElement && usernameElement) {
                userRoleElement.textContent = userData.position || 'Brak danych';
                usernameElement.textContent = userData.username || 'Brak danych';
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    // Wywołanie funkcji pobierającej informacje o użytkowniku
    fetchUserInfo();

    // Obsługa kliknięcia na kafelek "Wyloguj"
    const logoutTile = document.getElementById('logout');
    if (logoutTile) {
        logoutTile.addEventListener('click', confirmLogout);
    }
});
