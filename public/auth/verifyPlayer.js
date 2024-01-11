
const notSignedInURL = "/"

// Globally saved player detail. Contains cached (upon log in) database player information
let player = null;
let userUID = null;

function retrievePlayerFromStorage() {
    let playerStr = localStorage.getItem(storagePlayerID);
    if (!playerStr) {
        return null;
    }
    let playerData = JSON.parse(playerStr);
    if (playerData) {
        if (listHasAllElements(Object.keys(playerData), validPlayerKeys)) {
            return playerData;
        }
        // Remove invalid data
        localStorage.removeItem(storagePlayerID);
    }
    return null;
}

function verifySignIn(onCompleted) {
    let playerData = retrievePlayerFromStorage();
    if (!playerData) {
        console.log("No LocalStorage for player found");
        clear();
        onPlayerUpdated(player);
        if (onCompleted) onCompleted(player);
        return;
    }
    
    // Update existing playerData to make UI more responsive
    player = playerData;
    onPlayerUpdated(player);

    firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            // User is signed in
            player = playerData;
            player.photoURL = firebaseUser.photoURL;
            userUID = firebaseUser.uid;
        }
        else {
            clear();
        }
        onPlayerUpdated(player);
        if (onCompleted) onCompleted(player);
    }, (error) => {
        console.error(error);
        clear();
        onPlayerUpdated(player);
        if (onCompleted) onCompleted(player);
    });
}

function clear() {
    player = null;
    sessionStorage.clear();
    localStorage.clear();
}
