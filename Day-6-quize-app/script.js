// DOM Elements
const homeElement = document.getElementById("home")
const quizElement = document.getElementById("quiz")
const endElement = document.getElementById("end")
const highscoresElement = document.getElementById("highscores")
const startButton = document.getElementById("start-btn")
const highscoresButton = document.getElementById("highscores-btn")
const questionElement = document.getElementById("question")
const answerButtonsElement = document.getElementById("answer-buttons")
const progressText = document.getElementById("progressText")
const progressBarFull = document.getElementById("progress-bar-full")
const scoreElement = document.getElementById("score")
const timerElement = document.getElementById("timer")
const finalScoreElement = document.getElementById("final-score")
const usernameForm = document.getElementById("username-form")
const usernameInput = document.getElementById("username")
const saveScoreButton = document.getElementById("save-score-btn")
const playAgainButton = document.getElementById("play-again-btn")
const goHomeButton = document.getElementById("go-home-btn")
const highscoresList = document.getElementById("highscores-list")
const clearHighscoresButton = document.getElementById("clear-highscores-btn")
const returnHomeButton = document.getElementById("return-home-btn")

// Game variables
let currentQuestionIndex = 0
let score = 0
let timeLeft = 30
let timer
let acceptingAnswers = false
let questions = []
const MAX_HIGH_SCORES = 5

// Event Listeners
startButton.addEventListener("click", startQuiz)
highscoresButton.addEventListener("click", showHighscores)
usernameForm.addEventListener("submit", saveHighScore)
playAgainButton.addEventListener("click", startQuiz)
goHomeButton.addEventListener("click", goToHome)
clearHighscoresButton.addEventListener("click", clearHighscores)
returnHomeButton.addEventListener("click", goToHome)

// Quiz questions
const quizQuestions = [
  {
    question: "Which language runs in a web browser?",
    answers: [
      { text: "Java", correct: false },
      { text: "C", correct: false },
      { text: "Python", correct: false },
      { text: "JavaScript", correct: true },
    ],
    type: "multiple-choice",
  },
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Central Style Sheets", correct: false },
      { text: "Cascading Style Sheets", correct: true },
      { text: "Cascading Simple Sheets", correct: false },
      { text: "Cars SUVs Sailboats", correct: false },
    ],
    type: "multiple-choice",
  },
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hypertext Markup Language", correct: true },
      { text: "Hypertext Markdown Language", correct: false },
      { text: "Hyperloop Machine Language", correct: false },
      { text: "Helicopters Terminals Motorboats Lamborginis", correct: false },
    ],
    type: "multiple-choice",
  },
  {
    question: "What year was JavaScript launched?",
    answers: [
      { text: "1996", correct: false },
      { text: "1995", correct: true },
      { text: "1994", correct: false },
      { text: "None of the above", correct: false },
    ],
    type: "multiple-choice",
  },
  {
    question: "JavaScript is a case-sensitive language.",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
    type: "true-false",
  },
  {
    question: "Which of these is NOT a JavaScript framework?",
    answers: [
      { text: "React", correct: false },
      { text: "Angular", correct: false },
      { text: "Vue", correct: false },
      { text: "Java Spring", correct: true },
    ],
    type: "multiple-choice",
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    answers: [
      { text: "//", correct: true },
      { text: "#", correct: false },
      { text: "/* */", correct: false },
      { text: "Both // and /* */", correct: true },
    ],
    type: "multiple-choice",
  },
  {
    question: "localStorage data persists until explicitly deleted.",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false },
    ],
    type: "true-false",
  },
  {
    question: "Which method is used to add an element at the end of an array?",
    answers: [
      { text: "push()", correct: true },
      { text: "pop()", correct: false },
      { text: "append()", correct: false },
      { text: "add()", correct: false },
    ],
    type: "multiple-choice",
  },
  {
    question: "What is the correct way to write a JavaScript array?",
    answers: [
      { text: "var colors = (1:'red', 2:'green', 3:'blue')", correct: false },
      { text: "var colors = ['red', 'green', 'blue']", correct: true },
      { text: "var colors = 'red', 'green', 'blue'", correct: false },
      { text: "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')", correct: false },
    ],
    type: "multiple-choice",
  },
]

// Functions
function startQuiz() {
  homeElement.classList.add("hide")
  highscoresElement.classList.add("hide")
  endElement.classList.add("hide")
  quizElement.classList.remove("hide")

  // Reset game state
  currentQuestionIndex = 0
  score = 0
  scoreElement.innerText = score

  // Shuffle and select questions
  questions = [...quizQuestions].sort(() => Math.random() - 0.5)

  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex])
    updateProgressBar()
    startTimer()
  } else {
    endQuiz()
  }
}

function showQuestion(question) {
  questionElement.innerText = question.question
  progressText.innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`

  question.answers.forEach((answer) => {
    const button = document.createElement("button")
    button.innerText = answer.text
    button.classList.add("btn", "answer-btn")
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener("click", selectAnswer)
    answerButtonsElement.appendChild(button)
  })

  acceptingAnswers = true
}

function resetState() {
  clearInterval(timer)
  acceptingAnswers = false
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  if (!acceptingAnswers) return

  acceptingAnswers = false
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct

  if (correct) {
    score += 10
    scoreElement.innerText = score
  }

  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct)
  })

  setTimeout(() => {
    currentQuestionIndex++
    setNextQuestion()
  }, 1000)
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add("correct")
  } else {
    element.classList.add("incorrect")
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct")
  element.classList.remove("incorrect")
}

function updateProgressBar() {
  const progress = (currentQuestionIndex / questions.length) * 100
  progressBarFull.style.width = `${progress}%`
}

function startTimer() {
  timeLeft = 30
  timerElement.innerText = timeLeft
  timerElement.classList.remove("warning")

  timer = setInterval(() => {
    timeLeft--
    timerElement.innerText = timeLeft

    if (timeLeft <= 10) {
      timerElement.classList.add("warning")
    }

    if (timeLeft <= 0) {
      clearInterval(timer)
      // Time's up, move to next question
      currentQuestionIndex++
      setNextQuestion()
    }
  }, 1000)
}

function endQuiz() {
  quizElement.classList.add("hide")
  endElement.classList.remove("hide")
  finalScoreElement.innerText = score
  clearInterval(timer)
}

function saveHighScore(e) {
  e.preventDefault()

  const username = usernameInput.value
  if (!username || !score) return

  const highScores = JSON.parse(localStorage.getItem("highScores")) || []

  const newScore = {
    score: score,
    name: username,
    date: new Date().toLocaleDateString(),
  }

  highScores.push(newScore)
  highScores.sort((a, b) => b.score - a.score)
  highScores.splice(MAX_HIGH_SCORES)

  localStorage.setItem("highScores", JSON.stringify(highScores))

  showHighscores()
}

function showHighscores() {
  homeElement.classList.add("hide")
  quizElement.classList.add("hide")
  endElement.classList.add("hide")
  highscoresElement.classList.remove("hide")

  highscoresList.innerHTML = ""

  const highScores = JSON.parse(localStorage.getItem("highScores")) || []

  highScores.forEach((score) => {
    const li = document.createElement("li")
    li.innerHTML = `<span>${score.name}</span><span>${score.score} points - ${score.date}</span>`
    highscoresList.appendChild(li)
  })
}

function clearHighscores() {
  localStorage.removeItem("highScores")
  highscoresList.innerHTML = ""
}

function goToHome() {
  endElement.classList.add("hide")
  quizElement.classList.add("hide")
  highscoresElement.classList.add("hide")
  homeElement.classList.remove("hide")
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Check if there are saved high scores
  const highScores = JSON.parse(localStorage.getItem("highScores")) || []
  if (highScores.length === 0) {
    // Add some sample high scores if none exist
    const sampleScores = [
      { name: "John", score: 90, date: "1/1/2023" },
      { name: "Sarah", score: 80, date: "1/2/2023" },
      { name: "Mike", score: 70, date: "1/3/2023" },
    ]
    localStorage.setItem("highScores", JSON.stringify(sampleScores))
  }
})
