class Card {
    constructor(symbol, imageUrl, elementId) {
      this.symbol = symbol
      this.cover = true
  
      this.imageUrl = imageUrl
      this.elementId = elementId
      this.imageElement = null
    }
  
    static compare(card1, card2) {
        if (card1.symbol !== card2.symbol) return false;

        card1.cover = false
        card2.cover = false
        return true
    }
  
    initImage() {
      const element = document.getElementById(this.elementId);
      if (element) {
        this.imageElement = document.createElement('img');
        this.imageElement.src = this.imageUrl;
        this.imageElement.className = "cardCover"

        element.style.position = 'relative';
        element.append(this.imageElement);
        
      } else {
        console.log(`Element with ID ${this.elementId} not found`)
      }
    }
  
    toggleImage(cover) {
      if (this.imageElement) {
        this.imageElement.style.display = cover ? 'block' : 'none'
      } else {
        console.log(`Image element for ${this.elementId} not initialized`)
      }
    }
}

let memoryBox = document.getElementsByClassName("memoryBox")
let memoryDiv = document.getElementById("gameDiv")
let checkbox = document.getElementById("checkbox")

let cards = []
let symbols = []
let mySymbols = ["😂","💀","👌","😁","👍","🤦‍♂️","✌️","😒","😃","🤩","🙂","😶‍🌫️","🙄","😏","😜","🙃","😕","😓","🤑","😬","😮‍💨","🤪","🥴","🤒","🙂‍↕️","🤫"]

function shuffleArray(arr) {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
};

function isArrayUnique(arr) {
    return arr.every((value, index) => arr.indexOf(value) === index)
}

function reset() {
    memoryDiv.innerHTML = ""
    cards = []
    symbols = []
}

function errorMessage(){
    let errorMessage = document.createElement("p")
    errorMessage.innerHTML = "Kan ikke bruke samme symbol flere ganger!!!!!!!!!!!"
    errorMessage.style.color = "gold"
    errorMessage.style.fontSize = "50px"
    errorMessage.style.textAlign = "center"

    memoryDiv.append(errorMessage)
}

function createCards(symbols, cards, symbolInputValue){
    let symbolsLength = symbols.length > 1  ? symbols.length : symbolInputValue
    const fragment = document.createDocumentFragment()
    
    for (let i = 0; i < symbolsLength; i++){
        let element = document.createElement("div")
        Object.assign(element, {className: "memoryBox", id: "memoryBox" + i})
        element.setAttribute("data-value", i)
        fragment.append(element)

        cards.push(new Card(`${symbols[i] ?? "😎"}`, "card.jpg", "memoryBox" + i))
    }
    memoryDiv.append(fragment)
    cards.forEach(card => card.initImage())

    cards.forEach((card, i) => {
        const symbolText = document.createTextNode(card.symbol)
        memoryBox[i].appendChild(symbolText)
    })
}

function initializeGame(startCards){
    let cardInput = document.getElementById("inputId")
    let symbolInput = document.getElementById("symbolId")    
    symbolInput = Array.from(symbolInput.value).filter((item) => item != " ")
    let symbolsToGoThrough = symbolInput.length > 0 ? symbolInput : mySymbols
    let allCards = cardInput.value ? cardInput.value : startCards

    cardInput.placeholder = "Valgfritt"
    
    reset()
    if (!checkbox.checked) {
        if (!isArrayUnique(symbolInput)){
            errorMessage()
            return
        }
    
        if (allCards > 1) {
            if(symbolsToGoThrough.length > 0){
                symbolsToGoThrough = symbolsToGoThrough.slice(0,  allCards / 2)
            }
        }
        
        symbolsToGoThrough.forEach((value, index) => {
            symbols.push(symbolsToGoThrough[index], symbolsToGoThrough[index])     
        });

        symbols = shuffleArray(symbols)            
    } else {
        symbolInput.value = parseInt(symbolInput.join("")) * 2        
    }         

    createCards(symbols, cards, symbolInput.value)    
    startGame()
}

function startGame(){
    let isProcessing = false

    Array.from(memoryBox).forEach((element, index) => {
        tmpArr = {
            firstCard: null,
            secondCard: null
        }
        
        element.onclick = (event) => {
            if (isProcessing) return;
            if (!cards[index].cover) return;
            
            cards[index].toggleImage(false)
            cards[index].cover = false

            if (tmpArr.firstCard == null){
                tmpArr.firstCard = index
            } else {
                tmpArr.secondCard = index
                isProcessing = true
                
                if (!Card.compare(cards[tmpArr.firstCard], cards[tmpArr.secondCard])){
                    setTimeout(() => {
                        cards[tmpArr.firstCard].toggleImage(true)
                        cards[tmpArr.secondCard].toggleImage(true)

                        
                        cards[tmpArr.firstCard].cover = true
                        cards[tmpArr.secondCard].cover = true
                        tmpArr.firstCard = null
                        tmpArr.secondCard = null
                        isProcessing = false

                    }, 500)
                } else {
                    tmpArr.firstCard = null
                    tmpArr.secondCard = null
                    isProcessing = false
                }
            }  
        }
    });
}


initializeGame(10)