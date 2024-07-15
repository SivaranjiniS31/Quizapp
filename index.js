const timeLeft = document.querySelector(".time-left");
const quizContainer = document.getElementById("container");
const nextBtn = document.getElementById("next-button");
const countOfQuestion = document.querySelector(".number-of-question");
const displayContainer = document.getElementById("display-container");
const scoreContainer = document.querySelector(".score-container");
const restart = document.getElementById("restart");
const userScore = document.getElementById("user-score");
const startScreen = document.querySelector(".start-screen");
const startButton = document.getElementById("start-button");
let questionCount = 0; // Initialize questionCount
let scoreCount = 0;
let count = 11;
let countdown;

// Quiz questions array
let quizArray;

// Fetch the questions from the JSON file
fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
        quizArray = data;
        quizCreator();
        initial(); // Initialize the quiz
    })
    .catch((error) => {
        console.error("Error loading questions:", error);
    });

//Restart Quiz
restart.addEventListener("click", () => {
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

//Next Button
nextBtn.addEventListener(
  "click",
  (displayNext = () => {
    //increment questionCount
    questionCount += 1;
    //if last question
    if (questionCount == quizArray.length) {
      //hide question container and display score
      displayContainer.classList.add("hide");
      scoreContainer.classList.remove("hide");
      //user score
      userScore.innerHTML =
        "Your score is " + scoreCount + " out of " + questionCount;
    } else {
      //display questionCount
      countOfQuestion.innerHTML =
        questionCount + 1 + " of " + quizArray.length + " Question";
      //display quiz
      quizDisplay(questionCount);
      count = 11;
      clearInterval(countdown);
      timerDisplay();
    }
  })
);

//Timer
const timerDisplay = () => {
  countdown = setInterval(() => {
    count--;
    timeLeft.innerHTML = `${count}s`;
    if (count == 0) {
      clearInterval(countdown);
      displayNext();
    }
  }, 1000);
};

//Display quiz
const quizDisplay = (questionCount) => {
  const quizCards = document.querySelectorAll(".container-mid");
  //Hide other cards
  quizCards.forEach((card) => {
    card.classList.add("hide");
  });
  //display current question card
  quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
  // Check if quizArray is loaded
  if (!quizArray) {
    console.error("Quiz questions not loaded yet.");
    return;
  }

  //randomly sort questions
  quizArray.sort(() => Math.random() - 0.5);
  //generate quiz
  for (const i of quizArray) {
    //randomly sort options
    i.options.sort(() => Math.random() - 0.5);
    //quiz card creation
    const div = document.createElement("div");
    div.classList.add("container-mid", "hide");
    //question number
    countOfQuestion.innerHTML = 1 + " of " + quizArray.length + " Question";
    //question
    const question_DIV = document.createElement("p");
    question_DIV.classList.add("question");
    question_DIV.innerHTML = i.question;
    div.appendChild(question_DIV);
    //options
    div.innerHTML += `
    <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
     <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
      <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
       <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
    `;
    quizContainer.appendChild(div);
  }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
  const userSolution = userOption.innerText;
  const question =
    document.getElementsByClassName("container-mid")[questionCount];
  const options = question.querySelectorAll(".option-div");
  //if user clicked answer matches the correct answer
  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add("correct");
    scoreCount++;
  } else {
    userOption.classList.add("incorrect");
    // For marking the correct answer with green
    options.forEach((element) => {
      if (element.innerText == quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  }
  //disable all options
  options.forEach((element) => {
    element.disabled = true;
  });
}

//initial setup
function initial() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  count = 11;
  clearInterval(countdown);
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

//when user click on start button
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
});

// Typing Test
const paragraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Vivamus lacinia odio vitae vestibulum vestibulum.",
  "Cras vehicula, mi eget laoreet auctor, eros ligula cursus nunc."
];
const typingTestContainer = document.getElementById("typing-test-container");
const paragraphBox = document.getElementById("paragraph-box");
const inputField = document.getElementById("input-field");
const startTypingTestButton = document.getElementById("start-bttn");
const wpmContainer = document.getElementById("wpm_con");
const timeContainer = document.getElementById("time_con");
const accuracyContainer = document.getElementById("acc_con");

let timer;
let timeLeftTyping = 60;
let correctChars = 0;
let totalChars = 0;
let typingTestStarted = false;

startTypingTestButton.addEventListener("click", startTypingTest);

function startTypingTest() {
  typingTestStarted = true;
  paragraphBox.textContent = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  inputField.value = "";
  correctChars = 0;
  totalChars = 0;
  timeLeftTyping = 60;
  wpmContainer.textContent = "0 WPM";
  timeContainer.textContent = timeLeftTyping + "s";
  accuracyContainer.textContent = "Accuracy: 0%";
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

inputField.addEventListener("input", checkInput);

function checkInput() {
  const typedText = inputField.value;
  const originalText = paragraphBox.textContent;
  totalChars++;
  if (originalText.startsWith(typedText)) {
    correctChars++;
  }
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();
  wpmContainer.textContent = wpm + " WPM";
  accuracyContainer.textContent = "Accuracy: " + accuracy + "%";
}

function updateTimer() {
  timeLeftTyping--;
  timeContainer.textContent = timeLeftTyping + "s";
  if (timeLeftTyping === 0) {
    clearInterval(timer);
    typingTestStarted = false;
    inputField.disabled = true;
  }
}

function calculateWPM() {
  return Math.round((correctChars / 5) / ((60 - timeLeftTyping) / 60));
}

function calculateAccuracy() {
  return Math.round((correctChars / totalChars) * 100);
}

