// src/firebase.ts
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken
} from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// Declare global variables provided by the Canvas environment
declare const __app_id: string | undefined
declare const __firebase_config: string | undefined
declare const __initial_auth_token: string | undefined

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey:
    (typeof __firebase_config !== 'undefined' &&
      JSON.parse(__firebase_config).apiKey) ||
    process.env.FIREBASE_API_KEY,
  authDomain:
    (typeof __firebase_config !== 'undefined' &&
      JSON.parse(__firebase_config).apiKey) ||
    process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL:
    (typeof __firebase_config !== 'undefined' &&
      JSON.parse(__firebase_config).apiKey) ||
    process.env.FIREBASE_DATABASE_URL,
  projectId:
    (typeof __firebase_config !== 'undefined' &&
      JSON.parse(__firebase_config).apiKey) ||
    process.env.FIREBASE_PROJECT_ID,
  storageBucket:
    (typeof __firebase_config !== 'undefined' &&
      JSON.parse(__firebase_config).apiKey) ||
    process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    (typeof __firebase_config !== 'undefined' &&
      JSON.parse(__firebase_config).apiKey) ||
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:
    (typeof __firebase_config !== 'undefined' &&
      JSON.parse(__firebase_config).apiKey) ||
    process.env.FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Get a reference to the database service
export const db = getDatabase(app)

// Get a reference to the Auth service
export const auth = getAuth(app)

// Export appId from the config
export const appId = firebaseConfig.appId

// Authenticate the user
// This ensures that Firebase operations can proceed once authentication is ready.
// It uses the __initial_auth_token from the Canvas environment if available,
// otherwise signs in anonymously.
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Check if __initial_auth_token is defined in the global scope
    const initialAuthToken =
      typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null
    try {
      if (initialAuthToken) {
        await signInWithCustomToken(auth, initialAuthToken)
        console.log('Signed in with custom token.')
      } else {
        await signInAnonymously(auth)
        console.log('Signed in anonymously.')
      }
    } catch (error) {
      console.error('Firebase authentication error:', error)
    }
  }
})
