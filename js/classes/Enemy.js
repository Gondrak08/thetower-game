class Enemy extends Sprite {
    constructor({
        position,
        frameRate,
        imageSrc,
        scaleX = 0.5,
        scaleY = 0.5,
        collisionBlocks,
        platformCollisionBlocks,
        animations,
        movementSpeed,
        lifePoints,

    }) {
        super({ imageSrc, frameRate, scaleX, scaleY });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1
        };
        this.movementSpeed = movementSpeed;
        this.collisionBlocks = collisionBlocks,
            this.platformCollisionBlocks = platformCollisionBlocks
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10,
        }

        this.animations = animations;
        this.enemyLastDirection = "right"; // to be used to change the direction of the enemy and it sprite (if you don't have an opposite sprite)
        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        };
        this.isAttacking = false;
        this.isAttackingAnimation = false;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10,
        };
        this.attackRange = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10,
        };
        this.lifePoints = lifePoints;
        this.isHurt = false;
        this.isDying = false;
        this.isToDelete = false;

    };

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;
        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    };

    update({ player }) {
        // c.fillStyle = 'rgba(0,0,555,0.5)';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        this.updateFrames();
        this.position.x += this.velocity.x;
        this.updateHitBox()
        // Uncomment to draw limit box's around the character
        c.fillStyle = 'rgba(255,0,0,0.2)';
        c.fillRect(
            this.hitBox.position.x,
            this.hitBox.position.y,
            this.hitBox.width,
            this.hitBox.height,
        );

        // this.updateAttackBox();
        // c.fillStyle = 'rgba(0,255,0,0.5)';
        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // );
        // end
            
        this.checkForHorizontalCollisions();
        this.applyGravity()
        this.updateHitBox()
        this.updateAttackBox();
        this.draw();
    

        //check and engage attack with player
        if(!this.isDying){
            if (player && !this.isHurt) {
                this.huntPlayer(player);
                this.attackPlayer(player)
            };
        }
        // this.gotKilled()

        this.checkForVerticalCollisions();

    };

    updateHitBox() {
        this.hitBox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26
            },
            width: 14,
            height: 27,
        }
    };

    updateAttackBox() {
        if (this.enemyLastDirection === "left") {
            this.attackBox = {
                position: {
                    x: this.position.x + 35 - (this.attackBox.width - 10),
                    y: this.position.y + 26
                },
                width: 30,
                height: 20
            }
        }
        else {
            this.attackBox = {
                position: {
                    x: this.position.x + 35,
                    y: this.position.y + 26
                },
                width: 30,
                height: 20
            }
        }
    };

    updateAttackRange() {
        this.attackRange = {
            position: {
                x: this.position.x + 5,
                y: this.position.y + 27
            },
            width: this.width - 10,
            height: this.hitBox.height,
        };
    };

    applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    };

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if (
                collision({ object1: this.hitBox, object2: collisionBlock })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    const offset = this.hitBox.position.y - this.position.y + this.hitBox.height;
                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    this.jumpsLeft = this.maxJumps;
                    break;
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitBox.position.y - this.position.y;
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                    break;
                }
            }
        }

        // platformBlocks
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i];
            if (
                platformCollision({ object1: this.hitBox, object2: platformCollisionBlock })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    const offset = this.hitBox.position.y - this.position.y + this.hitBox.height;
                    this.position.y = platformCollisionBlock.position.y - offset - 0.01;
                    this.jumpsLeft = this.maxJumps;
                    break;
                }

            }
        }
    };

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];
            if (
                collision({ object1: this.hitBox, object2: collisionBlock })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0
                    const offset = this.hitBox.position.x - this.position.x + this.hitBox.width;
                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    const offset = this.hitBox.position.x - this.position.x;
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break;
                }
            }
        }
    };

    huntPlayer(player) {
        const playerLeft = player.cameraBox.position.x;
        const playerRight = player.cameraBox.position.x + player.cameraBox.width;
        const playerTop = player.cameraBox.position.y;
        const playerBottom = player.cameraBox.position.y + player.cameraBox.height;

        const enemy = this;
        const enemyLeft = enemy.hitBox.position.x;
        const enemyRight = enemy.hitBox.position.x + enemy.hitBox.width;
        const enemyTop = enemy.hitBox.position.y;
        const enemyBottom = enemy.hitBox.position.y + enemy.hitBox.height;

        const isOverlappingHorizontal = enemyLeft <= playerRight && enemyRight >= playerLeft;

        const isOverlappingVertical = enemyTop <= playerBottom && enemyBottom >= playerTop;

        const cameraBoxMidPoint = playerLeft + player.cameraBox.width / 2;

        if (!this.isAttacking) {
            if (isOverlappingHorizontal && isOverlappingVertical) {
                if (enemyLeft < playerLeft) {
                    enemy.enemyLastDirection = "right";
                    enemy.velocity.x = enemy.movementSpeed;
                } else if (enemyLeft < cameraBoxMidPoint) {
                    enemy.enemyLastDirection = "right";
                    enemy.velocity.x = enemy.movementSpeed;
                }

                if (enemyRight > playerRight) {
                    enemy.enemyLastDirection = "left";
                    enemy.velocity.x = -enemy.movementSpeed;

                }
                else if (enemyLeft > cameraBoxMidPoint) {
                    enemy.enemyLastDirection = "left";
                    enemy.velocity.x = -enemy.movementSpeed;

                }
                enemy.switchSprite("Run")
            };
        }

    };

    attackPlayer(player) {
        const playerLeft = player.hitBox.position.x;
        const playerRight = player.hitBox.position.x + player.hitBox.width;
        const playerTop = player.hitBox.position.y;
        const playerBottom = player.hitBox.position.y + player.hitBox.height;

        const enemy = this;
        const enemyLeft = enemy.attackBox.position.x;
        const enemyRight = enemy.attackBox.position.x + enemy.attackBox.width;
        const enemyTop = enemy.attackBox.position.y;
        const enemyBottom = enemy.attackBox.position.y + enemy.attackBox.height;

        const isOverlappingHorizontal = enemyLeft < playerRight && enemyRight > playerLeft;
        const isOverlappingVertical = enemyTop < playerBottom && enemyBottom > playerTop;
        if (isOverlappingHorizontal && isOverlappingVertical) {
            if (enemyLeft < playerLeft) {
                enemy.enemyLastDirection = "right";
                if (!enemy.isAttacking) {
                    enemy.isAttacking = true
                    enemy.attack();
                }
            }
            else if (enemyRight > playerRight) {
                enemy.enemyLastDirection = "left";
                if (!enemy.isAttacking) {
                    enemy.isAttacking = true
                    enemy.attack();
                }
            }
        }
    };

    attack() {
        this.velocity.x = 0
        this.switchSprite("Attack");
        setTimeout(() => {
            this.isAttacking = false;
            this.isAttackingAnimation = false;
            console.log("hi")
        }, 700)
    };

    gotHurt() {
        this.velocity.x = 0;
        this.isHurt = true;

        if (this.enemyLastDirection == "right") this.position.x -= 3.5;
        if (this.enemyLastDirection === "left") this.position.x += 3.5;

        if (this.lifePoints <= 0) {
            this.gotKilled()
        };

        if(!this.isDying){
            this.switchSprite("TakeHit");
            return setTimeout(() => {
                console.log("!Outch!")
                this.lifePoints -= 15;
                this.isHurt = false;
            }, 800)
        }
    };

    gotKilled() {
        this.isDying = true;
        this.switchSprite("Death");
        setTimeout(() => {
            this.isToDelete = true;
            this.isDying = false;
        }, 1000)

    }


}