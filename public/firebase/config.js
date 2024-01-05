
const app = firebase.app();

document.addEventListener('DOMContentLoaded', () => {

    const loadEl = document.querySelector('#load');

    try {
        let features = [
            'auth',
            'firestore',
        ].filter(feature => typeof app[feature] === 'function');
        loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
    }
    catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    }
})