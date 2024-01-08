
const playerDB = firestoreDB.collection("players")

// Sign in via Firebase. Executes only the first time the user is signed in.
// Does not run when the user is already signed in (with the existence of 'login' in localStorage)
function signIn(rawUser) {
    let user;
    rawUser.getIdToken().then((accessToken) => {
        user = {
            displayName: rawUser.displayName,
            email: rawUser.email,
            photoURL: rawUser.photoURL,
            uid: rawUser.uid,
            accessToken: accessToken,
            providerData: rawUser.providerData
        }
    }).then(() => {
        verifySignInThroughFirebase(user).then((playerData) => {
            if (playerData) {
                console.log("Gonna login with playerData")
            }
            else {
                console.log("no player data to login with");
                createNewPlayerThroughFirebase(user);
            }
        });
    });
}

function verifySignInThroughFirebase(user) {
    let uid = user.uid;
    console.log("Verifying uid: " + uid);
    return playerDB.doc(uid).get().then((playerDoc) => {
        if (playerDoc.exists) {
            console.log(`Player Doc ${uid} exists.`);
            console.log(playerDoc.data());
            return playerDoc.data();
        }
        console.log(`Player Doc ${uid} does not exist.`);
        return null;
    }).catch((error) => {
        console.log(`Player Doc ${uid} failed to retrieve.`);
        console.log(error);
        return null;
    });
}

function createNewPlayerThroughFirebase(user) {
    console.log(`Creating a new player: ${user.uid}, ${user.displayName}, ${user.email}`);
    playerDB.doc(user.uid).set({
        email: user.email,
        name: user.displayName,
        admin: true,
    }).then(() => {
        console.log("New player created");
    }).catch((error) => {
        console.log(error);
        console.log("Failed to create new player");
    })
}

function saveAndSignInToUser(user) {
    saveSignInToLocalStorage(user);
    window.location.replace("/player.html");
}

function saveSignInToLocalStorage(user) {
    // Do NOT save the uid or accessToken to localStorage
    localStorage.setItem("login", user)
}
