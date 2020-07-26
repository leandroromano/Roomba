let roomba;
let obstacles = [];
//TODO: Deberia ser una sola speed, y que esa misma se use tanto en x como en y
const speedX = 1;
const speedY = 1;
const directions = [
    TOP = {
        name: 'top',
        x: 0,
        y: -speedY
    },
    TOPRIGHT = {
        name: 'topRight',
        x: speedX,
        y: -speedY
    },
    RIGHT = {
        name: 'right',
        x: speedX,
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
        y: speedY
    },
    BOTTOMLEFT = {
        name: 'bottomLeft',
        x: -speedX,
        y: speedY
    },
    LEFT = {
        name: 'left',
        x: -speedX,
        y: 0
    },
    TOPLEFT = {
        name: 'topLeft',
        x: -speedX,
        y: -speedY
    }
]


function setup() {

    const height = 600;
    const width = 600;
    createCanvas(width, height);

    fill(200)
    const vacuumX = 300;
    const vacuumY = 300;
    roomba = new Roomba(vacuumX, vacuumY, random(directions).x, random(directions).y, 30);

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
            && !collideRectCircle(newObstacleX, newObstacleY, newObstacleHeight, newObstacleWidht, roomba.x, roomba.y, roomba.radius + 20)) {
            obstacles[i] = new Obstacle(newObstacleX, newObstacleY, newObstacleHeight, newObstacleWidht);
            i++;
        }
    }
}

function draw() {
    background(51);
    roomba.move();
    roomba.display();
    obstacles.forEach(o => {
        o.display();
        if (o.isColliding(roomba.x, roomba.y, roomba.radius)) {
            console.log("Venia pisteando como un campeon");
            roomba.avoid();
        }
    });
}


class Roomba {
    history = [];

    constructor(initialX, initialY, initialSpeedX, initialSpeedY, radius) {
        this.x = initialX;
        this.y = initialY;
        this.speedX = initialSpeedX;
        this.speedY = initialSpeedY;
        this.radius = radius;
    }

    display() {
        //this.getTrail();
        fill(200);
        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.radius * 2);
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }


    avoid() {
        const opositeDirection = this.getOpositeDirection();
        //Me quedo con los posibles movimientos sin colisionar
        let possibleMoves = directions.filter(direction =>
            obstacles.every(obstacle =>
                !obstacle.isColliding(this.x + direction.x, this.y + direction.y, this.radius)
            )
        );
        //Si hay mas de un movimiento, elimino el opuesto
        if (possibleMoves.length > 1) {
            possibleMoves = possibleMoves.filter(direction => direction != opositeDirection);
        }

        this.speedX = random(possibleMoves).x;
        this.speedY = random(possibleMoves).y;
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
            ellipse(pos.x, pos.y, this.radius * 2);
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
        fill(100);
        rectMode(CORNER);
        rect(this.x, this.y, this.height, this.width);
    }


    isColliding(cx, cy, rad) {
        return collideRectCircle(this.x, this.y, this.height, this.width, cx, cy, rad * 2);
    }

    isOverlapping(newX, newY, newHeight, newWidht) {
        return collideRectRect(this.x, this.y, this.height, this.width, newX, newY, newHeight, newWidht);
    }
}
