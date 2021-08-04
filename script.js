// Variables
const map = document.querySelector("#map");
const btn = document.querySelector(".btn");
const bestScore = document.querySelector("#bestScore");
const currentScore = document.querySelector("#currentScore");
const messageDefeat = document.querySelector(".messageDefeat");
const number = document.querySelector(".number");
const controls = document.querySelector(".controls");
let snake = [138, 139];
let apple;
let setInt;
let left;
let right;
let t0p;
let bottom;
const marginsTopNBot = [];
const marginLeft = [];
const marginRight = [];
let score;
let level = 0;
let direction = 1;

// Eventos
document.addEventListener("DOMContentLoaded", createMap);
btn.addEventListener("click", game);

// Funcion para crear mapa del juego
function createMap() {
  let accountant = 0;
  while (accountant <= 288) {
    const square = document.createElement("div");
    if (accountant % 2 === 0) {
      square.classList.add("lightGreen");
    } else {
      square.classList.add("darkGreen");
    }
    square.classList.add("square", `${accountant}`);
    map.appendChild(square);
    accountant++;
  }
  squares = document.querySelectorAll(".square");
  messageDefeat.style.display = "none";
  marginsDefine();
  insertApple();
  printScores();
  printSnake();
}

// Funcion para la ejecucion del juego
function game(e) {
  e.preventDefault();

  messageDefeat.style.display = "none";
  btn.removeEventListener("click", game);
  btn.addEventListener("click", reset);
  btn.textContent = "Reset";
  btn.classList.add("btnReset");
  moveDirection(1);
}

// Funcion de reset
function reset() {
  messageDefeat.style.display = "flex";
  number.textContent = level;
  clearIntervals();
  compareScore();
  printScores();
  document.removeEventListener("keyup", move);
  map.removeEventListener("click", move);
  btn.removeEventListener("click", reset);
  btn.addEventListener("click", game);
  btn.textContent = "Start";
  btn.classList.remove("btnReset");
  snake = [138, 139];
  level = 0;
  direction = 1;
  printSnake();
}

// Funcion para el movimiento con flechas del teclado
function move(tecla) {
  document.removeEventListener("keyup", move);
  controls.removeEventListener("click", move);
  if (
    tecla.code == "ArrowUp" ||
    tecla.target.classList.contains("fa-arrow-circle-up")
  ) {
    moveDirection(-17);
  } else if (
    tecla.code == "ArrowDown" ||
    tecla.target.classList.contains("fa-arrow-circle-down")
  ) {
    moveDirection(17);
  } else if (
    tecla.code == "ArrowLeft" ||
    tecla.target.classList.contains("fa-arrow-circle-left")
  ) {
    moveDirection(-1);
  } else if (
    tecla.code == "ArrowRight" ||
    tecla.target.classList.contains("fa-arrow-circle-right")
  ) {
    moveDirection(1);
  }
}

// Funcion para direccionar la snake
function moveDirection(n) {
  if (n === -direction) {
    return (
      document.addEventListener("keyup", move) &&
      controls.addEventListener("click", move)
    );
  } else {
    clearIntervals();
    direction = n;
    setInt = setInterval(() => {
      snake.push(snake[snake.length - 1] + n);
      if (defeat()) {
        reset();
      } else {
        // Verificamos que la snake no se coma a si misma
        if (snake.some((p) => p === snake[snake.length - 1] + n)) {
          reset();
        }
        snake.shift();
        eatApple();
        printSnake();
        document.addEventListener("keyup", move);
        controls.addEventListener("click", move);
        moveDirection(n);
      }
    }, 150);
  }
}

// Funcion para eliminar el setInterval
function clearIntervals() {
  clearInterval(setInt);
}

// Funcion para imprimir el cuerpo de la snake
function printSnake() {
  clearMap();
  snake.forEach((p) => {
    squares[p].classList.add("lightBlue");
  });
}

// Funcion para borrar el cuerpo de la snake
function clearMap() {
  squares.forEach((square) => {
    square.classList.remove("lightBlue");
    square.classList.remove("darkBlue");
  });
}

// Funcion para insertar la manzana en el mapa
function insertApple() {
  apple = Math.round(Math.random() * 288);
  while (snake.some((p) => p === apple)) {
    apple = Math.round(Math.random() * 288);
  }
  squares[apple].classList.add("apple");
}

// Funcion para comer las manzanas y hacer crecer la snake
function eatApple() {
  if (snake[snake.length - 1] === apple) {
    squares[apple].classList.remove("apple");
    snake.push(apple);
    insertApple();
    level++;
    currentScore.textContent = level;
  }
}

// Funcion para definir los margenes de derrota
function marginsDefine() {
  for (let i = -17; i < 0; i++) {
    t0p = i;
    marginsTopNBot.push(t0p);
  }
  for (let i = 305; i > 288; i--) {
    bottom = i;
    marginsTopNBot.push(bottom);
  }
  for (let i = 0; i < 18; i++) {
    left = i * 17;
    right = i * 17 - 1;
    marginLeft.push(left);
    marginRight.push(right);
  }
}

// Funcion para chekear si nos salimos de los margenes
function defeat() {
  let lastArray = snake[snake.length - 1];
  let beforeLastArray = snake[snake.length - 2];
  if (
    marginsTopNBot.some((p) => p === lastArray) ||
    (marginLeft.some((l) => l === beforeLastArray) &&
      marginRight.some((r) => r === lastArray)) ||
    (marginLeft.some((l) => l === snake[snake.length - 1]) &&
      marginRight.some((r) => r === beforeLastArray))
  ) {
    return true;
  }
}

// Funcion para comparar los puntajes
function compareScore() {
  if (localStorage.getItem("bestScore") !== 0) {
    if (level > localStorage.getItem("bestScore")) {
      localStorage.setItem("bestScore", level);
    }
  }
}

// Funcion para imprimir los puntajes
function printScores() {
  if (localStorage.getItem("bestScore")) {
    bestScore.textContent = localStorage.getItem("bestScore");
  } else {
    bestScore.textContent = 0;
  }
  currentScore.textContent = 0;
}
