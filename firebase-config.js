// Same Firebase project as Chithi (reused gear, as decided).
const firebaseConfig = {
  apiKey: "AIzaSyA-0vMPlVK8Qrhhai93ZODqY7M_lpVh67Y",
  authDomain: "dakiya-app-570ad.firebaseapp.com",
  projectId: "dakiya-app-570ad",
  storageBucket: "dakiya-app-570ad.firebasestorage.app",
  messagingSenderId: "35477393410",
  appId: "1:35477393410:web:a1c5aba77a7507fbf8571b"
};

// Because this app shares a Firebase project with Chithi, every collection
// here is prefixed "sakshi_" so nothing collides with Chithi's data:
//   sakshi_disputes, sakshi_users
// Firebase Auth users ARE shared across both apps (same project = same
// user pool) — someone signed into Chithi will already have an account
// here. If you don't want that, this needs its own Firebase project instead.
