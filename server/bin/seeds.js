require('dotenv').config();
const User = require('../models/user.model');
const Question = require('../models/question.model');
const CATEGORIES = require('../models/categories');

const mongoose = require('mongoose');
const db_url = process.env.DB_URL;
mongoose.connect(db_url, {useMongoClient: true})
  .then(() => console.log('Conectado a la db'))
  .catch(err => console.error(err));

const admin = new User({
  username: 'admin',
  isAdmin: true,
});

const questions = [
  {
    creator: "abs",
    question: "What's the HTML tag for a portion of a document whose content is only indirectly related to the document's main content?",
    questionImg: null,
    questionIsImg: false,
    questionCode: null,
    questionIsCode: false,
    category: 'HTML',
    correctAnswer: "<aside>",
    fakeAnswers: ["<sidebar>","<nav>","<section>"],
    approved: true
  },
  {
    creator: "abs",
    question: "Choose the correct HTML element for the largest heading",
    questionImg: null,
    questionIsImg: false,
    questionCode: null,
    questionIsCode: false,
    category: 'HTML',
    correctAnswer: "<h1>",
    fakeAnswers: ["<heading>","<h6>","<head>"],
    approved: true
  },
  {
    creator: "abs",
    question: "Wich CSS properties better describe this picture?",
    questionImg: "https://i.imgur.com/f7ssWLc.png",
    questionIsImg: true,
    questionCode: null,
    questionIsCode: false,
    category: 'CSS',
    correctAnswer: "background: #DB007C; border-radius: 12px; text-transform: uppercase",
    fakeAnswers: ["color: #CCC; font-size: 6rem; font-weight: bold", "background-color: transparent; border: 2px solid #5555FF; text-align:right", "font-family: sans-serif; text-style: italic; padding: 20px;"],
    approved: true
  },
  {
    creator: "abs",
    question: "Wich CSS selector would you use to indicate a form element is in use?",
    questionImg: null,
    questionIsImg: false,
    questionCode: null,
    questionIsCode: false,
    category: 'CSS',
    correctAnswer: ":focus",
    fakeAnswers: [":active", "input[type:active]", ":hover"],
    approved: true
  },
  {
    creator: "abs",
    question: "What's the output of this code?",
    questionImg: null,
    questionIsImg: false,
    questionCode: "var str = \'hello world\';\r\nstr = str.split(\' \');\r\nconsole.log(str);",
    questionIsCode: true,
    category: 'Javascript',
    correctAnswer: "[ \'hello\', \'world\' ]",
    fakeAnswers: ["[ \'h\', \'e\', \'l\', \'l\', \'o\', \' \', \'w\', \'o\', \'r\', \'l\', \'d\' ]", "11", "'h e l l o   w o r l d'"],
    approved: true
  },
  {
    creator: "abs",
    question: "What's the value of arr?",
    questionImg: null,
    questionIsImg: false,
    questionCode: "console.log(arr.reduce((a,v) => {return a + v})) \/\/10",
    questionIsCode: true,
    category: 'Javascript',
    correctAnswer: "[1, -3, 5, 7]",
    fakeAnswers: ["[6, 3, 2, -2]", "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]", "[1, 2, 3, 4, 5, 6, 7, 8, 9]"],
    approved: true
  },
  {
    creator: "abs",
    question: "What's the most popular node package for many types of authentication purposes?",
    questionImg: null,
    questionIsImg: false,
    questionCode: null,
    questionIsCode: false,
    category: 'Back-end',
    correctAnswer: "passport",
    fakeAnswers: ["authenticate", "visa", "simple-oauth"],
    approved: true
  },
  {
    creator: "abs",
    question: "What does this icon represent?",
    questionImg: "https://i.imgur.com/xxTIGrs.png",
    questionIsImg: true,
    questionCode: null,
    questionIsCode: false,
    category: 'Back-end',
    correctAnswer: "a database",
    fakeAnswers: ["a server", "a cluster of servers", "a DNS server"],
    approved: true
  },
  {
    creator: "abs",
    question: "What's the HTTP status code for a No Content response?",
    questionImg: null,
    questionIsImg: false,
    questionCode: null,
    questionIsCode: false,
    category: 'Concepts',
    correctAnswer: "204",
    fakeAnswers: ["201", "301", "401"],
    approved: true
  },
  {
    creator: "abs",
    question: "What does HTTP stands for?",
    questionImg: null,
    questionIsImg: false,
    questionCode: null,
    questionIsCode: false,
    category: 'Concepts',
    correctAnswer: "Hypertext transfer protocol",
    fakeAnswers: ["High transfer type protocol", "Hi tom try pizza!", "Hyper tunnel transfer pipe"],
    approved: true
  },
  {
    creator: "abs",
    question: "When did facebook launch?",
    questionImg: null,
    questionIsImg: false,
    questionCode: null,
    questionIsCode: false,
    category: 'Social',
    correctAnswer: "February 2004",
    fakeAnswers: ["April 2006", "July 2005", "October 2003"],
    approved: true
  },
  {
    creator: "abs",
    question: "Which company founded the guy in the picture?",
    questionImg: "https://i.imgur.com/Zp6xLgT.jpg",
    questionIsImg: true,
    questionCode: null,
    questionIsCode: false,
    category: 'Social',
    correctAnswer: "Amazon",
    fakeAnswers: ["Dropbox", "Twitter", "Google"],
    approved: true
  }
];

User.create(admin)
  .then(() => {
    console.log('Created admin user');
    return Question.create(questions);
  })
  .then(() => {
    console.log(`Created ${questions.length} questions`);
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
