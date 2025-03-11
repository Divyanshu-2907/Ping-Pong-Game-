

const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "snow";
const paddle1Color = "lightblue";
const paddle2Color = "yellow";
const paddleBorder = "black";
const ballColor = "red";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50;
const aiSpeed = 4;

let ballSpeed;
let ballX;
let ballY;
let ballXDirection;
let ballYDirection;
let player1Score = 0;
let player2Score = 0;
let paddle1 = { width: 25, height: 100, x: 0, y: 0 };
let paddle2 = { width: 25, height: 100, x: gameWidth - 25, y: gameHeight - 100 };

const hitSound = new Audio("hit.mp3");
const scoreSound = new Audio("score.mp3");

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
gameStart();

function gameStart() {
    createBall();
    requestAnimationFrame(nextTick);
}

function nextTick() {
    clearBoard();
    drawPaddles();
    moveBall();
    moveAI();
    drawBall(ballX, ballY);
    checkCollision();
    requestAnimationFrame(nextTick);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawPaddles() {
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeStyle = paddleBorder;
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
    ballSpeed = 2;
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXDirection = Math.random() < 0.5 ? 1 : -1;
    ballYDirection = Math.random() * 2 - 1;
    drawBall(ballX, ballY);
}

function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

function drawBall(ballX, ballY) {
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = ballBorderColor;
    ctx.stroke();
}

function checkCollision() {
    if (ballY <= 0 + ballRadius || ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }
    if (ballX <= 0) {
        player2Score++;
        updateScore();
        createBall();
        scoreSound.play();
    }
    if (ballX >= gameWidth) {
        player1Score++;
        updateScore();
        createBall();
        scoreSound.play();
    }
    if (ballX <= paddle1.x + paddle1.width && ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
        ballXDirection *= -1;
        ballSpeed += 0.5;
        hitSound.play();
    }
    if (ballX >= paddle2.x - ballRadius && ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
        ballXDirection *= -1;
        ballSpeed += 0.5;
        hitSound.play();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 38 && paddle1.y > 0) paddle1.y -= paddleSpeed;
    if (keyPressed === 40 && paddle1.y < gameHeight - paddle1.height) paddle1.y += paddleSpeed;
    if (keyPressed === 87 && paddle2.y > 0) paddle2.y -= paddleSpeed;
    if (keyPressed === 83 && paddle2.y < gameHeight - paddle2.height) paddle2.y += paddleSpeed;
}

function moveAI() {
    if (paddle2.y + paddle2.height / 2 < ballY) paddle2.y += aiSpeed;
    else paddle2.y -= aiSpeed;
}

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    paddle1.y = 0;
    paddle2.y = gameHeight - 100;
    createBall();
    updateScore();
}
