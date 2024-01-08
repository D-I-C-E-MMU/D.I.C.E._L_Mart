
const validPlayerKeys = ["email", "name"]

// Globally saved player detail. Contains cached (upon log in) database player information
let player = null;
let userUID = null;

function listHasAllElements(list, elements) {
    const checker = (arr, target) => target.every(v => arr.includes(v));
    return checker(list, elements);
}

function retrieveUserFromLocalStorage() {
    let userStr = localStorage.getItem("user");
    if (!userStr) {
        return null;
    }
    let user = JSON.parse(userStr);
    if (user) {
        if (listHasAllElements(Object.keys(user), validPlayerKeys)) {
            return user;
        }
    }
    return null;
}

function verifySignIn(onSuccessCallback, onFailureCallback) {
    let user = retrieveUserFromLocalStorage();
    if (!user) {
        console.log("No LocalStorage for user found");
        onFailureCallback();
    }
    firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            // User is signed in
            player = user;
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
    clearLocalStorage();
    firebase.auth().signOut().then(() => {
        console.log('Signed Out');
    }, (error) => {
        console.error('Sign Out Error', error);
    }).finally(() => {
        // Redirect to index
        console.log("Redirecting to index...")
        window.location.href = "/index.html";
    });
}

function clearLocalStorage() {
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
