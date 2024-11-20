// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quiz', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Question schema
const questionSchema = new mongoose.Schema({
    id: Number,
    question: String,
    options: [String],
    correctAnswerIndex: Number
});

const Question = mongoose.model('Question', questionSchema);

// Define Answer schema
const answerSchema = new mongoose.Schema({
    userAnswers: [
        {
            questionId: Number,
            selectedOptionIndex: Number,
            isCorrect: Boolean,
            correctAnswerIndex: Number,
        }
    ],
    score: Number,
    total: Number,
    createdAt: { type: Date, default: Date.now }
});

const Answer = mongoose.model('Answer', answerSchema);

// API Endpoint to get questions
app.get('/quiz', async (req, res) => {
    try {
        const questions = await Question.find().limit(5); // Limit to 5 questions
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching questions' });
    }
});

// API Endpoint to submit answers
app.post('/submit', async (req, res) => {
    const userAnswers = req.body.answers;
    let score = 0;
    let results = [];

    for (const answer of userAnswers) {
        const question = await Question.findOne({ id: answer.questionId });
        const isCorrect = question && question.correctAnswerIndex === answer.selectedOptionIndex;
        
        if (isCorrect) {
            score++;
        }

        results.push({
            questionId: question.id,
            selectedOptionIndex: answer.selectedOptionIndex,
            isCorrect: isCorrect,
            correctAnswerIndex: question ? question.correctAnswerIndex : null,
        });
    }

    // Save user answers in MongoDB
    const answerDocument = new Answer({ userAnswers: results, score, total: userAnswers.length });
    await answerDocument.save();

    // Save user answers in JSON file
    fs.writeFileSync(path.join(__dirname, 'user_answers.json'), JSON.stringify(answerDocument, null, 2));

    res.json({ score, total: userAnswers.length, results });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
