let question = document.getElementById("question")
let answersDiv = document.querySelectorAll(".answersDiv")
let userInput = document.getElementById("userInput")
let gameSetup = document.getElementById("gameSetup")
let gameDiv = document.getElementById("gameDiv")
let scoreboardDiv = document.getElementById("scoreboardDiv")
let remainingQuestions = document.getElementById("questionsRemaining")
let remainingLives = document.getElementById("livesRemaining")
let correctAnswers = document.getElementById("correctAnswers")
let formDiv = document.getElementById("formDiv")
let selectList = document.getElementById("selectList")
let scoreboardInfo = document.getElementById("scoreboardInfo")
let tryAgainButton = document.getElementById("tryAgainButton")
let quizDataArr = null
let answersArr = []
let rightAnswer = null
let startQuestion = 0
let score = 0
let livesArr = null
let flag = false


async function getQuestion(amount, category) {
    let data = {}
    
    await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}`)
    .then((response) => response.json())
    .then(responseData => {
        //console.log(responseData.results[0]);
        data = responseData.results
    })
    .catch((e) => console.log(e))

    return data
}

function shuffleArray(arr) {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[random]] = [newArr[random], newArr[i]]
    }
    return newArr
} 

function errorMessage(message, bool){
    let errorTag = document.querySelector(".errorMessage")
    errorTag.innerHTML = message
    if(bool){        
        errorTag.style.display = "block"
    } else {
        errorTag.style.display = "none"
    }
}

function parseBlackMagic(string) {
    const parser = new DOMParser()
    const decodedStr = parser.parseFromString(string, "text/html").body.textContent

    return decodedStr
}


async function displayNewQuestion(getQuizData){
    reset()
    if (checkEndGame(livesArr.length, remainingQuestions.innerHTML)) return
    
    let quizData = getQuizData

    quizData.incorrect_answers.forEach(element => {
        answersArr.push(element)
    });
    answersArr.push(quizData.correct_answer)
    rightAnswer = parseBlackMagic(quizData.correct_answer)
    answersArr = shuffleArray(answersArr)
    
    question.innerHTML = quizData.question
    answersArr.forEach((answers, i) => {
        answersDiv[0].children[i].innerHTML = answers
    })
    
    console.log("Question: ", parseBlackMagic(quizData.question));
    console.log("Correct answer: ", rightAnswer);
}

async function startGame() {
    if(Number(userInput.value) && Number(userInput.value) >= 5 && Number(userInput.value) < 52){
        errorMessage("nice", false)
        quizDataArr = null
        livesArr = null
        startQuestion = 0

        userInput.value = Math.floor(Number(userInput.value))
        let category = selectList.options[selectList.selectedIndex].value
        
        quizDataArr = await getQuestion(userInput.value, category)
        
        livesArr = ["❤️", "❤️", "❤️", "❤️", "❤️"]
        remainingQuestions.innerHTML = userInput.value
        correctAnswers.innerHTML = 0
    
        gameSetup.style.display = "none"
        gameDiv.style.display = "grid"
        
        displayNewQuestion(quizDataArr[startQuestion])
    } else if (Number(userInput.value) < 5){
        errorMessage("Ehhhmmmmm NO☝🏽NO☝🏽, please minimum 5 😁", true)
    } else if (Number(userInput.value) > 51){
        errorMessage("Ehhhmmmmm NO☝🏽NO☝🏽, please maximum 51 😁", true)
    } else {
        errorMessage("Ehhhmmmmm NO☝🏽NO☝🏽, type a real number", true)
    }

}

function reset() {
    answersArr = []
    remainingLives.innerHTML = livesArr
    remainingQuestions.innerHTML = parseInt(remainingQuestions.innerHTML)
    Array.from(answersDiv[0].children).forEach((child) => {
        child.innerHTML = ""
        child.className = "answers"
    })
}

function checkEndGame(lives, questions){    
    if (lives == 0 || questions == 0) {
        scoreboardDiv.style.display = "grid"

        scoreboardInfo.children[0].innerHTML = remainingQuestions.innerHTML
        scoreboardInfo.children[1].innerHTML = lives
        scoreboardInfo.children[2].innerHTML = `${correctAnswers.innerHTML}  /  ${Math.floor(Number(userInput.value))}`

        gameDiv.style.display = "none"
        return true
    }
}

Array.from(answersDiv[0].children).forEach((child) => {
    child.addEventListener("click", async () => {
        if (flag || child.innerHTML == "") return;
        flag = true

        if (parseBlackMagic(child.innerHTML) === parseBlackMagic(rightAnswer)) {
            child.classList.add("rightAnswer")
            correctAnswers.innerHTML++
        } else {
            child.classList.add("wrongAnswer")

            Array.from(answersDiv[0].children).forEach((innerChild) => {
                if (parseBlackMagic(innerChild.innerHTML) === parseBlackMagic(rightAnswer)) {
                    innerChild.classList.add("rightAnswer")
                }
            })
            livesArr.pop()
        }
        startQuestion += 1
        remainingQuestions.innerHTML--

        await new Promise(resolve => setTimeout(resolve, 1000));
        flag = false
        displayNewQuestion(quizDataArr[startQuestion])
        
    })
})

tryAgainButton.addEventListener("click", () => {
    scoreboardDiv.style.display = "none"
    gameSetup.style.display = "grid"

})