const express = require('express');
const router = express.Router();
const Question = require('../models/question.model');
const CATEGORIES = require('../models/categories');

router.get('/question', (req, res, next) => {
  const cat = req.query.cat;
  let filter = { approved: true };
  cat ? filter['category'] = cat : filter;
  Question.findRandom(filter, {}, {limit: 1})
    .then(question => res.status(200).json(question[0]))
    .catch(err => next(err));
});

router.get('/game-questions', (req, res, next) => {
  let promises = CATEGORIES.map(cat => {
    return Question.findRandom({ approved: true, category: cat }, {}, { limit: 1 });
  });
  Promise.all(promises)
    .then(q => {
      res.status(200).json( [].concat.apply([], q) );
    })
    .catch(err => next(err));
});

router.get('/questions', (req, res, next) => {
  let filter = {};
  req.query.approved ? filter['approved'] = req.query.approved : filter;
  req.query.cat ? filter['category'] = req.query.cat : filter;
  let options = { limit: 5 };
  req.query.items ? options['limit'] = parseInt(req.query.items) : options;
  req.query.skip ? options['skip'] = parseInt(req.query.skip) : options;
  Question.find(filter, {}, options)
    .then(questions => res.status(200).json(questions))
    .catch(e => res.status(500).json({error:e.message}));
});

// To sincronize random Objects in the document collection
router.get('/syncRandom', (req, res) => {
  Question.syncRandom(function (err, result) {
    console.log(result.updated);
  });
});


module.exports = router;
