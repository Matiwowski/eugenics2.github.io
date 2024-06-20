document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const successMessage = document.getElementById('login-success-message');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Zapobiegamy domyślnemu działaniu formularza

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Proszę uzupełnić nazwę użytkownika i hasło.');
            return;
        }

        try {
            console.log('Wysyłam dane logowania:', { username, password });

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Otrzymano odpowiedź z serwera, status:', response.status);

            if (response.ok) {
                const responseData = await response.json();
                console.log('Odpowiedź z serwera:', responseData);
                successMessage.style.display = 'block';
                setTimeout(() => {
                    window.location.href = '../pages/strona-glowna.html';
                }, 2000);
            } else {
                const errorData = await response.json().catch(() => {
                    console.error('Odpowiedź nie jest poprawnym JSON-em');
                    return { error: 'Nieprawidłowa odpowiedź z serwera' };
                });
                console.error('Błąd logowania:', errorData);
                alert('Logowanie nieudane: ' + errorData.error);
            }
        } catch (error) {
            console.error('Błąd podczas logowania:', error);
        }
    });
});
