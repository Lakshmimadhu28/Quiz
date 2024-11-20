// script.js

const quizContainer = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');

let questions = [];

async function fetchQuiz() {
    const response = await fetch('/quiz');
    questions = await response.json();
    renderQuiz();
}

function renderQuiz() {
    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<h3>${question.question}</h3>`;
        
        question.options.forEach((option, index) => {
            questionDiv.innerHTML += `
                <label>
                    <input type="radio" name="question${question.id}" value="${index}">
                    ${option}
                </label><br>
            `;
        });
        
        quizContainer.appendChild(questionDiv);
    });
}

async function submitQuiz() {
    const answers = questions.map((question) => {
        const selectedOption = document.querySelector(`input[name="question${question.id}"]:checked`);
        return {
            questionId: question.id,
            selectedOptionIndex: selectedOption ? parseInt(selectedOption.value) : -1,
        };
    });

    const response = await fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
    });

    const result = await response.json();
    displayResult(result);
}

function displayResult(result) {
    resultDiv.innerHTML = `Your score: ${result.score}/${result.total}<br>`;
    result.results.forEach(res => {
        if (!res.correct) {
            const question = questions.find(q => q.id === res.id);
            resultDiv.innerHTML += `Question: ${question.question} - Correct Answer: ${question.options[question.correctAnswerIndex]}<br>`;
        }
    });
}

submitBtn.addEventListener('click', submitQuiz);
fetchQuiz();
