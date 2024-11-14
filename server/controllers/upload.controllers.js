import { storage, upload } from '../middleware/uploadConfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DocumentModel from '../models/Documents.js';

// UPLOAD FILES
export async function uploadFile(req, res) {
  upload.single('file')(req, res, async (err) => {
    const { _id, fullName } = req.user
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const file = req.file;
      const storageRef = ref(storage, `uploads/${file.originalname}`);
      
      await uploadBytes(storageRef, file.buffer);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('DOWNLOAD LINK',downloadURL )

      const newDocument = await DocumentModel.create({
        name: fullName,
        userId: _id,
        fileUrl: downloadURL
      })
      
      res.status(200).json({ success: true, data: 'File Uploaded SuccessFull' });
    } catch (error) {
      console.log('UNABLE TO UPLOAD FILE', error);
      res.status(500).json({ success: false, message: 'Unable to upload file.' });
    }
  });
}

//GET ALL DOCUMENT OF USER
export async function getAllDocuments(req, res) {
  const { _id } = req.user
  try {
    const allDocuments = await DocumentModel.find({ userId: _id })
  
    res.status(200).json({ success: true, data: allDocuments })
  } catch (error) {
    console.log('UNABLE TO GET ALL USER DOCUMENTS', error)
    res.status(500).json({ success: false, data: 'Unable to get all documents of user' })
  }
}

//GET ALL DOCUMENT OF USER
export async function getADocument(req, res) {
  const { _id } = req.user
  const { id } = req.params

  try {
    const allDocuments = await DocumentModel.find({ _id: id })
  
    if(allDocuments?.userId !== _id){
      return res.status(403).json({ success: false, data: 'You can only access documents you upload.' })
    }

    res.status(200).json({ success: true, data: allDocuments })
  } catch (error) {
    console.log('UNABLE TO GET ALL USER DOCUMENTS', error)
    res.status(500).json({ success: false, data: 'Unable to get all documents of user' })
  }
}