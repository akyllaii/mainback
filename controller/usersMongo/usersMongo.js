import UsersModel from '../../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import nodemailer from 'nodemailer'
//
//
// const transporter = nodemailer.createTestAccount({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: 'akylaiiomurbekova@gmail.com',
//         clientId: '921830323370-gv11c4dh34mguuj14t3uid7vkss2erek.apps.googleusercontent.com',
//         clientSecret: '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',
//         refreshToken: 'your-refresh-token',
//         accessToken: 'your-access-token',
//     }
// })
//
// const sendConfirmMessage =  (email,confirmCode) => {
//     const mailOptions = {
//         from: 'omurbekovaakylai@gmail.com',
//         to: email,
//         subject: 'подтверждени почты',
//         text: 'vlxvmxvlx56486' + confirmCode
//     }
//      transporter.sendMail(mailOptions,(error,info) => {
//         if (error) {
//             console.log(error)
//         } else {
//             console.log('email отправлен' + info.response)
//         }
//     })
// }


export const register = async (req,res) => {
    try{
        const {password,...other} = req.body

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)

        const doc = new UsersModel({
            ...other,
            passwordHash: hash
        })

        // sendConfirmMessage(req.body.email, '123456789')

        const user = await doc.save()

        const {passwordHash,...userData} = user._doc

        const token = jwt.sign({
            _id: user._id
        },'secret123',{expiresIn:'90d'})

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: 'не удалось зарегистрироваться'
        })
    }
}

export const login = async (req,res) => {
    try {
        const user = await UsersModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({
                message: 'такого аккаунта не существует'
            })
        }

        const invalidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!invalidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
            _id: user._id
        },'secret123',{expiresIn:'90d'})

        const {passwordHash,...userData} = user._doc
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: 'не удалось войти'
        })
    }
}

