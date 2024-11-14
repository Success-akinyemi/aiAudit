import jsonwebtoken from 'jsonwebtoken'
import UserModel from '../models/User.js';

//authorize user request
export const Protect = async (req, res, next) => {
    const token = req.cookies.aiauditsigned;
    //console.log('PROTECT TOKEN>>', token)
  
    if (!token) {
      return res.status(401).json({ success: false, data: 'Not Allowed Please Login' });
    }
  
    try {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
  
      req.user = user;
  
      const { id } = user;
      let isUser
      isUser = await UserModel.findById(id);
    

      if (!isUser) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }

      req.user = isUser
  
      //console.log('user', isUser)
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, data: 'Token expired, please login again' });
      } else {
        return res.status(403).json({ success: false, data: 'User Forbidden Please Login' });
      }
    }
  };

// Middleware to check and create a chatId
export const ChatId = async (req, res, next) => {
  const cookies = req.cookies || {}; 
  const token = cookies.edtechafric;
  const chatToken = cookies.edtechChatID;
  let isUser = null;
  console.log('object chates', chatToken);

  try {
    if (token) {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        });
      });

      req.user = user;
      const { id, userType } = user;

      if (userType === 'student') {
        isUser = await StudentModel.findById(id);
      } else if (userType === 'instructor') {
        isUser = await InstructorModel.findById(id);
      } else if (userType === 'organization') {
        isUser = await organizationModel.findById(id);
      }
    }

    if (isUser) {
      req.user = isUser;
      req.chatId = {
        user: true,
        name: isUser.name,
        role: isUser.userType,
        chatId: isUser._id,
        userId: isUser._id,
      };
    } else {
      req.chatId = { user: false, chatId: Date.now().toString() };
    }

    const chatTokenPayload = req.chatId;
    const signedChatToken = jsonwebtoken.sign(chatTokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    const expiryDate = new Date(Date.now() + 10 * 60 * 60 * 1000);

    // Check if `res.cookie` exists for HTTP requests
    if (res && res.cookie) {
      res.cookie('edtechChatID', signedChatToken, {
        httpOnly: true,
        expires: expiryDate,
        sameSite: 'None',
        secure: true,
      });
    } else if (req.socket) {
      // Emit the signed chat token to the client via Socket.IO
      req.socket.emit('setChatToken', { chatToken: signedChatToken, expires: expiryDate });
    }

    next();
  } catch (error) {
    console.log('UNABLE TO PASS AI CHAT TOKEN', error);

    if (res && res.status) {
      res.status(500).json({ success: false, data: `Unable to connect with ${process.env.AI_NAME}` });
    } else if (req.socket) {
      req.socket.emit('chatError', { success: false, message: `Unable to connect with ${process.env.AI_NAME}` });
    }
  }
};

