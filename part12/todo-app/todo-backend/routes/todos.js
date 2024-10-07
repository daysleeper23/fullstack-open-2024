const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params

  try {
    req.todo = await Todo.findById(id)
    console.log('todo', req.todo)
    if (!req.todo)
      return res.sendStatus(404)
  } catch (error) {
    res.sendStatus(404)
  }

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  console.log('new:', req.body)
  try {
    await Todo.findOneAndUpdate(
      { _id: req.todo.id }, 
      req.body,
      { useFindAndModify: false }
    )
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
