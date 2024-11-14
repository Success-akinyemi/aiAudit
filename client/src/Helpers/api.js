import axios from 'axios'
import toast from 'react-hot-toast'

//axios.defaults.baseURL = 'https://subssum-api-1bhd.onrender.com/api/web'
//axios.defaults.baseURL = 'http://localhost:9000/api/web'
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

// DELETE NOTIFICATION
export async function deleteNotification(formData){
    try {
        const res = await axios.post('/notification/deleteNotification', formData, {withCredentials: true})
        return res.data
    } catch (error) {
        const res = error.response || 'Unable to update site settings'
        return res.data
    }
}