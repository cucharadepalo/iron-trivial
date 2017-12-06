const express = require('express');
const router = express.Router();

router.get('/question', (req, res) => {
  Question.random()
    .then(question => res.status(200).json(question))
    .catch(e => res.status(500).json({error:e.message}));
});
//router.get('/question?cat');

module.exports = router;
