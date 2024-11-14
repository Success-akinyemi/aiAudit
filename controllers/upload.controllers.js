import { storage, upload } from '../middleware/uploadConfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// UPLOAD FILES
export async function uploadFile(req, res) {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const file = req.file;
      const storageRef = ref(storage, `uploads/${file.originalname}`);
      
      await uploadBytes(storageRef, file.buffer);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('DOWNLOAD LINK',downloadURL )
      
      res.status(200).json({ success: true, data: 'File Uploaded SuccessFull' });
    } catch (error) {
      console.log('UNABLE TO UPLOAD FILE', error);
      res.status(500).json({ success: false, message: 'Unable to upload file.' });
    }
  });
}
