class Keyboard {
    constructor(keys, hangman){
        this.keys = keys
        this.guessedLetters = []
        this.hangman = hangman
        this.handleKey = this.handleKey.bind(this)
        this.handleInit = this.handleInit.bind(this)
        this.setupClickListener()
        this.setupKeyListener()
    }

    handleInit(event){
        let letter = event.key.toLowerCase()

        if (this.guessedLetters.includes(letter) || !alphabet.toLocaleLowerCase().includes(letter)) return;


        this.guessedLetters.push(letter);
        this.checkLetter(letter)
    }

    handleKey(event){        
        let letter = event.target.innerHTML.toLowerCase()
        
        if (!this.guessedLetters.includes(letter)){
            this.guessedLetters.push(letter)
            this.checkLetter(letter)
        }
  
    }

    setupClickListener(){
        this.keys.forEach((key) => {
            key.addEventListener("click", this.handleKey)
        })
    }

    setupKeyListener(){
        document.addEventListener("keydown", this.handleInit)
    }

    checkLetter(letter){        
        this.keys.forEach((value) => {
            if (value.innerHTML.toLowerCase() == letter){
                if (this.hangman.word.toLowerCase().includes(letter)){;
                    value.classList.add("rightLetter")
                } else {
                    value.classList.add("wrongLetter")
                }
            }
        })
        this.hangman.checkGuess(letter)
    }

    clear(){
        this.keys.forEach((key) => {
            key.removeEventListener("click", this.handleKey)
        })
        document.removeEventListener("keydown", this.handleInit)
    }
}

class Hangman{
    constructor(word){
        this.word = word
        this.wordLines = null
        this.wrongGuesses = 0
        this.init()
        this.drawWord()        
    }

    init() {
        this.wordLines = "-".repeat(this.word.length)
    }

    updateWord(letter){
        if(this.word.toLowerCase().includes(letter)){
            let wordArray = this.wordLines.split("")

            for (let i = 0; i < this.word.length; i++){
                if(this.word[i].toLowerCase() == letter){     
                    wordArray[i] = this.word[i]
                }
            }

            this.wordLines = wordArray.join("")
        }
        ctx.clearRect(400,200, canvas.width, canvas.height);
        this.drawWord()
        this.checkWinner()
    }

    drawGallows(){
        ctx.beginPath()
        ctx.moveTo(125, 300);
        ctx.lineTo(275, 300);
        ctx.stroke();
        
        ctx.moveTo(200, 300);
        ctx.lineTo(200, 100);
        ctx.stroke();
    
        ctx.moveTo(200, 100);
        ctx.lineTo(300, 100);
        ctx.stroke()
    
        ctx.moveTo(300, 100);
        ctx.lineTo(300, 140);
        ctx.stroke()  
    }

    drawHead(){
        ctx.beginPath()
        ctx.arc(300, 160, 20, 0, 2 * Math.PI)
        ctx.stroke()
    }

    drawBody(){
        ctx.beginPath()
        ctx.moveTo(300, 180)
        ctx.lineTo(300, 240)
        ctx.stroke()
    }

    drawRightArm(){
        ctx.beginPath()
        ctx.lineTo(300, 210)
        ctx.lineTo(330, 190)
        ctx.stroke()
    }

    drawLeftArm(){
        ctx.beginPath()
        ctx.lineTo(300, 210)
        ctx.lineTo(270, 190)
        ctx.stroke()
    }

    drawRightLeg(){
        ctx.beginPath()
        ctx.lineTo(300, 240)
        ctx.lineTo(330, 260)
        ctx.stroke()
    }

    drawLeftLeg(){
        ctx.beginPath()
        ctx.lineTo(300, 240)
        ctx.lineTo(270, 260)
        ctx.stroke()
    }

    drawWord(){
        ctx.beginPath()
        ctx.fillStyle = "gold"
        ctx.font = "50px monospace"
        ctx.fillText(this.wordLines, 400, 250)
    }

    youWon(){
        ctx.beginPath()
        ctx.fillStyle = "gold"
        ctx.font = "40px monospace"
        ctx.fillText("YOU WON!", 400, 155)
    }

    youLost(){
        ctx.beginPath()
        ctx.fillStyle = "gold"
        ctx.font = "40px monospace"
        ctx.fillText("YOU LOST!", 400, 120)
        ctx.fillText("The word was", 400, 150)

        this.wordLines = this.word
        ctx.clearRect(400,200, canvas.width, canvas.height);
        this.drawWord()
    }

    drawNextPart(){
        switch (this.wrongGuesses) {
            case 1:
                this.drawHead();
                break;
            case 2:
                this.drawBody();
                break;
            case 3:
                this.drawRightArm();
                break;
            case 4:
                this.drawLeftArm();
                break;
            case 5:
                this.drawRightLeg();
                break;
            case 6:
                this.drawLeftLeg();
                break;
        }
    }

    checkGuess(letter) {              
        if (!this.word.toLowerCase().includes(letter)){
            this.wrongGuesses++;            
            this.drawNextPart();
        }
        this.updateWord(letter)
    }

    checkWinner(){
        if(!this.wordLines.includes("-") && this.wrongGuesses < 6){
            this.youWon()
            tryAgainButton.style.display = "block"
            this.tryAgain()
            keyboard.clear() 
            
        } else if (this.wrongGuesses >= 6){  
            this.youLost()
            tryAgainButton.style.display = "block"
            this.tryAgain()        
            //intervalId = setInterval(addImage, 50);
            keyboard.clear()
        }
    }

    tryAgain(){
        tryAgainButton.addEventListener("click", () => {
            ctx.clearRect(0,0,canvas.width, canvas.height)
            gameSetup.style.display = "grid"
            keyboardDiv.style.display = "none"
            canvasDiv.style.display = "none"
            tryAgainButton.style.display = "none"

            clearInterval(intervalId);
            imagesAdded = 0
            const images = document.querySelectorAll('.laughing-image');            
            images.forEach(img => img.remove());        
        })
    }
}

let gameSetup = document.getElementById("gameSetup")
let selectList = document.getElementById("selectList")
let tryAgainButton = document.getElementById("tryAgainButton")
let keyboardDiv = document.getElementById("keyboardDiv")

const canvas = document.getElementById("myCanvas")
const canvasDiv = document.getElementById("canvasDiv")
const ctx = canvas.getContext("2d")
ctx.strokeStyle = "gold";
ctx.lineWidth = 5;

const imageSrc = 'laughing2.png';
const numberOfImages = 100;
let imagesAdded = 0;
let intervalId = null

let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ"
let hangman = null
let keyboard = null
let keys = null

async function getRandomWord(category) {
    let hangmanWord = null    
    let categoryValid = category ? 'category='+ category : ""

    await fetch(`https://www.wordgamedb.com/api/v1/words/?${categoryValid}`)
    .then(response => response.json())
    .then(data => {

        let randomWord = data[Math.floor(Math.random() * data.length)]
        hangmanWord = randomWord.word
    })
    .catch(e => console.log(e))

    return hangmanWord
}
async function getRandomWordJson(category) {
    let hangmanWord = null    

    await fetch(`categories.json`)
    .then(response => response.json())
    .then(data => {

        if(category == ""){
            let categories = Object.keys(data)
            hangmanWord = categories[Math.floor(Math.random() * categories.length)]
            return hangmanWord
        }
        hangmanWord = data[category][Math.floor(Math.random() * data[category].length)]        
    })
    .catch(e => console.log(e))

    return hangmanWord
}

async function startGame() {
    keys = document.querySelectorAll(".keyboard")
    reset(keys);
    let category = selectList.options[selectList.selectedIndex].value
    let word = await getRandomWordJson(category)
    
    gameSetup.style.display = "none"
    keyboardDiv.style.display = "flex"
    canvasDiv.style.display = "block"

    hangman = new Hangman(word)
    keyboard = new Keyboard(keys, hangman)
    hangman.drawGallows()
}

function reset(keys){
    keys.forEach((value) => {
        value.className = "keyboard"
    })

}

function createKeyboardKeys(){
    let fragment = document.createDocumentFragment()

    for(let i = 0; i < alphabet.length; i++){
        let div = Object.assign(document.createElement("div"), {className: "keyboard", innerHTML: alphabet[i]})
        fragment.append(div)
    }

    keyboardDiv.append(fragment)
}

const addImage = () => {
    if (imagesAdded >= numberOfImages) {
        clearInterval(intervalId);
        return;
    }

    const img = new Image();
    img.src = imageSrc;
    img.className = 'laughing-image';
    const randomSize = Math.random() * 100 + 50
    img.style.width = `${randomSize}px`;
    img.style.height = 'auto';
    img.style.top = `${Math.random() * window.innerHeight - 150}px`;
    img.style.left = `${Math.random() * window.innerWidth - 150}px`;
    document.body.appendChild(img);

    imagesAdded++;
};


createKeyboardKeys()