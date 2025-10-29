```javascript

// --- 게임 요소 가져오기 ---

const gameContainer = document.getElementById('game-container');

const gameBoard = document.getElementById('game-board');

const player = document.getElementById('player');

// ... (이전과 동일한 요소들)

const scoreDisplay = document.getElementById('score');

const gameOverScreen = document.getElementById('game-over-screen');

const finalScoreDisplay = document.getElementById('final-score');

const restartButton = document.getElementById('restart-button');

const canvas = document.getElementById('fireworks-canvas');

const ctx = canvas.getContext('2d');

// 모바일 버튼 추가

const leftBtn = document.getElementById('left-btn');

const rightBtn = document.getElementById('right-btn');



// --- 게임 변수 설정 ---

// 플레이어 시작 위치를 화면 중앙으로 설정

let playerPosition = gameBoard.offsetWidth / 2 - 25;

let score = 0;

let gameOver = false;

let obstacleSpeed = 3;

let obstacleCreationInterval;

let speedIncreaseInterval;

let moveInterval = null; // 플레이어 이동 인터벌


// --- 플레이어 이동 (PC 키보드) ---

document.addEventListener('keydown', (e) => {

    if (gameOver) return;

    if (e.key === 'ArrowLeft') movePlayer('left');

    if (e.key === 'ArrowRight') movePlayer('right');

});


// --- 플레이어 이동 (모바일 터치) ---

function startMoving(direction) {

    if (moveInterval) return; // 이미 움직이는 중이면 중복 실행 방지

    moveInterval = setInterval(() => movePlayer(direction), 50);

}


function stopMoving() {

    clearInterval(moveInterval);

    moveInterval = null;

}


// 왼쪽 버튼 이벤트 (터치와 마우스 클릭 모두 지원)

leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startMoving('left'); });

leftBtn.addEventListener('mousedown', (e) => { e.preventDefault(); startMoving('left'); });

leftBtn.addEventListener('touchend', stopMoving);

leftBtn.addEventListener('mouseup', stopMoving);

leftBtn.addEventListener('mouseleave', stopMoving); // 버튼 밖으로 나가도 멈춤


// 오른쪽 버튼 이벤트

rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startMoving('right'); });

rightBtn.addEventListener('mousedown', (e) => { e.preventDefault(); startMoving('right'); });

rightBtn.addEventListener('touchend', stopMoving);

rightBtn.addEventListener('mouseup', stopMoving);

rightBtn.addEventListener('mouseleave', stopMoving);


// 플레이어 위치 업데이트 함수

function movePlayer(direction) {

    const boardWidth = gameBoard.offsetWidth;

    const playerWidth = player.offsetWidth;


    if (direction === 'left' && playerPosition > 0) {

        playerPosition -= 10;

    }

    if (direction === 'right' && playerPosition < (boardWidth - playerWidth)) {

        playerPosition += 10;

    }

    player.style.left = playerPosition + 'px';

}


// --- 장애물 생성 ---

function createObstacle() {

    // ... (이전 코드와 동일)

    const obstacle = document.createElement('div');

    obstacle.classList.add('obstacle');

    const size = Math.random() * 30 + 20;

    obstacle.style.width = size + 'px';

    obstacle.style.height = size + 'px';

    obstacle.style.left = Math.floor(Math.random() * (gameBoard.offsetWidth - size)) + 'px';

    obstacle.style.top = '0px';

    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502'];

    obstacle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    if (Math.random() > 0.5) {

        obstacle.style.borderRadius = '50%';

    }

    gameBoard.appendChild(obstacle);

    moveObstacle(obstacle);

}


// --- 나머지 게임 로직 (moveObstacle, startGame, endGame 등) ---

// 이전 코드와 대부분 동일하며, 폭죽 캔버스 크기만 반응형으로 맞춰줍니다.


// --- 게임 오버 처리 ---

function endGame() {

    gameOver = true;

    clearInterval(obstacleCreationInterval);

    clearInterval(speedIncreaseInterval);

    stopMoving(); // 게임 오버 시 플레이어 움직임 정지

    finalScoreDisplay.textContent = score;

    gameOverScreen.style.display = 'flex';

    launchFireworks();

}


// ... 폭죽 애니메이션 코드 (이전과 동일) ...

// (Firework, Particle 클래스 등)

canvas.width = gameContainer.offsetWidth;

canvas.height = 500;

let fireworks = [];

// ... (이하 동일) ...

function launchFireworks() {

    for (let i = 0; i < 5; i++) {

        fireworks.push(new Firework());

    }

    animateFireworks();

}


function animateFireworks() {

    if(!gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {

        if (firework.done) {

            fireworks.splice(index, 1);

        } else {

            firework.update();

            firework.draw();

        }

    });

    if (fireworks.length < 5 && Math.random() < 0.05) {

        fireworks.push(new Firework());

    }

    requestAnimationFrame(animateFireworks);

}


class Firework { /* ... 이전과 동일 ... */ 

    constructor() {

        this.x = Math.random() * canvas.width;

        this.y = canvas.height;

        this.sx = Math.random() * 3 - 1.5;

        this.sy = Math.random() * -3 - 3;

        this.size = Math.random() * 2 + 1;

        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        this.particles = [];

        this.exploded = false;

        this.done = false;

    }

    update() {

        if (!this.exploded) {

            this.x += this.sx;

            this.y += this.sy;

            this.sy += 0.05; // gravity

            if (this.sy >= 0) {

                this.exploded = true;

                for (let i = 0; i < 50; i++) {

                    this.particles.push(new Particle(this.x, this.y, this.color));

                }

            }

        } else {

            this.particles.forEach(p => p.update());

            if(this.particles[0] && this.particles[0].alpha <= 0){

                this.done = true;

            }

        }

    }

    draw() {

        if (!this.exploded) {

            ctx.fillStyle = this.color;

            ctx.beginPath();

            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            ctx.fill();

        } else {

            this.particles.forEach(p => p.draw());

        }

    }

}

class Particle { /* ... 이전과 동일 ... */

    constructor(x, y, color) {

        this.x = x;

        this.y = y;

        this.angle = Math.random() * Math.PI * 2;

        this.speed = Math.random() * 4 + 1;

        this.friction = 0.95;

        this.gravity = 0.5;

        this.alpha = 1;

        this.decay = Math.random() * 0.02 + 0.01;

        this.color = color;

    }

    update() {

        this.speed *= this.friction;

        this.x += Math.cos(this.angle) * this.speed;

        this.y += Math.sin(this.angle) * this.speed + this.gravity;

        this.alpha -= this.decay;

    }

    draw() {

        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);

        ctx.fill();

        ctx.restore();

    }

}



// --- 게임 시작/재시작 ---

restartButton.addEventListener('click', () => location.reload());


function startGame() {

    obstacleCreationInterval = setInterval(createObstacle, 1500);

    speedIncreaseInterval = setInterval(() => {

        obstacleSpeed += 0.5;

    }, 5000);

}

function moveObstacle(obstacle) {

    let obstaclePosition = 0;

    const obstacleInterval = setInterval(() => {

        if (gameOver) {

            clearInterval(obstacleInterval);

            return;

        }

        if (obstaclePosition > 500) {

            obstacle.remove();

            clearInterval(obstacleInterval);

            score += Math.floor(obstacleSpeed);

            scoreDisplay.textContent = score;

        } else {

            obstaclePosition += obstacleSpeed;

            obstacle.style.top = obstaclePosition + 'px';

            const playerRect = player.getBoundingClientRect();

            const obstacleRect = obstacle.getBoundingClientRect();

            if (

                playerRect.left < obstacleRect.right &&

                playerRect.right > obstacleRect.left &&

                playerRect.top < obstacleRect.bottom &&

                playerRect.bottom > obstacleRect.top

            ) {

                endGame();

                clearInterval(obstacleInterval);

            }

        }

    }, 20);

}

startGame();

```
