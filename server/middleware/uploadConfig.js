// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import multer from 'multer';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa-MVMmR0rt14TbVVogJhg_aFAkcIcJVE",
  authDomain: "success-clone.firebaseapp.com",
  databaseURL: "https://success-clone-default-rtdb.firebaseio.com",
  projectId: "success-clone",
  storageBucket: "success-clone.appspot.com",
  messagingSenderId: "189431815177",
  appId: "1:189431815177:web:b80c910a82ec2b26982cd8",
  measurementId: "G-TNDWQW5DD1"
};

// Initialize Firebase and Storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Configure multer for memory storage and PDF/Excel files
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Excel files are allowed'), false);
    }
  }
});

export { storage, upload };
