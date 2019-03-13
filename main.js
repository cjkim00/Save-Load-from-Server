
// GameBoard code below
var gravityConstant = 0.01;
var autoPlay = false;
var game;
var io2 = false;
var mainCircle;
var friction = 0;
var entSize = 0;
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.game = game;
    this.mass = 100;
    this.radius = 20;
    this.visualRadius = 500;

    this.colors = ["Red", "Green", "Blue", "White", "Yellow", "Orange", "Purple"];
    this.color = Math.floor(Math.random() * 6);

    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    var speed = this.speed;
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    //this.color = 4;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    //this.color = 4;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
    //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        var dist = distance(this, ent);
        var force = gravityConstant * ((this.mass * ent.mass) / (dist * dist));
        if (!io2) {
            if (isFinite(force) && this.color == ent.color) {

                var tempX = this.x - ent.x;
                var tempY = this.y - ent.y;
                if (tempX <= 0 && tempY <= 0) {
                    this.x += force;
                    this.y += force;
                    ent.x -= force;
                    ent.y -= force;
                } else if (tempX <= 0 && tempY >= 0) {
                    this.x += force;
                    this.y -= force;
                    ent.x -= force;
                    ent.y += force;
                } else if (tempX >= 0 && tempY <= 0) {
                    this.x -= force;
                    this.y += force;
                    ent.x += force;
                    ent.y -= force;
                } else if (tempX >= 0 && tempY >= 0) {
                    this.x -= force;
                    this.y -= force;
                    ent.x += force;
                    ent.y += force;
                }
            }
        }
        if (ent !== this && this.collide(ent)) {
            //var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x) / dist;
            var difY = (this.y - ent.y) / dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;
            if (!io2) {
                if (this.color == ent.color) {
                    if (this.mass > ent.mass) {
                        var ThisArea = Math.PI * (this.radius * this.radius);
                        var EntArea = Math.PI * (ent.radius * ent.radius);
                        var newRadius = Math.sqrt((ThisArea + EntArea) / Math.PI);
                        this.mass += ent.mass;
                        this.radius = newRadius;
                        ent.mass -= ent.mass;
                        ent.radius -= ent.radius;
                    } else {
                        var ThisArea = Math.PI * (this.radius * this.radius);
                        var EntArea = Math.PI * (ent.radius * ent.radius);
                        var newRadius = Math.sqrt((ThisArea + EntArea) / Math.PI);
                        ent.mass += this.mass;
                        ent.radius = newRadius;
                        this.mass -= this.mass;
                        this.radius -= this.radius;
                    }
                    if (this.radius <= 0 || this.mass <= 0) {
                        this.removeFromWorld = true;
                    }
                    if (ent.radius <= 0 || ent.mass <= 0) {
                        ent.removeFromWorld = true;
                    }
                }
            } else {
                if (this.color == 6 || ent.color == 6) {
                    //if (this.mass > ent.mass) {
                    if (this.color == 6) {
                        if (this.mass > ent.mass) {
                            var ThisArea = Math.PI * (this.radius * this.radius);
                            var EntArea = Math.PI * (ent.radius * ent.radius);
                            var newRadius = Math.sqrt((ThisArea + EntArea) / Math.PI);
                            this.mass += ent.mass;
                            this.radius = newRadius;
                            ent.mass -= ent.mass;
                            ent.radius -= ent.radius;
                        }
                    }

                    else if (ent.color == 6) {
                        if (ent.mass > this.mass) {
                            var ThisArea = Math.PI * (this.radius * this.radius);
                            var EntArea = Math.PI * (ent.radius * ent.radius);
                            var newRadius = Math.sqrt((ThisArea + EntArea) / Math.PI);
                            ent.mass += this.mass;
                            ent.radius = newRadius;
                            this.mass -= this.mass;
                            this.radius -= this.radius;
                        }
                    }
                    if (ent.radius <= 0 || ent.mass <= 0) {
                        ent.removeFromWorld = true;
                    }
                    if (this.radius <= 0 || this.mass <= 0) {
                        this.removeFromWorld = true;
                    }
                }
            }
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);

            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }



    /*
    if (autoPlay) {
        if (this.mass >= 1000) {
            for (var i = 0; i < this.mass; i += 100) {
                var circle = new Circle(this.game);
                //circle.setIt();
                this.game.addEntity(circle);
            }

            this.removeFromWorld = true;

        }
    }
    */
    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

window.onload = function () {
    var socket = io.connect("http://24.16.255.56:8888");

    socket.on("load", function (data) {
        console.log(data);
        autoPlay = data.autoPlayState;
        io2 = data.io2State;
        friction = data.frictionState;
        for (var i = 0; i < data.color.length; i++) {
            var circle = new Circle(game);
            circle.mass = data.mass[i];
            circle.radius = data.radius[i];
            circle.visualRadius = data.visualRadius[i];
            circle.color = data.color[i];
            circle.velocity = { x: data.velocityX[i], y: data.velocityY[i] };
           //alert(data.velocityX[i]);
            circle.x = data.X[i];
            circle.y = data.Y[i];
            circle.speed = data.speed[i];
            if (circle.color == 6) {
                if(io2) {
                    circle.setIt();
                }
                
                mainCircle = circle;

            }


            game.addEntity(circle);

        }

    });

    var text = document.getElementById("text");
    var saveButton = document.getElementById("save");
    var loadButton = document.getElementById("load");

    //var entities = game.entities;
    saveButton.onclick = function () {
        console.log("save");
        text.innerHTML = "Saved."
        //you are able to save arrays to the database
        var tempColors = [];
        var tempMass = [];
        var tempRadius = [];
        var tempVisualRadius = [];
        var tempVelocityX = [];
        var tempVelocityY = [];
        var tempX = [];
        var tempY = [];
        var tempSpeed = [];
        for (var i = 0; i < game.entities.length; i++) {
            tempColors[i] = game.entities[i].color;
            tempMass[i] = game.entities[i].mass;
            tempRadius[i] = game.entities[i].radius;
            tempVisualRadius[i] = game.entities[i].visualRadius;
            tempVelocityX[i] = game.entities[i].velocity.x;
            tempVelocityY[i] = game.entities[i].velocity.y;
            tempX[i] = game.entities[i].x;
            tempY[i] = game.entities[i].y;
            tempSpeed[i] = game.entities[i].speed;
        }

        socket.emit("save", {
            studentname: "ChrisKimAssignment3", statename: "SphereGameState", autoPlayState: autoPlay, io2State: io2, mass: tempMass,
            radius: tempRadius, visualRadius: tempVisualRadius, color: tempColors,
            velocityX: tempVelocityX, velocityY: tempVelocityY, X: tempX, Y: tempY, frictionState: friction, speed: tempSpeed
        });

        /*
    for (var i = 0; i < game.entities.length; i++) {
        var tempName = "ChrisKimAssignment3";
        var tempState = "GameState" + i;

        socket.emit("save", {
            studentname: tempName, statename: tempState, autoPlayState: autoPlay, io2State: io2, mass: game.entities[i].mass,
            radius: game.entities[i].radius, visualRadius: game.entities[i].visualRadius, color: game.entities[i].color,
            velocityX: game.entities[i].velocity.x, velocityY: game.entities[i].velocity.y, X: game.entities[i].x, Y: game.entities[i].y, frictionState: friction, listSize: game.entities.length
        });
    }
    */
    };

    function getInfo() {
        socket.emit("save", {
            studentname: "ChrisKimAssignment3", statename: "size123"
        });
        alert("test2: " + entSize);
    }

    loadButton.onclick = function () {
        console.log("load");
        game.entities = [];
        socket.emit("load", { studentname: "ChrisKimAssignment3", statename: "SphereGameState" });

    };

};






// the "main" code begins here

var acceleration = 100000000;
var maxSpeed = 100;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    game = gameEngine;

    for (var i = 0; i < 60; i++) {
        var circle = new Circle(gameEngine);
        //circle.color = 4;
        gameEngine.addEntity(circle);
    }


    mainCircle = new Circle(gameEngine);
    mainCircle.color = 6;
    mainCircle.mass = 250;
    //circle.setIt();
    mainCircle.velocity = { x: 0, y: 0 };
    mainCircle.radius = 50
    mainCircle.speed = 0;
    gameEngine.addEntity(mainCircle);

    document.addEventListener('keydown',
        function key_event(event) {
            if (event.keyCode == 37) {
                mainCircle.x -= 10;
            } else if (event.keyCode == 38) {
                mainCircle.y -= 10;
            } else if (event.keyCode == 39) {
                mainCircle.x += 10;
            } else if (event.keyCode == 40) {
                mainCircle.y += 10;
            } else if (event.keyCode == 80) {
                if (autoPlay) {
                    autoPlay = false;
                    friction = 0;
                    for (var i = 0; i < gameEngine.entities.length; i++) {
                        gameEngine.entities[i].velocity = { x: 0, y: 0 };
                    }
                } else {
                    autoPlay = true;
                    friction = 1;
                    for (var i = 0; i < gameEngine.entities.length; i++) {
                        if (gameEngine.entities[i].color != 6) {
                            gameEngine.entities[i].velocity = { x: Math.random() * 45, y: Math.random() * 45 };
                        }
                    }
                }
            } else if (event.keyCode == 67) {
                if (io2) {
                    io2 = false;
                    mainCircle.setNotIt();
                    friction = 0;
                    for (var i = 0; i < gameEngine.entities.length; i++) {
                        gameEngine.entities[i].velocity = { x: 0, y: 0 };
                    }
                } else {
                    io2 = true;
                    mainCircle.setIt();
                    friction = 1;
                    for (var i = 0; i < gameEngine.entities.length; i++) {
                        if (gameEngine.entities[i].color != 6) {
                            gameEngine.entities[i].velocity = { x: Math.random() * 45, y: Math.random() * 45 };
                        }
                    }
                }
            }
            return false;
        });

    gameEngine.init(ctx);
    gameEngine.start();
});
