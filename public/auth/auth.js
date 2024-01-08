
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

function redirectToLogin() {
    window.location.replace("");
}

function signOut() {
    firebase.auth().signOut().then(() => {
        console.log('Signed Out');

        // User is signed out.
        document.getElementById('account-details').textContent = 'null';
    }, (error) => {
        console.error('Sign Out Error', error);
    }).finally(() => {
        redirectToLogin();
    });
}


initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            signIn(user);
        } else {
            //signOut();
            showLoginUI();
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', () => {
    initApp()

    document.querySelector("#sign-out").addEventListener("click", () => {
        signOut();
    });
});
