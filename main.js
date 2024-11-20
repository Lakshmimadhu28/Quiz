const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/quiz', { useNewUrlParser: true, useUnifiedTopology: true });

const questionSchema = new mongoose.Schema({
  id: Number,
  question: String,
  options: [String],
  correctAnswerIndex: Number
});

const Question = mongoose.model('Question', questionSchema);

const sampleQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswerIndex: 2
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswerIndex: 1
  },
  {
    id: 3,
    question: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "J.K. Rowling"],
    correctAnswerIndex: 2
  },
  {
    id: 4,
    question: "Which is the largest ocean on Earth?",
    options: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Arctic Ocean"],
    correctAnswerIndex: 1
  },
  {
    id: 5,
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
    correctAnswerIndex: 2
  }
];

Question.insertMany(sampleQuestions)
  .then(() => {
    console.log('Sample questions inserted');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
