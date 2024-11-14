import mongoose from 'mongoose'

const DocumentsSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    userId: {
        type: String
    },
    fileUrl: {
        type: String
    }
},
{ timestamps: true }
)

const DocumentModel = mongoose.model('document', DocumentsSchema)
export default DocumentModel