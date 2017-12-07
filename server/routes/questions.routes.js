const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');
const CATEGORIES = require('../models/categories');

router.get('/question', (req, res) => {
  const cat = req.query.cat;
  let filter = { approved: true };
  cat ? filter['category'] = cat : filter;
  Question.findRandom(filter, {}, {limit: 1})
    .then(question => res.status(200).json(question[0]))
    .catch(e => res.status(500).json({error:e.message}));
});

router.get('/game', (req, res) => {
  let promises = CATEGORIES.map(cat => {
    return Question.findRandom({ approved: true, category: cat }, {}, { limit: 1 });
  });
  Promise.all(promises)
    .then(q => {
      res.status(200).json( [].concat.apply([], q) );
    })
    .catch(e => res.status(500).json({error:e.message}));
});

// To sincronize random Objects in the document collection
router.get('/syncRandom', (req, res) => {
  Question.syncRandom(function (err, result) {
    console.log(result.updated);
  });
});


module.exports = router;
