import { BOARD_WIDTH } from "../app.js";

export function createBoard(grid) {
  let columnNumToCreateHeader = -1;
  createBoardHeadersRows(grid);
  for (let i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i++) {
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
  for (let i = 0; i < BOARD_WIDTH + 1; i++) {
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
