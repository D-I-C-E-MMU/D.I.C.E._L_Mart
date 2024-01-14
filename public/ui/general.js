
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
                window.location.reload();
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

// Compoenent Loading
async function injectComponentToNode(componentURL, node) {
    const response = await fetch(componentURL);
    const component = await response.text();
    node.innerHTML = component;
}

// Scripts cannot be appended throught innerHTML! Thus is function is required
async function injectScriptToNode(scriptURL, node) {
    const response = await fetch(scriptURL);
    const script = await response.text();
    let scriptNode = document.createElement("script");
    scriptNode.innerHTML = script;
    node.appendChild(scriptNode);
}
// Compoenent Loading

window.addEventListener('load', () => {
    initSignInButtons();
    initSignOutButtons();
});
