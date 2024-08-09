import { computerGridSquares, startBtn } from "../app.js";

const computerAvailablePlayIndices = Array.from({ length: 100 }, (_, i) => i);
const infoDisplay = document.querySelector(".info-display");
const whosTurn = document.querySelector(".whos-turn");
const errorMessage = document.querySelector(".error-message");
const userSunkenShips = [];
let userHits = [];
let computerHits = [];
let computerSunkenShips = [];
let gameOver;
let audio;
let turn;

export function startGame() {
  // Ready to play(placing all the ships)
  const availableShips = Array.from(document.querySelector(".ships").children);
  if (availableShips.length > 0) {
    whosTurn.textContent = "";
    errorMessage.innerText = "Please place all your ships first!";
  } else {
    errorMessage.style.display = "none";
    whosTurn.textContent = "You Go";
    infoDisplay.textContent = "";
    startBtn.style.display = "none";
    turn = "user";
    audio = new Audio("/audio/start-game.mp3");
    audio.play();
    computerGridSquares.forEach((computerSquare) => {
      computerSquare.addEventListener("click", handleClick);
    });
  }
}

function handleClick(e) {
  if (!gameOver && turn === "user") {
    const squareClicked = e.target;
    if (
      squareClicked.classList.contains("boom") ||
      squareClicked.classList.contains("empty") ||
      squareClicked.classList.contains("sunk")
    ) {
      infoDisplay.textContent = "You can't choose this block";
      return;
    }
    if (squareClicked.classList.contains("taken")) {
      squareClicked.classList.add("boom");

      let classes = Array.from(e.target.classList);
      classes = classes.filter(
        (className) => className !== "battle-square-computer"
      );
      classes = classes.filter((className) => className !== "taken");
      classes = classes.filter((className) => className !== "boom");
      classes = classes.filter((className) => className !== "empty");
      userHits.push(...classes);

      infoDisplay.textContent = `You hit the ${classes[0]} ship`;
      audio = new Audio("/audio/hit.mp3");
      audio.play();
      checkScore("user", userHits, userSunkenShips, computerGridSquares);
      // console.log("userHits", userHits);
      // console.log("userSunkenShips", userSunkenShips);
    } else {
      squareClicked.classList.add("empty");
      infoDisplay.textContent = "You couldn't hit computer's ships";
      audio = new Audio("/audio/miss.mp3");
      audio.play();
    }
    computerGo();
  }
}
function computerGo() {
  if (!gameOver) {
    turn = "computer";
    whosTurn.textContent = "Computer Go";

    setTimeout(() => {
      const userGridSquares = Array.from(
        document.querySelectorAll(".battle-square-user")
      );
      const randomIndex = Math.floor(
        Math.random() * computerAvailablePlayIndices.length
      );
      const selectedValue = computerAvailablePlayIndices[randomIndex];
      const selectedDiv = userGridSquares.find(
        (div) => Number(div.id) === selectedValue
      );
      if (
        selectedDiv.classList.contains("empty") ||
        selectedDiv.classList.contains("boom") ||
        selectedDiv.classList.contains("sunk")
      ) {
        computerGo();
        return;
      } else if (selectedDiv.classList.contains("taken")) {
        selectedDiv.classList.add("boom");
        let classes = Array.from(selectedDiv.classList);
        classes = classes.filter(
          (className) => className !== "battle-square-user"
        );
        classes = classes.filter((className) => className !== "taken");
        classes = classes.filter((className) => className !== "boom");
        classes = classes.filter((className) => className !== "empty");
        computerHits.push(...classes);

        updateComputerAvailablePlayIndices(selectedValue);

        infoDisplay.textContent = `The computer hit your ${classes[0]} ship`;
        audio = new Audio("/audio/hit.mp3");
        audio.play();
        checkScore(
          "computer",
          computerHits,
          computerSunkenShips,
          userGridSquares
        );
      } else {
        selectedDiv.classList.add("empty");
        updateComputerAvailablePlayIndices(selectedValue);

        infoDisplay.textContent = "The computer couldn't hit your ships";
        audio = new Audio("/audio/miss.mp3");
        audio.play();
      }
      if (!gameOver) {
        whosTurn.innerText = "You Go";
        turn = "user";
      }
    }, 1000);
  }
}

function updateComputerAvailablePlayIndices(value) {
  const index = computerAvailablePlayIndices.indexOf(value);
  if (index > -1) {
    // only splice array when item is found
    computerAvailablePlayIndices.splice(index, 1); // 2nd parameter means remove one item only
  }
}

function checkScore(player, playerHits, playerSunkenShips, gridSquares) {
  function checkShip(name, length) {
    if (playerHits.filter((hit) => hit === name).length === length) {
      if (player === "user") {
        userHits = playerHits.filter((shipName) => shipName !== name);
        infoDisplay.textContent = `The computer's ${name} ship has sunken`;
      } else if (player === "computer") {
        computerHits = playerHits.filter((shipName) => shipName !== name);
        infoDisplay.textContent = `Your ${name} ship has sunken`;
      }
      playerSunkenShips.push(name);
      for (let sunken of playerSunkenShips) {
        for (let square of gridSquares) {
          if (square.classList.contains(`${sunken}`)) {
            square.classList.add("sunk");
          }
        }
      }
    }
  }

  checkShip("destroyer", 2);
  checkShip("submarine", 3);
  checkShip("cruise", 3);
  checkShip("battleship", 4);
  checkShip("carrier", 5);

  if (playerSunkenShips.length === 5) {
    if (player === "user") {
      whosTurn.textContent = "YOU WIN 🎉";
      infoDisplay.textContent = "You have destroyed all computer's ships";
      audio = new Audio("/audio/win.wav");
      audio.play();
    } else if (player === "computer") {
      whosTurn.textContent = "COMPUTER WINS 😶‍🌫️";
      infoDisplay.textContent = "Computer destroyed all your ships";
      audio = new Audio("/audio/lose.wav");
      audio.play();
    }
    gameOver = true;
    return;
  }
}
