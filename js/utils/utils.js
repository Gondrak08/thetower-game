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
};

function rectangularCollision({
    rectangule1,
    rectangule2
}) {
    return (
        rectangule1.position.x + rectangule1.width >= rectangule2.position.x &&
        rectangule1.position.x <= rectangule2.position.x + rectangule2.width &&
        rectangule1.position.y + rectangule1.height >= rectangule2.position.y &&
        rectangule1.position.y <= rectangule2.position.y + rectangule2.height
        )

}

///

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  