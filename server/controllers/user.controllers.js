import UserModel from "../models/User.js";
import sendEmail from "../middleware/mailer.js";
import Mailgen from "mailgen";
import crypto from 'crypto'
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'AI Audit',
        link: `${process.env.CLIENT_URL}`
    }
})

//REGISTER USER
export async function registerUser(req, res) {
    const { fullName, password, confirmPassword, email } = req.body
    if (!email) {
        return res.status(400).json({ success: false, data: 'Please your email address' });
    }
    if (!fullName) {
        return res.status(400).json({ success: false, data: 'Please your full name' });
    }
    if (!password) {
        return res.status(400).json({ success: false, data: 'Please provide a password' });
    }
    if (!confirmPassword) {
        return res.status(400).json({ success: false, data: 'Confirm Password is required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, data: 'Passwords must be at least 6 characters long' });
    }

    const specialChars = /[!@#$%^&*()_+{}[\]\\|;:'",.<>?]/;
    if (!specialChars.test(password)) {
        return res.status(400).json({ success: false, data: 'Passwords must contain at least one special character' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, data: 'Passwords do not match' });
    }
    try {
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, data: 'Email already exists. Please use another email' });
        }

        const user = await UserModel.create({ password, email, fullName, });
        console.log('USER CREATED');

        res.status(201).json({ success: true, data: 'Account created' })
        
    } catch (error) {
        console.log('UNABLE TO REGISTER USER', error)
        res.status(500).json({ success: false, data: 'Failed to create account' })
    }
}

//LOGIN STUDENT
export async function login(req, res) {
    const { email, password } = req.body 
    if(!email || !password){
        return res.status(401).json({ success: false, data: 'Please provide an email and password'})
    }

    try {
        const user = await UserModel.findOne({ email: email }).select('+password')
    
        if(!user){
            return res.status(401).json({ success: false, data: 'Invalid User'})
        }

        const isMatch = await user.matchStudentPasswords(password);

        if(!isMatch){
            return res.status(401).json({ success: false, data: 'Invalid credentials'})
        }

        //SEND TOKEN
        const token = user.getStudentSignedToken();
        const publicToken = user.getStudentSignedPublicToken();

        const expiryDate = new Date(Date.now() + 10 * 60 * 60 * 1000)
        const { resetPasswordToken, resetPasswordExpire, password: hashedPassword, _id, ...userData } = user._doc
        res.cookie('aiauditsigned', publicToken, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true } ).status(201).json({ success: true, token: token, data: {success: true, data: userData }})
        
    } catch (error) {
        console.log(`UNABLE TO LOGIN USER WITH EMAIL: (${email})`, error)
        res.status(500).json({ success: false, data: 'Failed to login user' })
    }
}

//FORGOT PASSWORD
export async function forgotPassword(req, res) {
    const { email } = req.body
    if(!email){
        return res.status(404).json({ success: false, data: 'Provide your registered email address'})
    }
    try {
        const user = await UserModel.findOne({ email });

        if(!user){
            return res.status(404).json({ success: false, data: 'Email Does Not Exist'})
        }

        const resetToken = user.getStudentResetPasswordToken()

        await user.save()
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        //const resetUrl = `<a href=“eduafrica-mobile://reset-password/${resetToken}”></a>`
        console.log('RESET TOKEN', resetToken)
        try {
            // send mail
            const emailContent = {
                body: {
                    intro: 'You have Requested a password reset.',
                    action: {
                        instructions: 'Please click the following button to reset your password. Link Expires in 10 mintues',
                        button: {
                            color: '#00BF63',
                            text: 'Reset Your Password',
                            link: resetUrl
                        },
                    },
                    outro: `
                        Reset link: ${resetUrl}

                        If you did not request a password reset, please ignore this email.
                    `
                },
            };

            const emailTemplate = mailGenerator.generate(emailContent)
            const emailText = mailGenerator.generatePlaintext(emailContent)

            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Password Reset Request',
                    text: emailTemplate
                })
                res.status(200).json({success: true, msg: 'Email sent', data: email })
                
            } catch (error) {
                console.log('FORGOT PASSWORD EMAIL ERROR?>', error)
            }
            
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()
            console.log('Email could not be sent >>',error)
            return res.status(500).json({ success: false, data: 'Email could not be sent' })
        }
    } catch (error) {
        console.log('ERROR GENERATING USER PASSWORD RESET LINK', error)
        res.status(500).json({ success: false, data: 'Something went wrong' })
    }
}

//USER RESET PASSWORD
export async function resetPassword (req, res){
    const { password, confirmPassword } = req.body
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

    try {
        if (!password || !confirmPassword) {
            return res.status(400).json({ success: false, data: 'Password and confirm password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, data: 'Passwords must be at least 6 characters long' });
        }

        const specialChars = /[!@#$%^&*()_+{}[\]\\|;:'",.<>?]/;
        if (!specialChars.test(password)) {
            return res.status(400).json({ success: false, data: 'Passwords must contain at least one special character' });
        }
    
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, data: 'Passwords do not match' });
        }
    

        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user){
            return  res.status(400).json({ success: false, data: 'Invalid Reset Token'})
        }

        const isMatch = await user.matchStudentPasswords(password);
        if(isMatch){
            return res.status(401).json({ success: false, data: 'Old Password must not match new password' })
        }

        user.password = password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined

        await user.save();

        res.status(201).json({
            success: true,
            data: 'Password Reset successful'
        })
    } catch (error) {
        console.log('ERROR RESETING USER PASSWORD', error)
        res.status(500).json({ success: false, data: 'Something went wrong. Unable to process reset password request' })
    }
}

//USER UPDATE PROFILE
export async function updateProfile(req, res){
    const { fullName, password } = req.body
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName,
                    password,
                }
            },
            { new: true }
        )

        res.status(200).json({ success: true, data: 'Profile Updated Successful' })
    } catch (error) {
        console.log('UNABLE TO UPDATE STUDENT PROFILE', error)
        res.status(500).json({ success: false, data: 'Unable to update student profile' })
    }
}

