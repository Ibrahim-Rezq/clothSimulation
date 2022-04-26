const getRandom = (max = 100, min = 0) => {
    return Math.random() * (max - min) + min
}
const getRandomInt = (max = 100, min = 0) => {
    return Math.floor(getRandom(max, min))
}
const getDistance = (object1, object2) => {
    const distanceX = object1.x - object2.x
    const distanceY = object1.y - object2.y
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY)
}
const getVelocity = (postion1, postion2) => {
    const angle = Math.atan2(postion1.y - postion2.y, postion1.x - postion2.x)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    }
    return velocity
}
