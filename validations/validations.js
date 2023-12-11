import {body} from 'express-validator'

export const createToDo = [
    body('text', 'текст должен быть минимум три символа').isString().isLength({min:3, max: 30}),
    body('isImportant','важность задачи обязательно').isBoolean(),
    body('isDone','статус done задачи обязательно').isBoolean(),
    body('time','время создания задачи обязательно').isTime({format: 'MM/DD/YY'}),
]