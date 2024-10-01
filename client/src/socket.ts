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

// Variable pour éviter les reconnections multiples
let isConnected = false;

// Fonction pour connecter le socket si l'accessToken est disponible
function connectSocketIfAuthenticated() {
    const accessToken = getAccessTokenFromCookies();

    if (accessToken && !isConnected) {
        // Se connecter uniquement si l'accessToken est présent et qu'on n'est pas déjà connecté
        socket.connect();
        // Émettre l'événement d'authentification
        socket.emit('auth', accessToken);
        isConnected = true; // Marquer comme connecté
        console.log('Socket connected with access token.');
    }
}

// Watcher pour surveiller l'apparition du cookie `accessToken`
function startCookieWatcher() {
    const checkInterval = 1000; // Vérifier toutes les secondes
    const intervalId = setInterval(() => {
        const accessToken = getAccessTokenFromCookies();
        if (accessToken) {
            connectSocketIfAuthenticated();
            clearInterval(intervalId); // Arrêter le watcher une fois le cookie trouvé et socket connecté
        }
    }, checkInterval);
}

// Appeler la fonction de surveillance des cookies
startCookieWatcher();

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
    isConnected = false; // Marquer comme déconnecté
}
