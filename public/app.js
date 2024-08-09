import { createBoard } from "./helpers/createBoards.js";
import {
  addShipPiece,
  dragEnd,
  dragOver,
  dragStart,
  dropShip,
  selectedShipPart,
} from "./helpers/placeShips.js";
import { startGame } from "./helpers/game.js";

const userGrid = document.querySelector(".user-grid");
const computerGrid = document.querySelector(".computer-grid");
export const startBtn = document.querySelector("#start-btn");
export const shipOptionsContainer = document.querySelector(".ships");

const computerIsTaken = [];

export const BOARD_WIDTH = 10;

// Making boards
createBoard(userGrid);
createBoard(computerGrid);

const userPlayingBlocks = document.querySelectorAll(".battle-square-user");
export let computerGridSquares = Array.from(
  document.querySelectorAll(".battle-square-computer")
);

// Making ships
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

export const ships = [destroyer, submarine, cruise, battleship, carrier];

// Computer ships placing
ships.forEach((ship) => addShipPiece("computer", ship, computerIsTaken, null));

// Ships drag and drop
export const shipOptions = Array.from(shipOptionsContainer.children);
shipOptions.forEach((ship) => {
  ship.addEventListener("mousedown", selectedShipPart);
  ship.addEventListener("dragstart", dragStart);
  ship.addEventListener("dragend", dragEnd);
});

// User moving ships
const userBlocksOptions = Array.from(userPlayingBlocks);
userBlocksOptions.forEach((userBlockOption) => {
  userBlockOption.addEventListener("dragover", dragOver);
  userBlockOption.addEventListener("drop", dropShip);
});

startBtn.addEventListener("click", startGame);
