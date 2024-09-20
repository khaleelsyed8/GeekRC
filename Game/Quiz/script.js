let questions = [];
let currentQuestionIndex = 0;
let selectedDifficulty = '';

document.addEventListener('DOMContentLoaded', () => {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            startQuiz(button.dataset.difficulty);
        });
    });

    //document.getElementById('next-btn').addEventListener('click', nextQuestion);
});

function startQuiz(difficulty) {
    selectedDifficulty = difficulty;
    loadQuestions(difficulty);
}

function loadQuestions(difficulty) {
    fetch('questions.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            // Check if the difficulty level exists in the data
            if (data[difficulty] && data[difficulty].length > 0) {
                questions = data[difficulty];
                questions = questions.sort(() => Math.random() - 0.5);
                currentQuestionIndex = 0;
                document.getElementById('difficulty-selection').classList.add('hidden');
                document.getElementById('quiz-content').classList.remove('hidden');
                showQuestion();
            }
        })
}


function showQuestion() {
    console.log("Showing question index:", currentQuestionIndex); // Debugging statement
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const resultMessage = document.getElementById('result-message');
    const explanationBox = document.getElementById('explanation-box');

    resultMessage.classList.add('hidden');
    explanationBox.classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    answerButtonsElement.innerHTML = '';

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('answer-btn');
        button.onclick = () => selectAnswer(answer.correct, currentQuestion.explanation, button);
        answerButtonsElement.appendChild(button);
    });

    updateProgress();
}

function selectAnswer(isCorrect, explanation, button) {
    const resultText = document.getElementById('result-text');
    const resultMessage = document.getElementById('result-message');
    const explanationText = document.getElementById('explanation-text');
    const explanationBox = document.getElementById('explanation-box');

    if (isCorrect) {
        button.classList.add('correct');
        resultText.textContent = 'Woohoo, Hacker can\'t hack you!';
    } else {
        button.classList.add('incorrect');
        resultText.textContent = 'Oh no, you\'re hacked!';
    }

    resultMessage.classList.remove('hidden');
    explanationText.textContent = explanation;
    explanationBox.classList.remove('hidden');
    document.getElementById('next-btn').classList.remove('hidden');

    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
    });
}

function nextQuestion() {
    // Safeguard against running past the end of the questions array
    if (currentQuestionIndex + 1 < questions.length) {
        currentQuestionIndex++;
        showQuestion();
        console.log(questions.length)
    } else {
        console.log("Quiz complete");
        alert('Quiz complete!');
        location.reload(); // Resetting the quiz
    }
}

function updateProgress() {
    const progressElement = document.getElementById('progress');
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressElement.style.width = `${progress}%`;
}
