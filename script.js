const radios = document.getElementsByClassName('radio')
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const controller = {}
const text = {}
const corr = {}

for (var i = 0; i < 8; i++) {
    controller[i + 1] = document.getElementById(`height${i + 1}`)
    text[i + 1] = document.getElementById(`text${i + 1}`)
    corr[i + 1] = 1
}

const resultText = document.getElementById(`result`)

const moveData = {
    body: 100,
    arm1: 32,
    foot: 55,
    hand: 46.08,
    wrist: 57.37,
    arm2: 56.89,
    leg: 52.8,
    storm: 67.4,
    there: 57.9,
    ankle: 40.2
}

const data = {
    radius: 2
}

const human = {
    head: 21 / 0.7,
    body: 45 / 0.7,
    arm1: 30,
    arm2: 30,
    leg1: 30 / 0.7,
    leg2: 35 / 0.7,
    wrist: 10,
    ankle: 24 / 0.7
}

const humanW = {
    head: 20 * 1.5,
    body: 30 * 1.5,
    arm: 10 * 1.5,
    leg: 10 * 1.5,
    delta: 2 * 1.5
}

const ratio = 2.5
var heightRatio = 1
const O = { x: 400, y: 50 }

function sleep(t) {
    return new Promise(resolve => setTimeout(resolve, t));
}

function distance(A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

function random(m) {
    return Math.random() * m
}

const print = (text) => { console.log(text) }

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

function fillRectMidX(x, y, w, h) {
    ctx.fillRect(x - w / 2, y, w, h)
}

function strokeRectMidX(x, y, w, h) {
    ctx.strokeRect(x - w / 2, y, w, h)
}

function changeType() {
    var type = 0
    for (var i=0; i<radios.length; i++) {
        if (radios[i].checked) {
            type = i
            break
        }
    }
    if(type==0){
        neurons['storm'].axonTo = neurons.body
    }
    else if(type==1){
        neurons['storm'].axonTo = null
    }
}

const posHuman = {
    head: [0, 0],
    body: [0, 0],
    arm1L: [0, 0],
    arm1R: [0, 0],
    arm2L: [0, 0],
    arm2R: [0, 0],
    legL: [0, 0],
    legR: [0, 0],
    hand: 0,
    foot: 0,
    storm: 0,
    there: 0,
    wristR: 0,
    wristL: 0
}

function drawHuman() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 1
    //Head
    var y = O.y
    ctx.fillStyle = 'rgb(155,155,155)'
    fillRectMidX(O.x, y, humanW.head, human.head * corr[1])
    posHuman['head'] = [O.x, y + human.head / 2 * corr[1]]
    //Body
    y += human.head * corr[1]
    fillRectMidX(O.x, y, humanW.body, human.body * corr[2])
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    posHuman['body'] = [O.x, y]
    posHuman['storm'] = [O.x, y + (human.body - 40) * corr[2] - 20]
    posHuman['there'] = [O.x, y + human.body * corr[2] - 20]
    //Arm1 R
    ctx.fillRect(O.x + humanW.body / 2, y, humanW.arm, human.arm1 * corr[3])
    //Arm1 L
    ctx.fillRect(O.x - humanW.body / 2 - humanW.arm, y, humanW.arm, human.arm1 * corr[3])
    posHuman['arm1R'] = [O.x + humanW.body / 2 + humanW.arm / 2, y]
    posHuman['arm1L'] = [O.x - humanW.body / 2 - humanW.arm / 2, y]
    posHuman['arm2R'] = [O.x + humanW.body / 2 + humanW.arm / 2, y + human.arm1 * corr[3]]
    posHuman['arm2L'] = [O.x - humanW.body / 2 - humanW.arm / 2, y + human.arm1 * corr[3]]
    //Arm2 
    y += human.arm1 * corr[3]
    ctx.fillRect(O.x + humanW.body / 2, y, humanW.arm, human.arm2 * corr[4])
    ctx.fillRect(O.x - humanW.body / 2 - humanW.arm, y, humanW.arm, human.arm2 * corr[4])
    posHuman['wristR'] = [O.x + humanW.body / 2 + humanW.arm / 2, y + (human.arm2) * corr[4]]
    posHuman['wristL'] = [O.x - humanW.body / 2 - humanW.arm / 2, y + (human.arm2) * corr[4]]
    y += human.arm2 * corr[4]
    ctx.fillStyle = 'rgba(155,155,0,0.5)'
    ctx.fillRect(O.x + humanW.body / 2, y, humanW.arm, human.wrist * corr[5])
    ctx.fillRect(O.x - humanW.body / 2 - humanW.arm, y, humanW.arm, human.wrist * corr[5])
    posHuman['handR'] = [O.x + humanW.body / 2 + humanW.arm / 2, y + human.wrist * corr[5]]
    posHuman['handL'] = [O.x - humanW.body / 2 - humanW.arm / 2, y + human.wrist * corr[5]]
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    //Leg1
    y = O.y + human.head * corr[1] + human.body * corr[2]
    ctx.fillRect(O.x + humanW.delta, y, humanW.leg, human.leg1 * corr[6])
    ctx.fillRect(O.x - humanW.leg - humanW.delta, y, humanW.leg, human.leg1 * corr[6])
    posHuman['legR'] = [O.x + humanW.leg / 2 + humanW.delta, y + human.leg1 * corr[6]]
    posHuman['legL'] = [O.x - humanW.leg / 2 - humanW.delta, y + human.leg1 * corr[6]]
    y += human.leg1 * corr[6]
    ctx.fillRect(O.x + humanW.delta, y, humanW.leg, human.leg2 * corr[7])
    ctx.fillRect(O.x - humanW.leg - humanW.delta, y, humanW.leg, human.leg2 * corr[7])
    posHuman['ankleR'] = [O.x + humanW.leg / 2 + humanW.delta, y + human.leg2 * corr[7]]
    posHuman['ankleL'] = [O.x - humanW.leg / 2 - humanW.delta, y + human.leg2 * corr[7]]
    y += human.leg2 * corr[7]
    ctx.fillStyle = 'rgba(0,55,155,0.5)'
    ctx.fillRect(O.x + humanW.delta, y, humanW.leg, human.ankle * corr[8])
    ctx.fillRect(O.x - humanW.leg - humanW.delta, y, humanW.leg, human.ankle * corr[8])
    posHuman['footR'] = [O.x + humanW.leg / 2 + humanW.delta, y + human.ankle * corr[8]]
    posHuman['footL'] = [O.x - humanW.leg / 2 - humanW.delta, y + human.ankle * corr[8]]
    /*for (var i in posHuman) {
        ctx.fillStyle = 'rgba(255,0,0,1)'
        fillRectMidX(posHuman[i][0], posHuman[i][1], 5, 5)
    }*/
}

class Neuron {
    constructor(part) {
        this.part = part
        this.axonTo = false
        this.color = 'rgba(255,0,0,0.7)'
        this.colorBasic = 'rgba(255,0,0,0.7)'
        this.time = 0.05
        this.speed = 1
    }
    get pos() {
        return [posHuman[this.part][0], posHuman[this.part][1]]
    }
    get posVec() {
        return new Vector(posHuman[this.part][0], posHuman[this.part][1])
    }
    draw() {
        var pos = this.pos
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(pos[0], pos[1], data.radius * ratio, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        if (!this.axonTo) {
            return
        }
        ctx.strokeStyle = this.color
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(pos[0], pos[1])
        var pos2 = this.axonTo.pos
        ctx.lineTo(pos2[0], pos2[1])
        ctx.stroke()
        ctx.closePath()
    }
    async attack() {
        this.color = 'rgba(255,255,255,0.7)'
        this.draw()
        var time = 0
        if (this.axonTo) {
            time = distance(this.posVec, this.axonTo.posVec) / 100 / this.speed / ratio
        }
        var A = this
        setTimeout(async function () {
            A.color = A.colorBasic
            takingTime += time
            if (A.axonTo) {
                await A.axonTo.attack()
            }

            if (A.part == 'head') {
                resultTime = takingTime
                resultText.innerText = `결과 : ${takingTime.toFixed(5)}s`
            }
        }, time * 10000);

    }
}

function setColors(contain, color) {
    for (var i in neurons) {
        if (i.indexOf(contain) != -1) {
            neurons[i].color = color
        }
    }
}

//Setting
for (var i in human) {
    human[i] *= ratio
}
for (var i in humanW) {
    humanW[i] *= ratio
}
const neurons = {}
drawHuman()
for (var i in posHuman) {
    neurons[i] = new Neuron(i)
}
(() => {
    neurons['footL'].axonTo = neurons.ankleL
    neurons['footR'].axonTo = neurons.ankleR
    neurons['ankleL'].axonTo = neurons.legL
    neurons['ankleR'].axonTo = neurons.legR
    neurons['legL'].axonTo = neurons.there
    neurons['legR'].axonTo = neurons.there
    neurons['there'].axonTo = neurons.storm
    neurons['storm'].axonTo = neurons.body

    neurons['handL'].axonTo = neurons.wristL
    neurons['wristL'].axonTo = neurons.arm2L
    neurons['arm2L'].axonTo = neurons.arm1L
    neurons['arm1L'].axonTo = neurons.body
    neurons['handR'].axonTo = neurons.wristR
    neurons['wristR'].axonTo = neurons.arm2R
    neurons['arm2R'].axonTo = neurons.arm1R
    neurons['arm1R'].axonTo = neurons.body
    neurons['body'].axonTo = neurons.head
    for (var i in moveData) {
        for (var j in neurons) {
            if (j.indexOf(i) != -1) {
                neurons[j].speed = moveData[i]
            }
        }
    }
})()
//Setting-End

controller[1].addEventListener("mousemove", (ev) => {
    corr[1] = controller[1].value
    text[1].innerText = `${corr[1] / ratio * human.head}cm`
})
controller[2].addEventListener("mousemove", (ev) => {
    corr[2] = controller[2].value
    text[2].innerText = `${corr[2] / ratio * human.body}cm`
})
controller[3].addEventListener("mousemove", (ev) => {
    corr[3] = controller[3].value
    text[3].innerText = `${corr[3] / ratio * human.arm1}cm`
})
controller[4].addEventListener("mousemove", (ev) => {
    corr[4] = controller[4].value
    text[4].innerText = `${corr[4] / ratio * human.arm2}cm`
})
controller[5].addEventListener("mousemove", (ev) => {
    corr[5] = controller[5].value
    text[5].innerText = `${corr[5] / ratio * human.wrist}cm`
})
controller[6].addEventListener("mousemove", (ev) => {
    corr[6] = controller[6].value
    text[6].innerText = `${corr[6] / ratio * human.leg1}cm`
})
controller[7].addEventListener("mousemove", (ev) => {
    corr[7] = controller[7].value
    text[7].innerText = `${corr[7] / ratio * human.leg2}cm`
})
controller[8].addEventListener("mousemove", (ev) => {
    corr[8] = controller[8].value
    text[8].innerText = `${Math.floor(corr[8] / ratio * human.ankle)}cm`
})


takingTime = 0
var resultTime = 0
isClicked = false
canvas.addEventListener('mousedown', async (ev) => {
    for (var i in neurons) {
        if (distance(neurons[i].posVec, new Vector(ev.offsetX, ev.offsetY)) <= data.radius * ratio) {
            takingTime = 0
            takingTime2 = 0
            await neurons[i].attack()
            return
        }
    }
})

function render() {
    ctx.clearRect(0, 0, 800, 800)
    drawHuman()
    ctx.font = "20px Arial, sans-serif"; //Arial서체 없을 경우, sans-serif 적용
    var height = human.head * corr[1] + human.body * corr[2] + human.leg1 * corr[6] + human.leg2 * corr[7] + human.ankle * corr[8]
    height *= 1 / ratio
    ctx.fillText(`키 : ${height.toFixed(2)}cm`, 600, 100);
    ctx.fillText(`반응시간 : ${resultTime.toFixed(3) * 1000}ms`, 600, 150);

    // 3-4. 텍스트 색상 설정
    for (var i in neurons) {
        neurons[i].draw()
    }
    changeType()
    requestAnimationFrame(render)
}

render()