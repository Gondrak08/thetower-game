function collision({
    object1,
    object2,
}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    )
};

function platformCollision({
    object1,
    object2,
}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y + object1.height <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    )
}

function rectangularCollision({
    rectangule1,
    rectangule2
}){
    return(
        rectangule1.attackBox.position.x + rectangule1.attackBox.width >= rectangule2.hitBox.position.x &&
        rectangule1.attackBox.position.y + rectangule1.attackBox.height >= rectangule2.position.y &&
        rectangule1.attackBox.position.y <= rectangule2.position.y + rectangule2.height 
    )
}