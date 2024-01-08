
// Firebase Initialization
const firebaseApp = firebase.app();

// Firebase's Firestore Database
const firestoreDB = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    try {
        let features = [
            'auth',
            'firestore',
        ].filter(feature => typeof firebaseApp[feature] === 'function');
        console.log(`Firebase SDK loaded with ${features.join(', ')}.`);
    }
    catch (e) {
        console.error('Error loading the Firebase SDK.');
        console.error(e);
    }
})