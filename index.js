const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
};
// game gravity
const gravity = 0.17
// **
// collisions
const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36));
};
const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36));
};
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
    row.forEach((Symbol, x) => {
        if (Symbol === 202 || Symbol === 78 || Symbol === 80 || Symbol === 82) {
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    }
                })
            )
        }
    })
});
const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
    row.forEach((Symbol, x) => {
        if (Symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                    height: 6
                })
            )
        }
    })
});
// **
// background and camera
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
});
const backgroundImageHeight = 432;
const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height
    }
};
// **
// Mobs enemy
const enemies = [];

const warrior = new Enemy({
    position: {
        x: 200,
        y: 320
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    imageSrc: './assets/warrior/Idle.png',
    frameRate: 11,
    scale:{
    x: .62,
    y: .62,
    },
    animations: {
        Idle: {
            imageSrc: './assets/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './assets/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Attack:{
            imageSrc: './assets/warrior/Attack.png',
            frameRate: 6,
            frameBuffer: 8,
        },
        TakeHit:{
            imageSrc: './assets/warrior/TakeHit.png',
            frameRate: 4,
            frameBuffer: 4,
        },
        Death:{
            imageSrc: './assets/warrior/Death.png',
            frameRate:9,
            frameBuffer:8,
        }
    },
    movementSpeed:0.7,
    lifePoints:30,
    hitboxDimensions:{
        width:17,
        height:24
    },
    attackBoxDimensions:{
        width: 30,
        height: 20
    }

});

const goblin = new Enemy({
    position: {
        x: 170,
        y: 320
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    imageSrc: './assets/mobs/goblin/Idle.png',
    frameRate: 4,
    scale:{
        x:.55,
        y:.45
    },
    animations: {
        Idle: {
            imageSrc: './assets/mobs/goblin/Idle.png',
            frameRate: 4,
            frameBuffer:2,
        },
        Run: {
            imageSrc: './assets/mobs/goblin/Run.png',
            frameRate: 8,
            frameBuffer:4,
        },
        Attack:{
            imageSrc: './assets/mobs/goblin/Attack.png',
            frameRate: 8,
            frameBuffer: 8,
        },
        TakeHit:{
            imageSrc: './assets/mobs/goblin/TakeHit.png',
            frameRate: 4,
            frameBuffer: 4,
        },
        Death:{
            imageSrc: './assets/mobs/goblin/Death.png',
            frameRate:4,
            frameBuffer:7,
        }
    },
    movementSpeed:0.8,
    lifePoints:10,
    hitboxDimensions:{
        width:14,
        height:20
    },
    attackBoxDimensions:{
        width: 20,
        height: 20
    }
});

enemies.push(goblin, warrior);

// Player declaration,
const player = new Player({
    position: {
        x: 45, y: 320
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    imageSrc: './assets/hero/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './assets/hero/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        IdleLeft: {
            imageSrc: './assets/hero/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './assets/hero/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        RunLeft: {
            imageSrc: './assets/hero/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './assets/hero/Jump.png',
            frameRate: 2,
            frameBuffer: 2,
        },
        JumpLeft: {
            imageSrc: './assets/hero/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 2,
        },
        Fall: {
            imageSrc: './assets/hero/Fall.png',
            frameRate: 2,
            frameBuffer: 2,
        },
        FallLeft: {
            imageSrc: './assets/hero/FallLeft.png',
            frameRate: 2,
            frameBuffer: 2,
        },
        Attack: {
            imageSrc: './assets/hero/Attack1.png',
            frameRate: 4,
            frameBuffer: 12
        }
    }
});
// Player Movement declaration
// keyboards
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
// gamepad
window.addEventListener("gamepadconnected", connectGamepad);
window.addEventListener("gamepaddisconnected", disconnectGamepad);
//
const keys = {
    left: false,
    right: false,
    attack: false,
};
// controllers
//keyboard
function keyDown(e) {
    switch (e.key) {
        case 'd':
            if(!player.isAttacking)
            keys.right = true;
            break;
        case 'a':
            if(!player.isAttacking)
            keys.left = true;   
            break;
        case 'w':
            player.jump();
            break;
        case 'j':
            if(!player.isAttacking){
                if(enemies.length > 0){
                    player.attack(enemies);
                }else {
                    player.attack();
                }
            }
            break
    }
};

function keyUp(e) {
    switch (e.key) {
        case 'd':
            keys.right = false;
            break;
        case 'a':
            keys.left = false;
            break;
        // case 'j':
        //     player.isAttacking = false
        // break;
    }
};
//gamepad
let gamepad;
function connectGamepad(e){
    gamepad = e.gamepad;
    console.log("Gamepad connected:", gamepad.id);
};
function disconnectGamepad(e){
    gamepad = undefined;
    console.log("Gamepad disconnected:", e.gamepad.id);
};

function applyPlayerMovement() {
    player.velocity.x = 0;

    if (keys.right && player.isAttacking) {
        console.log("walking and attacking");
        player.velocity.x = 0;
        player.switchSprite("Attack")

    }
    else
        if (keys.left && player.isAttacking) {
            player.playerLastDirection = "left"
            player.velocity.x = 0;
            player.switchSprite("Attack")
        };

    if (keys.right && !player.isAttacking) {
        player.switchSprite('Run');
        player.velocity.x = 1;
        player.playerLastDirection = "right";
        player.panCameraToTheLeft({ camera, canvas });
    }
    else
        if (keys.left && !player.isAttacking) {
            player.playerLastDirection = "left"
            player.switchSprite('RunLeft');
            player.velocity.x = -1;
            player.panCameraToTheRight({ camera, canvas });

        }
        else {
            if (player.velocity.y === 0) {
                if (player.isAttacking) {
                    player.switchSprite("Attack")
                } else if (player.playerLastDirection === "right")
                    player.switchSprite("Idle");
                else
                    player.switchSprite("IdleLeft");
            };
        }

    if (player.velocity.y < 0) {
        player.panCameraDown({ canvas, camera });
        if (player.playerLastDirection === "right") player.switchSprite("Jump");
        else
            player.switchSprite("JumpLeft");
    }
    else
        if (player.velocity.y > 0) {
            player.panCameraUp({ canvas, camera });
            if (player.playerLastDirection === "right")
                player.switchSprite("Fall");
            else
                player.switchSprite("FallLeft");
        };

};

function applyGamepadMovement(){
    const axesThreshold = 0.5;
    const [leftStickX, leftStickY] =  gamepad.axes;
    const dPadX = gamepad.axes[6];
    const dPadY = gamepad.axes[7];

    if(leftStickX < -axesThreshold || dPadX < -axesThreshold ){
        keys.left = true;
        keys.right = false;
    } else if(leftStickX > axesThreshold || dPadX > axesThreshold){
        keys.right = false;
        keys.right = true;
    } else {
        keys.left = false;
        keys.right = false;
    }

    if(gamepad.buttons[0].pressed){
        player.jump();
    }
    //attack in: xbox:[a/b]; PSone["[]","O"]
    if(gamepad.buttons[1].pressed || gamepad.buttons[2].pressed){
        if(!player.isAttacking){
            if(enemies.length > 0){
                enemies.forEach((enemy)=>{
                    player.attack(enemy)
                });
            }else{
                player.attack();
            }
        }
    }
    // if(gamepad.buttons[6].pressed ){console.log("select")};
    // if(gamepad.buttons[7].pressed ){console.log("start")};
    // if(gamepad.buttons[8].pressed ){console.log("home")};
    // if(gamepad.buttons[9].pressed ){console.log("click l-stick")};
    // if(gamepad.buttons[10].pressed ){console.log("click r-stick")};
    // if(gamepad.buttons[11].pressed ){console.log("click r-stick")};

};
// end of movements
// 
// Battles
function engageWithTheEnemy() {
    // Player and enemy Collied;
    if(enemies.length > 0){
        enemies.forEach(enemy => {
            if (
                rectangularCollision({rectangule1:player.hitBox, rectangule2:enemy.hitBox})
             ) {
                 console.log("enemy is touching you")
             }
        });
    }

};
// 
// ***
// System Core
// Update
function update(){
     // player's
     player.update();
     if(gamepad) applyGamepadMovement();
     applyPlayerMovement();
     // mob's
    //  enemy.update({player});
     //
     for(let i = 0; i < enemies.length; i++){
        const enemy = enemies[i];
        enemy.update({player});
        
        if(!enemy.isDying && enemy.isToDelete){
            enemies.splice(i,1);
            i--;
            console.log('im dead');
        }
     }
};
// Animation 
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.save()
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.scale(4, 4);
    c.translate(camera.position.x, camera.position.y);
    background.update();
    update();
    engageWithTheEnemy();    
    c.restore();
};

animate();
