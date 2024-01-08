
const firebaseUIConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        // Currently, only Google is supported. If more are required, uncomment the related lines and make sure Firebase is configured through their console.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        // firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
}

function showLoginUI() {
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', firebaseUIConfig);
}

initApp = function () {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            // User is signed in
            console.log("User is signed in");
            signIn(firebaseUser);
        }
        else {
            console.log("User is NOT signed in");
            showLoginUI();
        }
    }, (error) => {
        console.log("Error signing in");
        console.error(error);
    });
}

window.addEventListener('load', () => {
    initApp();
})
