const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const { getAsync } = require('../redis')
// const redis = require('../redis')

let visits = 0
const TODO_COUNTER_KEY = 'added_todos'

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (_req, res) => {
  const todoCount = await getAsync(TODO_COUNTER_KEY);
  console.log('todo current', todoCount);
  res.send({
    'added_todos': todoCount ? parseInt(todoCount) : 0
  });
});

module.exports = router;
