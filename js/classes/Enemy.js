class Enemy extends Sprite {
    constructor({
        position,
        frameRate,
        imageSrc,
        scale = 0.5,
        collisionBlocks, 
        platformCollisionBlocks,
        animations, 
    }) {
        super({imageSrc,frameRate, scale});
        this.position =position;
        this.velocity = {
            x: 0,
            y: 1
        };
        this.collisionBlocks = collisionBlocks,
        this.platformCollisionBlocks = platformCollisionBlocks
        this.hitBox={
            position:{
                x:this.position.x,
                y:this.position.y
            },
            width:10,
            height: 10,
        }
        this.animations = animations;
        this.enemyLastDirection = "right"; // to be used to change the direction of the enemy and it sprite (if you don't have an opposite sprite)
        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        };
    };

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;
        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    };

    update(){
        this.updateFrames();
        this.position.x += this.velocity.x;
        this.updateHitBox()
        c.fillStyle = 'rgba(255,0,0,0.2)';
        c.fillRect(
            this.hitBox.position.x,
            this.hitBox.position.y,
            this.hitBox.width,
            this.hitBox.height,
        )        
        this.checkForHorizontalCollisions();
        this.applyGravity() 
        this.updateHitBox()        
        this.draw();
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
    applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    }
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

}