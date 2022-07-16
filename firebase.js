import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyCTc-NR7y_xrL9jxN9-TYsNZ5T-yI3ekRI',
  authDomain: 'chat-1-68e8f.firebaseapp.com',
  projectId: 'chat-1-68e8f',
  storageBucket: 'chat-1-68e8f.appspot.com',
  messagingSenderId: '137459054502',
  appId: '1:137459054502:web:d2444c7ff8357f04720167',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
