
const notSignedInURL = "/"

// Globally saved player detail. Contains cached (upon log in) database player information
let player = null;
let userUID = null;

function listHasAllElements(list, elements) {
    const checker = (arr, target) => target.every(v => arr.includes(v));
    return checker(list, elements);
}

function retrievePlayerFromStorage() {
    let playerStr = localStorage.getItem(localPlayerID);
    if (!playerStr) {
        return null;
    }
    let playerData = JSON.parse(playerStr);
    if (playerData) {
        if (listHasAllElements(Object.keys(playerData), validPlayerKeys)) {
            return playerData;
        }
    }
    return null;
}

function verifySignIn(onCompleted) {
    let playerData = retrievePlayerFromStorage();
    if (!playerData) {
        console.log("No LocalStorage for player found");
        onPlayerUpdated(player);
        if (onCompleted) onCompleted(player);
        return;
    }
    firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            // User is signed in
            player = playerData;
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

// Clear localStorage and then redirect back to index (main page for logging in)
function clearAndRedirectToIndex() {
    clear();
    signOut().then(() => {
        console.log('Signed Out');
    }, (error) => {
        console.error('Sign Out Error', error);
    }).finally(() => {
        // Redirect to index
        window.location.href = notSignedInURL;
    });
}

function clear() {
    player = null;
    sessionStorage.clear();
    localStorage.clear();
}

function verifySignInOrReturnToIndex(onSuccessCallback) {
    verifySignIn(() => {
        if (player) {
            if (onSuccessCallback) {
                onSuccessCallback(player);
            }
        }
        else {
            clearAndRedirectToIndex();
        }
    });
}
