import fs from 'node:fs'
import {v4 as uuidv4} from 'uuid'


export const createTodos = (req,res) => {
    try {
        fs.readFile('data/todo.json','utf8', (err,data) => {
            if (err) {
               throw new Error('ыне удалось прочитать файл')
            }
            let jsonData = JSON.parse(data)
            let newData = [...jsonData,{
                text: req.body.text,
                isImportant: false,
                isDone: false,
                id: uuidv4(),
                time: new Date()
            }]
            fs.writeFile('data/todo.json', JSON.stringify(newData), () => {
                res.json(newData)
            })

        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const getAllTodos = (req,res) => {
        try {
            fs.readFile('data/todo.json', 'utf8', (err,data) => {
                if (err) {
                    throw new Error('vdscd')
                }
                let jsonData = JSON.parse(data)
                res.json(jsonData )
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
}

export const getOneTodo = (req,res) => {
    try {
        fs.readFile('data/todo.json', 'utf8', (err,data) => {
            if (err) {
                throw new Error('user is undefined')
            }
            let jsonData = JSON.parse(data)
            let todo = jsonData.find(item => item.id == req.params.id)
            if (!todo) {
                throw new Error('task is undefined')
            }
            res.json(todo)
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const updateOneTodo = (req,res) => {
    try {
      fs.readFile('data/todo.json', 'utf8', (err,data) => {
          if (err) {
              return res.status(500).json({
                  message: err.message
              })
          }
          let jsonData = JSON.parse(data)
          let newData = jsonData.map((item)=> {
              if (item.id == req.params.id) {
                  return {...item, ...req.body}
              } else {
                  return item
              }
          })
          fs.writeFile('data/todo.json',JSON.stringify(newData), () => {
              res.json(newData)
          })
      })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const deleteOneTodo = (req,res) => {
    try {
        fs.readFile('data/todo.json', 'utf8', (err,data) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                })
            }
            let jsonData = JSON.parse(data)
            let newData = jsonData.filter((item)=> item.id !== req.params.id)
            fs.writeFile('data/todo.json',JSON.stringify(newData), () => {
                res.json(newData)
            })
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}