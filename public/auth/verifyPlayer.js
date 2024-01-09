
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

function verifySignIn(onSuccessCallback, onFailureCallback) {
    let playerData = retrievePlayerFromStorage();
    if (!playerData) {
        console.log("No LocalStorage for player found");
        onFailureCallback();
    }
    firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            // User is signed in
            player = playerData;
            userUID = firebaseUser.uid;
            onSuccessCallback();
        }
        else {
            onFailureCallback();
        }
    }, (error) => {
        console.error(error);
        onFailureCallback();
    });
}

// Clear localStorage and then redirect back to index (main page for logging in)
function clearAndRedirectToIndex() {
    clearStorage();
    firebase.auth().signOut().then(() => {
        console.log('Signed Out');
    }, (error) => {
        console.error('Sign Out Error', error);
    }).finally(() => {
        // Redirect to index
        console.log("Redirecting to index...")
        window.location.href = "/";
    });
}

function clearStorage() {
    sessionStorage.clear();
    localStorage.clear();
}

function verifySignInOrReturnToIndex(onSuccessCallback) {
    verifySignIn(() => {
        if (onSuccessCallback) {
            onSuccessCallback(player);
        }
    }, () => {
        clearAndRedirectToIndex();
    });
}
