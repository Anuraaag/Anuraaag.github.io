const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
let bird;

let player = {
    difficulty_level: 0.5,
    gravity: 0.25,
    speed: 1,
    score: 0,
};

const keys = {
    "ArrowLeft": false,
    "ArrowRight": false,
    "ArrowDown": false,
    "ArrowUp": false
};

let endGame = () => {
    player.start = false;
    score.innerText = `Game Over! You scored ${parseInt(player.score)}`;
    startScreen.classList.remove('hide');

    bird.style.animation = 'none';
    bird.innerText = `x_x`;
};

let increaseLevel = () => {
    player.difficulty_level += 0.025;
    player.gravity += 0.015;
    player.speed += 0.04;
}

let moveBird = () => {

    if (player.start && player.paused == false) {
        if (keys.ArrowDown && player.y < (gameAreaHeight - (1.4 * bird.getBoundingClientRect().height))) player.y += player.speed;
        if (keys.ArrowUp && player.y > 0) player.y -= (player.speed + 0.25);
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < (gameAreaWidth - bird.getBoundingClientRect().width)) player.x += player.speed;

        bird.style.left = `${player.x}px`;
        bird.style.top = `${player.y}px`;

        window.requestAnimationFrame(moveBird);
    }
}

let moveObstacles = () => {

    let bird_spot = bird.getBoundingClientRect();

    if (player.y < (gameAreaHeight - (1.4 * bird.getBoundingClientRect().height))) {
        player.y += player.gravity;
        bird.style.top = `${player.y}px`;
    }

    if (player.start && player.paused == false) {

        let obstacles = Array.from(document.querySelectorAll(".obstacle"));
        length = obstacles.length;

        for (let index = 0; index < length; index += 2) {
            if (obstacles[index].x < -obstacles[index].offsetWidth) {

                /* moving the up and down obstacle */
                obstacles[index].x = gameArea.getBoundingClientRect().width;
                // obstacles[index+1].x = gameArea.getBoundingClientRect().width //not required

                /* updating height and position of up and down obstacle */
                obstacles[index].style.height = `${Math.floor(Math.random() * (gameAreaHeight - 100))}px`;
                obstacles[index].y = 0;
                obstacles[index].style.top = `${obstacles[index].y}px`;

                obstacles[index + 1].style.height = `${Math.floor(Math.random() * (gameAreaHeight - obstacles[index].getBoundingClientRect().height - 100))}px`;
                obstacles[index + 1].y = gameAreaHeight - obstacles[index + 1].getBoundingClientRect().height; /* No need for regex as obstacle already part of dom */
                obstacles[index + 1].style.top = `${obstacles[index + 1].y}px`;
            }
            obstacles[index].x -= player.difficulty_level;
            // obstacles[index+1].x -= player.difficulty_level // not required

            obstacles[index].style.left = `${obstacles[index].x}px`;
            obstacles[index + 1].style.left = `${obstacles[index].x}px`;


            up_rect = obstacles[index].getBoundingClientRect();
            down_rect = obstacles[index + 1].getBoundingClientRect();

            if ((up_rect.right > bird_spot.left && up_rect.left < bird_spot.right) && ((up_rect.bottom > bird_spot.top &&
                up_rect.top < bird_spot.bottom) || (down_rect.bottom > bird_spot.top && down_rect.top < bird_spot.bottom))) {
                obstacles[index].classList.add('hit');
                obstacles[index + 1].classList.add('hit');
                return endGame();
            }
        }

        player.score += 0.2;
        score.innerText = `Score: ${parseInt(player.score)}`;

        if (player.score >= 2000 && parseInt(player.score) % 700 == 0) {
            increaseLevel();
        }

        window.requestAnimationFrame(moveObstacles);
    }
}

const start = () => {
    startScreen.classList.add('hide');
    gameArea.classList.remove('hide');
    gameArea.innerHTML = ""; /* to remove any previous stuff */

    score.classList.remove('hide');

    player.start = true;
    player.paused = false;
    player.score = 0;

    gameAreaRectangle = gameArea.getBoundingClientRect();
    gameAreaHeight = gameAreaRectangle.height;
    gameAreaWidth = gameAreaRectangle.width;

    let bird_element = document.createElement('div');
    bird_element.classList.add('bird');
    bird_element.style.top = `${gameAreaHeight / 2}px`;
    bird_element.innerText = ` : )`;

    gameArea.appendChild(bird_element);

    bird = bird_element; /*no need of document.querySelector(".bird") */

    player.x = bird_element.offsetLeft;
    player.y = bird_element.offsetTop;

    window.requestAnimationFrame(moveBird);


    /* Rectangular obstacles creation */
    const obstacleCount = Math.floor(gameAreaWidth / 130);
    for (let count = 0; count < obstacleCount; count++) {
        let obstacle1 = document.createElement('div');
        obstacle1.classList.add('obstacle');
        obstacle1.style.height = (count < 2) ? `${gameAreaHeight / 4}px` : `${Math.floor(Math.random() * (gameAreaHeight - 100))}px`;

        obstacle1.y = 0;
        obstacle1.style.top = `${obstacle1.y}px`;
        obstacle1.x = (count * 130) + 100;
        obstacle1.style.left = `${obstacle1.x}px`;
        gameArea.appendChild(obstacle1);


        let obstacle2 = document.createElement('div');
        obstacle2.classList.add('obstacle');
        obstacle2.style.height = (count < 2) ? `${gameAreaHeight / 4}px` : `${Math.floor(Math.random() * (gameAreaHeight - 100 - obstacle1.getBoundingClientRect().height))}px`;


        // obstacle2.y = obstacle2.getBoundingClientRect().height                                  /* Can't use because it's not part of the dom yet */
        // obstacle2.y = gameAreaHeight - parseInt( obstacle2.style.height.replace(/\D/g, ''))  /* can't use coz need '-' and '.' too */
        obstacle2.y = gameAreaHeight - parseInt(obstacle2.style.height.slice(0, -2));

        obstacle2.style.top = `${obstacle2.y}px`;
        obstacle2.x = (count * 130) + 100;
        obstacle2.style.left = `${obstacle2.x}px`;
        gameArea.appendChild(obstacle2);
    }

    window.requestAnimationFrame(moveObstacles);
}

document.addEventListener("keydown", event => {
    event.preventDefault();
    keys[event.key] = true;
})

document.addEventListener("keyup", event => {
    event.preventDefault();
    keys[event.key] = false;
})

document.addEventListener("keydown", event => {
    event.preventDefault();
    if (event.key == 'p') {
        player.paused = true;
    }
    if (event.key == 'r') {
        player.paused = false;
        window.requestAnimationFrame(moveBird);
        window.requestAnimationFrame(moveObstacles);
    }
})

startScreen.addEventListener("click", start);