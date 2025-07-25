// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBCMkDB4Wblx5Lhqblv-zDcrwWz1kPfApg",
//     authDomain: "web-dev-course-42f1f.firebaseapp.com",
//     projectId: "web-dev-course-42f1f",
//     storageBucket: "web-dev-course-42f1f.firebasestorage.app",
//     messagingSenderId: "695312263707",
//     appId: "1:695312263707:web:055cdd95a818c37c0066be"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCMkDB4Wblx5Lhqblv-zDcrwWz1kPfApg",
    authDomain: "web-dev-course-42f1f.firebaseapp.com",
    projectId: "web-dev-course-42f1f",
    storageBucket: "web-dev-course-42f1f.firebasestorage.app",
    messagingSenderId: "695312263707",
    appId: "1:695312263707:web:055cdd95a818c37c0066be"
};

const app = firebase.initializeApp(firebaseConfig);

// Export Firebase services for use in app.js
const auth = firebase.auth();
const db = firebase.firestore(app);