import express from 'express'
import {getAllUsers, getOneUser,createOneUser, updateOneUser} from "./controller/users/users.js";
import {createToDo} from "./validations/validations.js";
import {createTodos,getAllTodos,getOneTodo,updateOneTodo,deleteOneTodo} from "./controller/todolist/todolist.js";
import handleValidatorsErrors from "./validations/handleValidatorsErrors.js";
import mongoose from 'mongoose'
import {todosCreate,todosAll,todosOne,todoOneEdit,delOneTodo} from "./controller/todosMongoDb/todosMongo.js";
import {register,login} from "./controller/usersMongo/usersMongo.js";
import multer from 'multer'
import cloudinary from 'cloudinary'
import fs from 'node:fs'


const mongoDbPass = 'akylai123'
mongoose.connect(`mongodb+srv://omurbekovaakylai:${mongoDbPass}@itrun.jtifz9k.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('mongo успещно завпущен'))
    .catch((err) => console.log('error'))



const api = express()
api.use(express.json())
const PORT = 8080

api.get('/users',getAllUsers)
api.get('/users/:id',getOneUser)
api.post('/users',createOneUser)
api.patch('/users/:id',updateOneUser)
api.post('/todos',createToDo, handleValidatorsErrors,createTodos)
api.get('/todos',getAllTodos)
api.get('/todos/:id',getOneTodo)
api.patch('/todos/:id',updateOneTodo)
api.patch('/todos/:id',deleteOneTodo)


api.post('/todo', todosCreate)
api.get('/todo', todosAll)
api.get('/todo/:id', todosOne)
api.patch('/todo/:id', todoOneEdit)
api.delete('/todo/:id', delOneTodo)

api.post('/auth/register', register)
api.post('/auth/login', login)


const upload = multer({destination:'uploads/'})
cloudinary.config({
    cloud_name: 'ddnfkva1a',
    api_key: '319985535177413',
    api_secret: 'Y0DT64MYFs_DqGm9rmeRVDtU6w8'
});
api.post('/upload', upload.single('file'), (req,res) => {
    const file = req.file

    if (!file) {
        return res.status(400).send('файл не найден')
    }
    const fileName = `${Date.now()}_${file.originalname}`
    const tempFilePath = `uploads/${fileName}`
    fs.writeFileSync(tempFilePath,file.buffer)

    cloudinary.v2.uploader.upload(tempFilePath,(err,result) => {
        if (err) {
            console.error('ошибка загрузки файла:', err)
            return res.status(500).send('ошибка загрузки файла')
        }
        fs.unlinkSync(tempFilePath)

        const publicUrl = result.secure_url

        res.json({
            url: publicUrl
        })
    })

})

api.use('/uploads', express.static('uploads'))

api.listen(PORT, () => {
    console.log(`сервер запущен на порту http://localhost:${PORT}`)
})