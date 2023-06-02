class Player extends Sprite {
    constructor({ 
        position, 
        collisionBlocks, 
        platformCollisionBlocks, 
        imageSrc, 
        frameRate, 
        scale = 0.5, 
        animations, 
        jumpsLeft = 2, 
        maxJumps = 2 
    }) {
        super({ imageSrc, frameRate, scale });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1
        };
        this.jumpsLeft = jumpsLeft;
        this.maxJumps = maxJumps;
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10,
        };
        this.isAttacking = false;
        this.attackCount = 0;
        this.attackBox ={
            position:{
                x:this.position.x,
                y:this.position.y
            },
            width:100,
            height:20
        }
        this.animations = animations;
        this.playerLastDirection = "right";
        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        };
        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 200,
            height: 80
        };
    };

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
    };

    updateCameraBox() {
        this.cameraBox = {
            position: {
                x: this.position.x - 50,
                y: this.position.y
            },
            width: 200,
            height: 80
        }
    };

    checkForHorizontalCanvasCollisions() {
        if (this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
            this.hitBox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0;
        }

    };

    panCameraToTheLeft({ canvas, camera }) {
        const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;
        const scaledDownCanvasWidth = canvas.width / 4;

        if (cameraBoxRightSide >= 576) return;

        if (cameraBoxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
            console.log('camera panning to the left');
            camera.position.x -= this.velocity.x;
        }

    };

    panCameraToTheRight({ canvas, camera }) {
        if (this.cameraBox.position.x <= 0) return;

        if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
        }
    };

    panCameraDown({ canvas, camera }) {
        if (this.cameraBox.position.y + this.velocity.y <= 0) return;
        if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y;
        }
    };

    panCameraUp({ canvas, camera }) {
        // canvasHeight = 432;
        const canvasHeight = canvas.heigh
        if (this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= canvasHeight) return;

        const scaleDownCanvasHeight = canvas.height / 4
        if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaleDownCanvasHeight) {
            camera.position.y -= this.velocity.y;
        }
    };

    update() {
        this.updateFrames();
        this.updateHitBox();
        this.updateAttackBox();
        this.updateCameraBox();
        this.checkForHorizontalCanvasCollisions();
        // 
        // cameraBox box
        c.fillStyle = 'rgba(0,255,0,0.2)';
        c.fillRect(
            this.cameraBox.position.x,
            this.cameraBox.position.y,
            this.cameraBox.width,
            this.cameraBox.height,
        )
        // player hitbox box
        c.fillStyle = 'rgba(255,0,0,0.2)';
        c.fillRect(
            this.hitBox.position.x,
            this.hitBox.position.y,
            this.hitBox.width,
            this.hitBox.height,
        )
        // player attack box
        if(this.isAttacking === true){
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height,
            )
        }
        
        this.draw();
        this.position.x += this.velocity.x;
        this.updateHitBox();
        this.updateAttackBox();
        this.checkForHorizontalCollisions();
        this.applyGravity();
        this.updateHitBox();
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

    updateAttackBox(){
        if(this.playerLastDirection ==="left"){
            this.attackBox ={
                position:{
                    x:this.position.x + 35 - (this.attackBox.width - 10),
                    y:this.position.y + 26
                },
                width:40,
                height:20
            }
        }
        else{
        this.attackBox ={
            position:{
                x:this.position.x +35,
                y:this.position.y + 26
            },
            width:40,
            height:20
        }
        }



    };
    // actions
    attack(){
        this.isAttacking = true;
        setTimeout(()=>{
            this.isAttacking = false;
        },500)
    };
    jump(){
        if (this.jumpsLeft > 0) {
            this.velocity.y = -4;
            if (this.jumpsLeft == 1) {
                this.velocity.y *= 1.5;
            }
        }
        this.jumpsLeft--;
    }
    // **
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

    // checkForAttackCollision(){
    //     // if(
    //     //     this.attackBox.position.x + this.attackBox.width >= 
    //     // )
    // }
};
