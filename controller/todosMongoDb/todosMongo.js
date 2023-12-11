import todosModel from '../../models/todos.js'


export const todosAll = async (req,res) => {
    try{
        const todos = await todosModel.find()
        res.json(todos)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const todosOne = async (req,res) => {
    try{
        const todoId = req.params.id
        const doc = await todosModel.findById({_id: todoId})
        res.json(doc)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const todoOneEdit = async (req,res) => {
    try{
        const todoId = req.params.id
        await todosModel.updateOne({
            _id: todoId,
        }, req.body,
        {
            returnDocument: 'after'
        })
        res.json({success: true})
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


export const todosCreate = async (req,res) => {
    try {
        const doc = new todosModel({
            text: req.body.text,
            age: req.body.age,
            isImportant: false,
            isDone: false,
        })

        const todos = await doc.save()
        res.json(todos)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const delOneTodo = async (req,res) => {
    try {
        const todoId = req.params.id
        await todosModel.deleteOne({
                _id: todoId,
            })
        res.json({success: true})
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}