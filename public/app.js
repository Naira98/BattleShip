const userGrid = document.querySelector(".user-grid");
const computerGrid = document.querySelector(".computer-grid");
const flipBtn = document.querySelector("#flip-btn");
const startBtn = document.querySelector("#start-btn");
const shipOptionsContainer = document.querySelector(".ships");
const infoDisplay = document.querySelector(".info-display");
const whosTurn = document.querySelector(".whos-turn");
const errorMessage = document.querySelector(".error-message");
const userIsTaken = [];
const computerIsTaken = [];
let userHits = [];
let computerHits = [];
const userSunkenShips = [];
const computerSunkenShips = [];
let audio;

const width = 10;
let angle = 0;
let columnNumToCreateHeader = -1;
let targetedShipPart;
let isHorizontal = true;
let startId;
let notDropped;
let isReady;
let gameOver;
let turn = "You";

createBoard(userGrid);
columnNumToCreateHeader = -1;
createBoard(computerGrid);

flipBtn.addEventListener("click", flip);

// creating ships
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}
const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruise = new Ship("cruise", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

const ships = [destroyer, submarine, cruise, battleship, carrier];
ships.forEach((ship) => addShipPiece("computer", ship, computerIsTaken, null));

const userPlayingBlocks = document.querySelectorAll(".battle-square-user");

const shipOptions = Array.from(shipOptionsContainer.children);
shipOptions.forEach((ship) => {
  ship.addEventListener("mousedown", selectedShipPart);
  ship.addEventListener("dragstart", dragStart);
  ship.addEventListener("dragend", dragEnd);
});

const userBlocksOptions = Array.from(userPlayingBlocks);
let draggedShip;
userBlocksOptions.forEach((userBlockOption) => {
  userBlockOption.addEventListener("dragover", dragOver);
  userBlockOption.addEventListener("drop", dropShip);
});

isReady = startBtn.addEventListener("click", startGame);

let computerGridSquares = Array.from(
  document.querySelectorAll(".battle-square-computer")
);

let notTargetedYet = [];
for (let i = 0; i < width * width; i++) {
  notTargetedYet.push(i);
}

function createBoard(grid) {
  createBoardHeadersRows(grid);
  for (let i = 0; i < width * width; i++) {
    if (i === 0 || i % 10 === 0) {
      columnNumToCreateHeader++;
      createBoardHeadersColumns(grid, columnNumToCreateHeader);
    }
    const square = document.createElement("div");
    square.id = i;
    if (grid.classList.contains("user-grid")) {
      square.classList.add("battle-square-user");
    } else if (grid.classList.contains("computer-grid")) {
      square.classList.add("battle-square-computer");
    }

    grid.appendChild(square);
  }
}
// create 1-10 headers
function createBoardHeadersRows(grid) {
  for (let i = 0; i < width + 1; i++) {
    const headerSquare = document.createElement("div");
    if (i === 0) {
      headerSquare.classList.add("header-squares");
      grid.appendChild(headerSquare, i);
      continue;
    }
    headerSquare.innerText = i;
    headerSquare.classList.add("header-squares");
    grid.appendChild(headerSquare);
  }
}
// create A-J headers
function createBoardHeadersColumns(grid, columnNumToCreateHeader) {
  const headerSquare = document.createElement("div");
  headerSquare.innerText = String.fromCharCode(columnNumToCreateHeader + 65);
  headerSquare.classList.add("header-squares");
  grid.appendChild(headerSquare);
}

function flip() {
  const shipOptions = Array.from(shipOptionsContainer.children);
  angle = angle === 0 ? 90 : 0;
  isHorizontal = isHorizontal ? false : true;
  shipOptions.forEach((ship) => (ship.style.transform = `rotate(${angle}deg)`));
}

function addShipPiece(player, ship, isTakenArray, startId) {
  const gridSquares = Array.from(
    document.querySelectorAll(`.battle-square-${player}`)
  );

  const randomBoolean = Math.random() > 0.5;
  isHorizontal = player === "user" ? angle === 0 : randomBoolean;

  let startIndex;

  if (startId != null) {
    startIndex = Number(startId);

    if (!isValid(startIndex, ship.length, isHorizontal, isTakenArray)) {
      notDropped = true;
      return;
    }
  } else {
    do {
      startIndex = Math.floor(Math.random() * width * width);
    } while (!isValid(startIndex, ship.length, isHorizontal, isTakenArray));
  }

  let shipBlocks = [];

  if (isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      shipBlocks.push(gridSquares[startIndex + i]);
      isTakenArray.push(gridSquares[startIndex + i]);
    }
  } else if (!isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      shipBlocks.push(gridSquares[startIndex + i * width]);
      isTakenArray.push(gridSquares[startIndex + i * width]);
    }
  }

  shipBlocks.forEach((shipBlock) => {
    // if (player === "user") {
    shipBlock.classList.add(ship.name);
    // }
    shipBlock.classList.add("taken");
  });
}

function isValid(startIndex, length, isHorizontal, isTakenArray) {
  for (div of isTakenArray) {
    for (let i = 0; i < length; i++) {
      if (startIndex + i === div.id) {
        return false;
      }
    }
  }
  if (isHorizontal) {
    // check if any block is taken
    for (let i = 0; i < length; i++) {
      for (index of isTakenArray) {
        if (startIndex + i === Number(index.id)) {
          return false;
        }
      }
    }

    // check if there is any invalid block
    if (startIndex % width <= 9 && startIndex % width >= 9 - length + 2) {
      return false;
    }
    return true;
  } else if (!isHorizontal) {
    // check if any block is taken
    for (let i = 0; i < length; i++) {
      for (index of isTakenArray) {
        if (startIndex + i * width === Number(index.id)) {
          return false;
        }
      }
    }

    // check if there is any invalid block
    if (startIndex >= width * width - width * length + width) {
      return false;
    }
    return true;
  }
}
function selectedShipPart(e) {
  targetedShipPart = e.target.id.split("-")[1];
}

function dragStart(e) {
  draggedShip = e.target;
  e.target.style.opacity = 0.3;
  notDropped = false;
}
function dragEnd(e) {
  e.target.style.opacity = 1;
}
function dragOver(e) {
  e.preventDefault();
}
function dropShip(e) {
  if (isHorizontal) {
    startId = e.target.id - targetedShipPart;
  } else {
    startId = e.target.id - targetedShipPart * width;
  }
  const ship = ships[draggedShip.id];
  addShipPiece("user", ship, userIsTaken, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
  const availableShips = Array.from(document.querySelector(".ships").children);
  if (availableShips.length === 0) {
    flipBtn.style.display = "none";
    shipOptionsContainer.style.display = "none";
    startBtn.style.display = "block";
  }
}

function startGame() {
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
    audio = new Audio("/audio/start-game.mp3");
    audio.play();
    computerGridSquares.forEach((computerSquare) => {
      computerSquare.addEventListener("click", handleClick);
    });
  }
}

function handleClick(e) {
  if (!gameOver) {
    const squareClicked = e.target;
    computerGridSquares = Array.from(
      document.querySelectorAll(".battle-square-computer")
    );
    if (
      squareClicked.classList.contains("boom") ||
      squareClicked.classList.contains("empty")
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
      console.log("userHits", userHits);
      console.log("userSunkenShips", userSunkenShips);
    } else {
      squareClicked.classList.add("empty");
      infoDisplay.textContent = "You couldn't hit computer's ships";
      audio = new Audio("/audio/miss.mp3");
      audio.play();
    }
    computerGridSquares.forEach((computerSquare) => {
      computerSquare.replaceWith(computerSquare.cloneNode(true));
    });
    computerGo();
  }
}

function computerGo() {
  if (!gameOver) {
    whosTurn.textContent = "Computer Go";

    setTimeout(() => {
      const userGridSquares = Array.from(
        document.querySelectorAll(".battle-square-user")
      );
      const randomIndex = Math.floor(Math.random() * 100);
      if (
        userGridSquares[randomIndex].classList.contains("empty") ||
        userGridSquares[randomIndex].classList.contains("boom")
      ) {
        computerGo();
        return;
      } else if (userGridSquares[randomIndex].classList.contains("taken")) {
        userGridSquares[randomIndex].classList.add("boom");
        let classes = Array.from(userGridSquares[randomIndex].classList);
        classes = classes.filter(
          (className) => className !== "battle-square-user"
        );
        classes = classes.filter((className) => className !== "taken");
        classes = classes.filter((className) => className !== "boom");
        classes = classes.filter((className) => className !== "empty");
        computerHits.push(...classes);

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
        userGridSquares[randomIndex].classList.add("empty");
        infoDisplay.textContent = "The computer couldn't hit your ships";
        audio = new Audio("/audio/miss.mp3");
        audio.play();
      }

      whosTurn.innerText = "You Go";

      computerGridSquares = Array.from(
        document.querySelectorAll(".battle-square-computer")
      );

      computerGridSquares.forEach((computerSquare) => {
        computerSquare.addEventListener("click", handleClick);
      });
    }, 1000);
  }
}

function checkScore(player, playerHits, playerSunkenShips, gridSquares) {
  function checkShip(name, length) {
    if (playerHits.filter((hit) => hit === name).length === length) {
      if (player === "user") {
        userHits = playerHits.filter((shipName) => shipName !== name);
        infoDisplay.textContent = `You have sunken computer's ${name} ship`;
      } else if (player === "computer") {
        computerHits = playerHits.filter((shipName) => shipName !== name);
        infoDisplay.textContent = `Computer has sunken your ${name} ship`;
      }
      playerSunkenShips.push(name);
      for (let sunken of playerSunkenShips) {
        for (let square of gridSquares) {
          if (square.classList.contains(`${sunken}`)) {
            square.classList.remove("boom");
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
