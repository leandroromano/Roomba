/**
 * La entrada del sistema, en este caso definida a escala px:cm
 */
const DISTANCIA_REFERENCIAL = 20
let roomba;
let obstacles = [];
const speedX = 2;
const speedY = 2;
const speed = Math.sqrt(speedX * speedX + speedY * speedY);
const directions = [
    TOP = {
        name: 'top',
        x: 0,
        y: -speed
    },
    TOPRIGHT = {
        name: 'topRight',
        x: speedX,
        y: -speedY
    },
    RIGHT = {
        name: 'right',
        x: speed,
        y: 0
    },
    BOTTOMRIGHT = {
        name: 'bottomRight',
        x: speedX,
        y: speedY
    },
    BOTTOM = {
        name: 'bottom',
        x: 0,
        y: speed
    },
    BOTTOMLEFT = {
        name: 'bottomLeft',
        x: -speedX,
        y: speedY
    },
    LEFT = {
        name: 'left',
        x: -speed,
        y: 0
    },
    TOPLEFT = {
        name: 'topLeft',
        x: -speedX,
        y: -speedY
    }
]


function setup() {

    const firstPossibleMoves = directions.filter(direction => direction.name === 'top' || direction.name === 'right'
        || direction.name === 'bottom' || direction.name === 'left');
    const firstRandomMove = random(firstPossibleMoves);
    const height = 600;
    const width = 600;
    createCanvas(width, height);

    fill(200)
    const vacuumX = 300;
    const vacuumY = 300;
    roomba = new Roomba(vacuumX, vacuumY, firstRandomMove.x, firstRandomMove.y, 30);

    obstacles.push(new Obstacle(0, 0, this.height, 20));
    obstacles.push(new Obstacle(0, 0, 20, this.width));
    obstacles.push(new Obstacle(this.width - 20, 0, 20, this.height));
    obstacles.push(new Obstacle(0, this.height - 20, this.width, 20));

    let i = 4;
    while (obstacles.length < 7) {
        const newObstacleX = random(width);
        const newObstacleY = random(height);
        const newObstacleHeight = random(100) + 50;
        const newObstacleWidht = random(100) + 50
        if (!obstacles.some((obstacle) => obstacle.isOverlapping(newObstacleX, newObstacleY, newObstacleHeight, newObstacleWidht))
            && !collideRectCircle(newObstacleX, newObstacleY, newObstacleHeight, newObstacleWidht, roomba.x, roomba.y, roomba.radius + 100)) {
            obstacles[i] = new Obstacle(newObstacleX, newObstacleY, newObstacleHeight, newObstacleWidht);
            i++;
        }
    }
}

function draw() {
    background(100);
    roomba.move();
    roomba.display();
    obstacles.forEach(o => {
        o.display();
        if (o.isColliding(roomba.x, roomba.y, roomba.radius)) {
            roomba.avoid();
        }
    });
}


class Roomba {
    history = [];
    batteryLife = 500;

    constructor(initialX, initialY, initialSpeedX, initialSpeedY, radius) {
        this.x = initialX;
        this.y = initialY;
        this.speedX = Math.cos(initialSpeedX) * speedX;
        this.speedY = Math.sin(initialSpeedY) * speedY;
        this.radius = radius;
    }

    display() {
        // this.getTrail();
        fill(30);
        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.radius * 2);
    }

    move() {
        if (this.batteryLife > 0) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.batteryLife -= 0.005;
        } else {
            this.x += 0;
            this.y += 0;
        }
    }


    avoid() {
        do {
            const newDegree = random(180, 360)
            this.speedX = Math.cos(newDegree) * 2
            this.speedY = Math.sin(newDegree) * 2
        } while (obstacles.some(o => o.isColliding(roomba.x + this.speedX, roomba.y + this.speedY, roomba.radius)))
    }

    getDirection() {
        return directions.find(direction => this.speedX === direction.x && this.speedY === direction.y);
    }

    getOpositeDirection() {
        return directions.find(direction => direction.x === -this.speedX && direction.y === -this.speedY);
    }

    getTrail() {
        const v = createVector(this.x, this.y);
        this.history.push(v);
        for (let i = 0; i < this.history.length; i++) {
            let pos = this.history[i];
            ellipse(pos.x, pos.y, this.radius * 0.1);
        }
    }
}


class Obstacle {
    constructor(initialX, initialY, height, width) {
        this.x = initialX;
        this.y = initialY;
        this.height = height;
        this.width = width;
    }

    display() {
        fill(50);
        rectMode(CORNER);
        rect(this.x, this.y, this.height, this.width);
    }


    isColliding(cx, cy, rad) {
        return collideRectCircle(this.x, this.y, this.height, this.width, cx, cy, rad * 2 + DISTANCIA_REFERENCIAL);
    }

    isOverlapping(newX, newY, newHeight, newWidht) {
        const collided = collideRectRect(this.x, this.y, this.height, this.width, newX, newY, newHeight, newWidht);
        return collided;
    }
}
