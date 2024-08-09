import {
  BOARD_WIDTH,
  ships,
  startBtn,
  shipOptions,
  shipOptionsContainer,
} from "../app.js";

const flipBtn = document.querySelector("#flip-btn");
const userIsTaken = [];
let isHorizontal = true;
let angle = 0;
let draggedShip;
let targetedShipPart;
let startId;
let notDropped;

flipBtn.addEventListener("click", flip);

function flip() {
  angle = angle === 0 ? 90 : 0;
  isHorizontal = isHorizontal ? false : true;
  shipOptions.forEach((ship) => (ship.style.transform = `rotate(${angle}deg)`));
}

// Ships events
export function selectedShipPart(e) {
  targetedShipPart = e.target.id.split("-")[1];
}
export function dragStart(e) {
  draggedShip = e.target;
  e.target.style.opacity = 0.3;
  notDropped = false;
}
export function dragEnd(e) {
  e.target.style.opacity = 1;
}

// User events
export function dragOver(e) {
  e.preventDefault();
}
export function dropShip(e) {
  if (isHorizontal) {
    startId = e.target.id - targetedShipPart;
  } else {
    startId = e.target.id - targetedShipPart * BOARD_WIDTH;
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

export function addShipPiece(player, ship, isTakenArray, startId) {
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
      startIndex = Math.floor(Math.random() * BOARD_WIDTH * BOARD_WIDTH);
    } while (!isValid(startIndex, ship.length, isHorizontal, isTakenArray));
  }

  let shipBlocks = [];

  if (isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      shipBlocks.push(gridSquares[startIndex + i]);
      isTakenArray.push(Number(startIndex + i));
    }
  } else if (!isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      shipBlocks.push(gridSquares[startIndex + i * BOARD_WIDTH]);
      isTakenArray.push(Number(startIndex + i * BOARD_WIDTH));
    }
  }
  let audio = new Audio("/audio/placeShip.mp3");
  audio.play();

  shipBlocks.forEach((shipBlock) => {
    shipBlock.classList.add(ship.name);
    shipBlock.classList.add("taken");
  });
}

function isValid(startIndex, length, isHorizontal, isTakenArray) {
  if (isHorizontal) {
    // check if any block is taken
    for (let i = 0; i < length; i++) {
      for (let index of isTakenArray) {
        if (startIndex + i === index) return false;
      }
    }

    // check if there is any invalid block
    if (
      startIndex % BOARD_WIDTH <= 9 &&
      startIndex % BOARD_WIDTH >= 9 - length + 2
    ) {
      return false;
    }

    return true;
  } else if (!isHorizontal) {
    // check if any block is taken
    for (let i = 0; i < length; i++) {
      for (let index of isTakenArray) {
        if (startIndex + i * BOARD_WIDTH === index) return false;
      }
    }

    // check if there is any invalid block
    if (
      startIndex >=
      BOARD_WIDTH * BOARD_WIDTH - BOARD_WIDTH * length + BOARD_WIDTH
    ) {
      return false;
    }
    return true;
  }
}
