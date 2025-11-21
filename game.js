document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('game-grid');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const restartBtn = document.getElementById('restart-btn');
    const modal = document.getElementById('game-over-modal');
    const modalTitle = document.getElementById('modal-title');
    const finalScoreDisplay = document.getElementById('final-score');

    // Game Constants
    const width = 28;
    const height = 31;
    const speed = 200; // ms per tick for Pacman
    const ghostSpeed = 250; // ms per tick for Ghosts

    // 0: empty, 1: wall, 2: pellet, 3: power-pellet, 4: ghost-lair
    const layout = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1,
        1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1,
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1,
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
        1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1,
        1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1,
        1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 4, 4, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1,
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1,
        1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 3, 1,
        1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1,
        1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1,
        1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1,
        1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1,
        1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1,
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ];

    const squares = [];
    let score = 0;
    let pacmanCurrentIndex = 490;
    let pacmanVelocity = { x: 0, y: 0 };
    let nextDirection = { x: 0, y: 0 };
    let gameInterval;
    let ghostInterval;
    let isGameOver = false;

    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.timerId = NaN;
            this.isScared = false;
            this.direction = 1; // 1: right, -1: left, width: down, -width: up
        }
    }

    const ghosts = [
        new Ghost('red', 348, 250),
        new Ghost('cyan', 376, 400),
        new Ghost('pink', 351, 300),
        new Ghost('orange', 379, 500)
    ];

    // Create Board
    function createBoard() {
        grid.style.gridTemplateColumns = `repeat(${width}, 20px)`;
        grid.style.gridTemplateRows = `repeat(${height}, 20px)`;
        grid.innerHTML = '';
        squares.length = 0;

        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');
            square.classList.add('cell');
            grid.appendChild(square);
            squares.push(square);

            if (layout[i] === 1) {
                square.classList.add('wall');
            } else if (layout[i] === 2) {
                const pellet = document.createElement('div');
                pellet.classList.add('pellet');
                square.appendChild(pellet);
            } else if (layout[i] === 3) {
                const powerPellet = document.createElement('div');
                powerPellet.classList.add('power-pellet');
                square.appendChild(powerPellet);
            }
        }

        squares[pacmanCurrentIndex].classList.add('pacman');

        // Add Ghosts
        ghosts.forEach(ghost => {
            squares[ghost.currentIndex].classList.add('ghost', ghost.className);
        });
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        if (isGameOver) return;
        switch (e.key) {
            case 'ArrowUp': nextDirection = { x: 0, y: -width }; break;
            case 'ArrowDown': nextDirection = { x: 0, y: width }; break;
            case 'ArrowLeft': nextDirection = { x: -1, y: 0 }; break;
            case 'ArrowRight': nextDirection = { x: 1, y: 0 }; break;
        }
    });

    function movePacman() {
        const nextIndex = pacmanCurrentIndex + nextDirection.x + nextDirection.y;

        // Check if next direction is valid
        if (nextDirection.x !== 0 || nextDirection.y !== 0) {
            if (!squares[nextIndex].classList.contains('wall') && !squares[nextIndex].classList.contains('ghost-lair')) {
                pacmanVelocity = nextDirection;
            }
        }

        const targetIndex = pacmanCurrentIndex + pacmanVelocity.x + pacmanVelocity.y;

        if (squares[targetIndex].classList.contains('wall') || squares[targetIndex].classList.contains('ghost-lair')) {
            return;
        }

        squares[pacmanCurrentIndex].classList.remove('pacman');
        pacmanCurrentIndex = targetIndex;

        // Portals
        if (pacmanCurrentIndex === 392) pacmanCurrentIndex = 419;
        else if (pacmanCurrentIndex === 419) pacmanCurrentIndex = 392;

        squares[pacmanCurrentIndex].classList.add('pacman');

        // Eating
        if (squares[pacmanCurrentIndex].querySelector('.pellet')) {
            squares[pacmanCurrentIndex].querySelector('.pellet').remove();
            score += 10;
            scoreDisplay.innerHTML = score;
        }

        if (squares[pacmanCurrentIndex].querySelector('.power-pellet')) {
            squares[pacmanCurrentIndex].querySelector('.power-pellet').remove();
            score += 50;
            scoreDisplay.innerHTML = score;
            scareGhosts();
        }

        checkCollision();
        checkWin();
    }

    function moveGhost(ghost) {
        const directions = [-1, 1, width, -width];
        let direction = ghost.direction;

        // Simple AI: Try to keep moving, if hit wall, pick random valid new direction
        let nextIndex = ghost.currentIndex + direction;

        if (squares[nextIndex].classList.contains('wall') || squares[nextIndex].classList.contains('ghost')) {
            direction = directions[Math.floor(Math.random() * directions.length)];
            nextIndex = ghost.currentIndex + direction;
        }

        // If still stuck, try all until one works
        if (squares[nextIndex].classList.contains('wall') || squares[nextIndex].classList.contains('ghost')) {
            const validMoves = directions.filter(d =>
                !squares[ghost.currentIndex + d].classList.contains('wall') &&
                !squares[ghost.currentIndex + d].classList.contains('ghost')
            );
            if (validMoves.length > 0) {
                direction = validMoves[Math.floor(Math.random() * validMoves.length)];
                nextIndex = ghost.currentIndex + direction;
            } else {
                return; // Stuck
            }
        }

        ghost.direction = direction;

        squares[ghost.currentIndex].classList.remove('ghost', ghost.className, 'scared');
        ghost.currentIndex = nextIndex;

        // Portals for ghosts
        if (ghost.currentIndex === 392) ghost.currentIndex = 419;
        else if (ghost.currentIndex === 419) ghost.currentIndex = 392;

        squares[ghost.currentIndex].classList.add('ghost', ghost.className);
        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.add('scared');
        }

        checkCollision();
    }

    function scareGhosts() {
        ghosts.forEach(ghost => ghost.isScared = true);
        setTimeout(() => {
            ghosts.forEach(ghost => {
                ghost.isScared = false;
                if (squares[ghost.currentIndex]) // Safety check
                    squares[ghost.currentIndex].classList.remove('scared');
            });
        }, 10000);
    }

    function checkCollision() {
        const hitGhost = ghosts.find(ghost => ghost.currentIndex === pacmanCurrentIndex);
        if (hitGhost) {
            if (hitGhost.isScared) {
                squares[hitGhost.currentIndex].classList.remove('ghost', hitGhost.className, 'scared');
                hitGhost.currentIndex = hitGhost.startIndex;
                hitGhost.isScared = false;
                score += 100;
                scoreDisplay.innerHTML = score;
                squares[hitGhost.currentIndex].classList.add('ghost', hitGhost.className);
            } else {
                gameOver(false);
            }
        }
    }

    function checkWin() {
        if (document.querySelectorAll('.pellet').length === 0 && document.querySelectorAll('.power-pellet').length === 0) {
            gameOver(true);
        }
    }

    function gameOver(win) {
        isGameOver = true;
        clearInterval(gameInterval);
        ghosts.forEach(ghost => clearInterval(ghost.timerId));

        modal.classList.remove('hidden');
        modalTitle.innerText = win ? "YOU WIN!" : "GAME OVER";
        finalScoreDisplay.innerText = score;
    }

    function startGame() {
        if (gameInterval) clearInterval(gameInterval);
        ghosts.forEach(ghost => clearInterval(ghost.timerId));

        isGameOver = false;
        score = 0;
        scoreDisplay.innerText = 0;
        modal.classList.add('hidden');

        createBoard();

        pacmanCurrentIndex = 490;
        pacmanVelocity = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };

        gameInterval = setInterval(movePacman, speed);

        ghosts.forEach(ghost => {
            ghost.currentIndex = ghost.startIndex;
            ghost.isScared = false;
            ghost.timerId = setInterval(() => moveGhost(ghost), ghost.speed);
        });
    }

    restartBtn.addEventListener('click', startGame);
    createBoard();
    startGame();
});
