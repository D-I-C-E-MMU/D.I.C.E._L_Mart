
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

function signIn(user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var uid = user.uid;
    var phoneNumber = user.phoneNumber;
    var providerData = user.providerData;
    user.getIdToken().then(function (accessToken) {
        document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        document.getElementById('account-details').textContent = JSON.stringify({
            displayName: displayName,
            email: email,
            emailVerified: emailVerified,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            uid: uid,
            accessToken: accessToken,
            providerData: providerData
        }, null, '  ');
    });
}

function signOut() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');

        // User is signed out.
        document.getElementById('sign-in-status').textContent = 'Signed out';
        document.getElementById('sign-in').textContent = 'Sign in';
        document.getElementById('account-details').textContent = 'null';
    }, function (error) {
        console.error('Sign Out Error', error);
    });

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', firebaseUIConfig);
}


initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
            signIn(user);
        } else {
            signOut();
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
