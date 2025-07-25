// // DOM References
// const sections = {
//     login: document.getElementById('login-section'),
//     register: document.getElementById('register-section'),
//     dashboard: document.getElementById('dashboard-section'),
//     history: document.getElementById('history-section'),
// };

// const elements = {
//     loginEmail: document.getElementById('login-email'),
//     loginPassword: document.getElementById('login-password'),
//     loginBtn: document.getElementById('login-btn'),
//     loginError: document.getElementById('login-error'),

//     registerEmail: document.getElementById('register-email'),
//     registerPassword: document.getElementById('register-password'),
//     registerBtn: document.getElementById('register-btn'),
//     registerError: document.getElementById('register-error'),

//     dashboardDate: document.getElementById('dashboard-date'),
//     userEmailDisplay: document.getElementById('user-email-display'),
//     dashboardMessage: document.getElementById('dashboard-message'),
//     togglePrayerBtns: document.querySelectorAll('.toggle-prayer-btn'),

//     historyList: document.getElementById('history-list'),
//     historyMessage: document.getElementById('history-message'),
// };

// const nav = {
//     dashboard: document.getElementById('nav-dashboard'),
//     history: document.getElementById('nav-history'),
//     logout: document.getElementById('nav-logout'),
// };

// let currentUser = null;

// // Utility Functions
// const show = key => {
//     Object.values(sections).forEach(s => s.hidden = true);
//     sections[key].hidden = false;
// };

// const showMessage = (el, msg, type = 'info') => {
//     el.textContent = msg;
//     el.className = `info-message ${type}`;
//     el.style.display = 'block';
//     setTimeout(() => el.style.display = 'none', 4000);
// };

// const formatDate = d => d.toLocaleDateString('en-US', {
//     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
// });
// const dateId = d => d.toISOString().split('T')[0];

// // Auth State Listener
// auth.onAuthStateChanged(user => {
//     currentUser = user;
//     if (user) {
//         nav.dashboard.hidden = false;
//         nav.history.hidden = false;
//         nav.logout.hidden = false;
//         show('dashboard');
//         loadDashboard();
//     } else {
//         nav.dashboard.hidden = true;
//         nav.history.hidden = true;
//         nav.logout.hidden = true;
//         show('login');
//     }
// });

// // Login
// elements.loginBtn.onclick = async () => {
//     const email = elements.loginEmail.value;
//     const password = elements.loginPassword.value;
//     if (!email || !password) return showMessage(elements.loginError, 'Enter email and password', 'error');

//     try {
//         await auth.signInWithEmailAndPassword(email, password);
//         showMessage(elements.loginError, 'Logged in!', 'success');
//         elements.loginEmail.value = elements.loginPassword.value = '';
//     } catch (err) {
//         showMessage(elements.loginError, err.message, 'error');
//     }
// };

// // Register
// elements.registerBtn.onclick = async () => {
//     const email = elements.registerEmail.value;
//     const password = elements.registerPassword.value;
//     if (!email || !password) return showMessage(elements.registerError, 'Fill all fields', 'error');
//     if (password.length < 6) return showMessage(elements.registerError, 'Password too short', 'error');

//     try {
//         await auth.createUserWithEmailAndPassword(email, password);
//         showMessage(elements.registerError, 'Registered & logged in', 'success');
//         elements.registerEmail.value = elements.registerPassword.value = '';
//     } catch (err) {
//         showMessage(elements.registerError, err.message, 'error');
//     }
// };

// // Logout
// nav.logout.onclick = async () => {
//     try {
//         await auth.signOut();
//         showMessage(elements.dashboardMessage, 'Logged out', 'info');
//     } catch (err) {
//         showMessage(elements.dashboardMessage, err.message, 'error');
//     }
// };

// // Navigation
// document.getElementById('show-register').onclick = e => {
//     e.preventDefault(); show('register');
//     elements.loginError.textContent = '';
// };

// document.getElementById('show-login').onclick = e => {
//     e.preventDefault(); show('login');
//     elements.registerError.textContent = '';
// };

// nav.dashboard.onclick = () => {
//     show('dashboard');
//     loadDashboard();
// };

// nav.history.onclick = () => {
//     show('history');
//     loadHistory(7);
// };

// // Dashboard Logic
// async function loadDashboard() {
//     if (!currentUser) return;

//     const today = new Date();
//     elements.dashboardDate.textContent = formatDate(today);
//     const uid = currentUser.uid;
//     const docRef = db.collection('users').doc(uid).collection('namazRecords').doc(dateId(today));

//     try {
//         const snap = await docRef.get();
//         const data = snap.exists ? snap.data() : {};

//         elements.togglePrayerBtns.forEach(btn => {
//             const p = btn.dataset.prayer;
//             const status = data[p];
//             btn.textContent = status ? '✅' : '❌';
//             btn.className = `toggle-prayer-btn ${status ? 'done' : 'missed'}`;
//         });

//     } catch (err) {
//         showMessage(elements.dashboardMessage, err.message, 'error');
//     }
// }

// // Toggle Daily Prayer
// elements.togglePrayerBtns.forEach(btn => {
//     btn.onclick = async () => {
//         if (!currentUser) return showMessage(elements.dashboardMessage, 'Login required', 'error');

//         const prayer = btn.dataset.prayer;
//         const today = new Date();
//         const uid = currentUser.uid;
//         const docRef = db.collection('users').doc(uid).collection('namazRecords').doc(dateId(today));

//         const snap = await docRef.get();
//         const data = snap.exists ? snap.data() : {};
//         const newStatus = !data[prayer];

//         btn.textContent = newStatus ? '✅' : '❌';
//         btn.className = `toggle-prayer-btn ${newStatus ? 'done' : 'missed'}`;

//         await docRef.set({ [prayer]: newStatus, timestamp: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
//     };
// });

// // Load History Buttons
// document.querySelectorAll('.history-days-btn').forEach(button => {
//     button.addEventListener('click', () => {
//         const days = button.dataset.days;
//         loadHistory(days);
//     });
// });

// // Load History
// async function loadHistory(days) {
//     if (!currentUser) return showMessage(elements.historyMessage, 'Login required', 'error');

//     const uid = currentUser.uid;
//     const now = new Date();
//     const ref = db.collection('users').doc(uid).collection('namazRecords');
//     const snaps = await ref.orderBy('timestamp', 'desc').limit(days * 2).get();

//     const records = {};
//     snaps.forEach(doc => records[doc.id] = doc.data());

//     elements.historyList.innerHTML = '';
//     const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

//     for (let i = 0; i < days; i++) {
//         const d = new Date(now); d.setDate(d.getDate() - i);
//         const id = dateId(d);
//         const data = records[id] || {};
//         const card = document.createElement('div');
//         card.className = 'history-day-card';
//         card.innerHTML = `<h3>${formatDate(d)}</h3><div class="prayer-list"></div>`;

//         prayerNames.forEach(p => {
//             const status = data[p];
//             card.querySelector('.prayer-list').innerHTML += `
//         <div class="prayer-item">
//           <span>${p.charAt(0).toUpperCase() + p.slice(1)}</span>
//           <button class="toggle-history-prayer-btn ${status ? 'done' : 'missed'}" data-date="${id}" data-prayer="${p}">
//             ${status ? '✅' : '❌'}
//           </button>
//         </div>`;
//         });

//         elements.historyList.appendChild(card);
//     }

//     document.querySelectorAll('.toggle-history-prayer-btn').forEach(btn => {
//         btn.onclick = () => updateHistoryPrayer(btn);
//     });
// }

// // Toggle History Prayer
// async function updateHistoryPrayer(btn) {
//     if (!currentUser) return;
//     const id = btn.dataset.date;
//     const prayer = btn.dataset.prayer;
//     const ref = db.collection('users').doc(currentUser.uid).collection('namazRecords').doc(id);

//     const snap = await ref.get();
//     const data = snap.exists ? snap.data() : {};
//     const newStatus = !data[prayer];

//     btn.textContent = newStatus ? '✅' : '❌';
//     btn.className = `toggle-history-prayer-btn ${newStatus ? 'done' : 'missed'}`;

//     await ref.set({ [prayer]: newStatus, timestamp: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
//     showMessage(elements.historyMessage, `${prayer} on ${id} updated`, 'success');
// }


















// DOM References
const sections = {
    login: document.getElementById('login-section'),
    register: document.getElementById('register-section'),
    dashboard: document.getElementById('dashboard-section'),
    history: document.getElementById('history-section'),
};

const elements = {
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    loginError: document.getElementById('login-error'),

    registerEmail: document.getElementById('register-email'),
    registerPassword: document.getElementById('register-password'),
    registerFirstname: document.getElementById('register-firstname'),
    registerLastname: document.getElementById('register-lastname'),
    registerAge: document.getElementById('register-age'),
    registerGender: document.getElementById('register-gender'),
    registerBtn: document.getElementById('register-btn'),
    registerError: document.getElementById('register-error'),

    dashboardDate: document.getElementById('dashboard-date'),
    userEmailDisplay: document.getElementById('user-email-display'),
    dashboardMessage: document.getElementById('dashboard-message'),
    togglePrayerBtns: document.querySelectorAll('.toggle-prayer-btn'),

    historyList: document.getElementById('history-list'),
    historyMessage: document.getElementById('history-message'),
};

const nav = {
    dashboard: document.getElementById('nav-dashboard'),
    history: document.getElementById('nav-history'),
    logout: document.getElementById('nav-logout'),
};

let currentUser = null;

// Utility Functions
const show = key => {
    Object.values(sections).forEach(s => s.hidden = true);
    sections[key].hidden = false;
};

const showMessage = (el, msg, type = 'info') => {
    el.textContent = msg;
    el.className = `info-message ${type}`;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 4000);
};

const formatDate = d => d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});
const dateId = d => d.toISOString().split('T')[0];

// Auth State Listener
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        nav.dashboard.hidden = false;
        nav.history.hidden = false;
        nav.logout.hidden = false;
        show('dashboard');
        loadDashboard();
    } else {
        nav.dashboard.hidden = true;
        nav.history.hidden = true;
        nav.logout.hidden = true;
        show('login');
    }
});

// Login
elements.loginBtn.onclick = async () => {
    const email = elements.loginEmail.value;
    const password = elements.loginPassword.value;
    if (!email || !password)
        return showMessage(elements.loginError, 'Enter email and password', 'error');

    try {
        await auth.signInWithEmailAndPassword(email, password);
        showMessage(elements.loginError, 'Logged in!', 'success');
        elements.loginEmail.value = elements.loginPassword.value = '';
    } catch (err) {
        showMessage(elements.loginError, err.message, 'error');
    }
};

// Register
elements.registerBtn.onclick = async () => {
    const email = elements.registerEmail.value;
    const password = elements.registerPassword.value;
    const firstName = elements.registerFirstname.value;
    const lastName = elements.registerLastname.value;
    const age = elements.registerAge.value;
    const gender = elements.registerGender.value;

    if (!email || !password || !firstName || !lastName || !age || !gender)
        return showMessage(elements.registerError, 'Please fill all fields', 'error');

    if (password.length < 6)
        return showMessage(elements.registerError, 'Password too short (min 6 characters)', 'error');

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save user info to Firestore
        await db.collection('users').doc(user.uid).collection('userData').doc('profile').set({
            email,
            uid: user.uid,
            firstName,
            lastName,
            age,
            gender,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showMessage(elements.registerError, 'Registered & logged in', 'success');
        elements.registerEmail.value = elements.registerPassword.value = '';
        elements.registerFirstname.value = elements.registerLastname.value = '';
        elements.registerAge.value = elements.registerGender.value = '';
    } catch (err) {
        showMessage(elements.registerError, err.message, 'error');
    }
};

// Logout
nav.logout.onclick = async () => {
    try {
        await auth.signOut();
        showMessage(elements.dashboardMessage, 'Logged out', 'info');
    } catch (err) {
        showMessage(elements.dashboardMessage, err.message, 'error');
    }
};

// Navigation
document.getElementById('show-register').onclick = e => {
    e.preventDefault();
    show('register');
    elements.loginError.textContent = '';
};

document.getElementById('show-login').onclick = e => {
    e.preventDefault();
    show('login');
    elements.registerError.textContent = '';
};

nav.dashboard.onclick = () => {
    show('dashboard');
    loadDashboard();
};

nav.history.onclick = () => {
    show('history');
    loadHistory(7);
};

// Dashboard Logic
async function loadDashboard() {
    if (!currentUser) return;

    const today = new Date();
    elements.dashboardDate.textContent = formatDate(today);
    const uid = currentUser.uid;
    const docRef = db.collection('users').doc(uid).collection('namazRecords').doc(dateId(today));

    try {
        const snap = await docRef.get();
        const data = snap.exists ? snap.data() : {};

        elements.togglePrayerBtns.forEach(btn => {
            const p = btn.dataset.prayer;
            const status = data[p];
            btn.textContent = status ? '✅' : '❌';
            btn.className = `toggle-prayer-btn ${status ? 'done' : 'missed'}`;
        });

    } catch (err) {
        showMessage(elements.dashboardMessage, err.message, 'error');
    }
}

// Toggle Daily Prayer
elements.togglePrayerBtns.forEach(btn => {
    btn.onclick = async () => {
        if (!currentUser)
            return showMessage(elements.dashboardMessage, 'Login required', 'error');

        const prayer = btn.dataset.prayer;
        const today = new Date();
        const uid = currentUser.uid;
        const docRef = db.collection('users').doc(uid).collection('namazRecords').doc(dateId(today));

        const snap = await docRef.get();
        const data = snap.exists ? snap.data() : {};
        const newStatus = !data[prayer];

        btn.textContent = newStatus ? '✅' : '❌';
        btn.className = `toggle-prayer-btn ${newStatus ? 'done' : 'missed'}`;

        await docRef.set({
            [prayer]: newStatus,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    };
});

// Load History Buttons
document.querySelectorAll('.history-days-btn').forEach(button => {
    button.addEventListener('click', () => {
        const days = button.dataset.days;
        loadHistory(days);
    });
});

// Load History
async function loadHistory(days) {
    if (!currentUser)
        return showMessage(elements.historyMessage, 'Login required', 'error');

    const uid = currentUser.uid;
    const now = new Date();
    const ref = db.collection('users').doc(uid).collection('namazRecords');
    const snaps = await ref.orderBy('timestamp', 'desc').limit(days * 2).get();

    const records = {};
    snaps.forEach(doc => records[doc.id] = doc.data());

    elements.historyList.innerHTML = '';
    const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    for (let i = 0; i < days; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const id = dateId(d);
        const data = records[id] || {};
        const card = document.createElement('div');
        card.className = 'history-day-card';
        card.innerHTML = `<h3>${formatDate(d)}</h3><div class="prayer-list"></div>`;

        prayerNames.forEach(p => {
            const status = data[p];
            card.querySelector('.prayer-list').innerHTML += `
                <div class="prayer-item">
                    <span>${p.charAt(0).toUpperCase() + p.slice(1)}</span>
                    <button class="toggle-history-prayer-btn ${status ? 'done' : 'missed'}" data-date="${id}" data-prayer="${p}">
                        ${status ? '✅' : '❌'}
                    </button>
                </div>`;
        });

        elements.historyList.appendChild(card);
    }

    document.querySelectorAll('.toggle-history-prayer-btn').forEach(btn => {
        btn.onclick = () => updateHistoryPrayer(btn);
    });
}

// Toggle History Prayer
async function updateHistoryPrayer(btn) {
    if (!currentUser) return;
    const id = btn.dataset.date;
    const prayer = btn.dataset.prayer;
    const ref = db.collection('users').doc(currentUser.uid).collection('namazRecords').doc(id);

    const snap = await ref.get();
    const data = snap.exists ? snap.data() : {};
    const newStatus = !data[prayer];

    btn.textContent = newStatus ? '✅' : '❌';
    btn.className = `toggle-history-prayer-btn ${newStatus ? 'done' : 'missed'}`;

    await ref.set({
        [prayer]: newStatus,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    showMessage(elements.historyMessage, `${prayer} on ${id} updated`, 'success');
}
