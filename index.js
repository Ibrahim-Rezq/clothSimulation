const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
const width = canvas.width
const height = canvas.height

const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
}
const gravity = 0.2
const friction = 0.999
const bounce = 0.9
let isStatic = false
let color = 'black'
let selected = null

class Point {
    constructor(x, y, oldX, oldY, radius, color, isStatic) {
        this.x = x
        this.y = y
        this.oldX = oldX
        this.oldY = oldY
        this.radius = radius
        this.color = color
        this.velocity = 1
        this.isStatic = isStatic
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
    }
}

class Stick {
    constructor(pointA, pointB) {
        this.pointA = pointA
        this.pointB = pointB
        this.length = 15
    }
    draw() {
        ctx.beginPath()
        ctx.moveTo(this.pointA.x, this.pointA.y)
        ctx.lineTo(this.pointB.x, this.pointB.y)
        ctx.stroke()
    }
    update() {
        this.draw()
    }
}
const points = []
const sticks = []

addEventListener('contextmenu', (e) => {
    e.preventDefault()
    isStatic = !isStatic
    color = color === 'red' ? 'green' : 'red'
})
addEventListener('click', (e) => {
    const mousePostion = {
        x: e.clientX,
        y: e.clientY,
    }
    const point = new Point(
        mousePostion.x,
        mousePostion.y,
        mousePostion.x - 2,
        mousePostion.y - 2,
        20,
        color,
        isStatic
    )
    // points.push(point)
})
const pos = 15
const pointsNum = 30
const offset = 15
for (let i = 1; i <= pointsNum; i++) {
    for (let j = 1; j <= pointsNum; j++) {
        const point = new Point(
            offset + pos * i,
            offset + pos * j,
            offset + pos * i - 1,
            offset + pos * j - 1,
            0.5,
            j == 1 ? 'red' : color,
            j == 1 && true
        )
        points.push(point)
    }
}

points.forEach((point, i, array) => {
    if (i + 1 <= array.length - 1 && (i + 1) % pointsNum !== 0) {
        const stick = new Stick(point, array[i + 1])
        sticks.push(stick)
        if (array[i + pointsNum]) {
            const stick = new Stick(point, array[i + pointsNum])
            sticks.push(stick)
        }
    }
})
let play = false
const clipSticks = (e) => {
    if (e.type === 'mousedown') {
        sticks.forEach((stick, index) => {
            if (
                getDistance(stick.pointA, { x: e.clientX, y: e.clientY }) < 10
            ) {
                setTimeout(() => {
                    sticks.splice(index, 1)
                }, 0)
            }
        })
    }
}
const animate = () => {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, width, height)
    sticks.forEach((stick) => {
        stick.update()
        const distanceX = stick.pointB.x - stick.pointA.x
        const distanceY = stick.pointB.y - stick.pointA.y
        const distance = getDistance(stick.pointB, stick.pointA)
        const diffrance = stick.length - distance
        const precent = diffrance / distance / 2
        offsetX = distanceX * precent
        offsetY = distanceY * precent
        if (!stick.pointA.isStatic) {
            stick.pointA.x -= offsetX
            stick.pointA.y -= offsetY
        }
        if (!stick.pointB.isStatic) {
            stick.pointB.x += offsetX
            stick.pointB.y += offsetY
        }
    })
    points.forEach((point) => {
        point.update()
        if (!point.isStatic) {
            const velocityX = (point.x - point.oldX) * friction
            const velocityY = (point.y - point.oldY) * friction
            point.oldX = point.x
            point.oldY = point.y
            point.x += velocityX
            point.y += velocityY
            point.y += gravity
            if (point.x > width) {
                point.x = width
                point.oldX = point.x + velocityX * bounce
            } else if (point.x < 0) {
                point.x = 0
                point.oldX = point.x + velocityX * bounce
            }
            if (point.y > height) {
                point.y = height
                point.oldY = point.y + velocityY * bounce
            } else if (point.y < 0) {
                point.y = 0
                point.oldY = point.y + velocityY * bounce
            }
        }
    })
}
addEventListener('mousedown', clipSticks)
animate()
