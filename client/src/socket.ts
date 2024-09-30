import { io, Socket } from "socket.io-client";

const URL = 'http://localhost:4242';

const socket: Socket = io(URL, {
    autoConnect: false, // Ne pas auto-connecter par défaut
});

// Fonction pour obtenir l'accessToken depuis les cookies
function getAccessTokenFromCookies(): string | null {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='));

    return cookieValue ? cookieValue.split('=')[1] : null;
}

// Fonction pour connecter le socket si l'accessToken est disponible
function connectSocketIfAuthenticated() {
    const accessToken = getAccessTokenFromCookies();

    if (accessToken) {
        // Se connecter uniquement si l'accessToken est présent
        socket.connect();
        // Émettre l'événement d'authentification
        socket.emit('auth', accessToken);
    } else {
        console.warn('Access token not found in cookies. Socket will not connect.');
    }
}

// Appeler la fonction de connexion conditionnelle
connectSocketIfAuthenticated();

export { socket };

// Fonction pour gérer la déconnexion avec envoi d'une donnée
export function handleDisconnectWithData() {
    const accessToken = getAccessTokenFromCookies();
    if (accessToken) {
        // Émettre un événement personnalisé avant de se déconnecter
        socket.emit('manualDisconnect', accessToken);
    }
    // Ensuite, déconnecter le socket proprement
    socket.disconnect();
}
