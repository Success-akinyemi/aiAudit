import mongoose from "mongoose";
import crypto from 'crypto'
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { type } from "os";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [ true, 'Email Address is Required' ],
        unique: [ true, 'Email Address already exist' ]
    },
    password: {
        type: String,
        required: [ true, 'Password is Required' ]
    },
    verified: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
{timestamps: true}
)

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next();
    };
  
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.matchStudentPasswords = async function(password){
    return await bcryptjs.compare(password, this.password)
}

UserSchema.methods.getStudentSignedToken = function(){
    return jsonwebtoken.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.getStudentSignedPublicToken = function(){
    return jsonwebtoken.sign({ id: this.fullName, type: 'public' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.getStudentResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken
}


const UserModel =  mongoose.model('user', UserSchema);
export default UserModel