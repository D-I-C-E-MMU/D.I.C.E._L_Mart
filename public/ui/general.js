
const homeURL = "/"
const signInURL = "/login";
const signedInURL = "/";
const signedOutURL = "/";

let onPlayerUpdatedCallbacks = [];
let onPlayerUpdatedCallbackEmitted = false;

function initSignInButtons() {
    // Add all login buttons to redirect to the login page
    const loginButtons = document.querySelectorAll(".sign-in-btn");
    loginButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = signInURL;
        })
    });
}

function initSignOutButtons() {
    // Set all logout buttons to logout through firebase
    const signOutBtns = document.querySelectorAll(".sign-out-btn");
    signOutBtns.forEach((button) => {
        button.addEventListener("click", () => {
            signOut().then(() => {
                // After firebase successfully logs out, clear local storage and redirect
                localStorage.clear();
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                window.location.href = signedOutURL;
            });
        });
    });
}

function onPlayerUpdated(player) {
    onPlayerUpdatedCallbackEmitted = true;
    onPlayerUpdatedCallbacks.forEach((callback) => {
        callback(player);
    });
}

function addOnPlayerUpdated(callback) {
    onPlayerUpdatedCallbacks.push(callback);
    if (onPlayerUpdatedCallbackEmitted) {
        callback(player);
    }
}

window.addEventListener('load', () => {
    initSignInButtons();
    initSignOutButtons();
});
