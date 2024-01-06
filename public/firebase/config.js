
// Firebase Initialization
const firebaseApp = firebase.app();

// Firebase's Firestore Database
const firestoreDB = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {

    const loadEl = document.querySelector('#load');

    try {
        let features = [
            'auth',
            'firestore',
        ].filter(feature => typeof firebaseApp[feature] === 'function');
        loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
    }
    catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    }
})