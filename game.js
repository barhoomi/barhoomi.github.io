// CANVAS SETUP
canvas = document.querySelector('.canvas')
var ctx = canvas.getContext('2d');
var scale = 30;

// GENERAL FUNCTIONS
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

var tetromino = [
{type:"I",grid:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],color:"cyan"},
{type:"O",grid:[[0,1,1,0],[0,1,1,0],[0,0,0,0]],color:"yellow"},
{type:"T",grid:[[0,1,0],[1,1,1],[0,0,0]],color:"purple"},
{type:"S",grid:[[0,1,1],[1,1,0],[0,0,0]],color:"lime"},
{type:"Z",grid:[[1,1,0],[0,1,1],[0,0,0]],color:"red"},
{type:"J",grid:[[1,0,0],[1,1,1],[0,0,0]],color:"blue"},
{type:"L",grid:[[0,0,1],[1,1,1],[0,0,0]],color:"orange"},
];
// var queue = [];

// function addQueue(){
//     shuffle(tetromino);
//     for(let x = 0;x<7;x++){
//         queue[x] = tetromino[x];
//     }
// }

class Block {
    constructor(){
        this.center = [0,0];
        this.rotation = 0;
    }
    moveDown(){
        grid[block.center[1]][block.center[0]] = "I";
        draw();
        grid[block.center[1]][block.center[0]] = 0;
        block.center[1] += 1;
    }
}

var grid = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
]

function draw(){
    for(let y = 0;y < grid.length;y++){
        for(let x = 0;x < grid[y].length;x++){
            if(isNaN(grid[y][x])){
                let z = grid[y][x];
                switch(z){
                    case "I":
                        ctx.fillStyle = "cyan";
                        ctx.fillRect(x*scale,y*scale,scale,scale);
                        break;
                    case "O":
                        ctx.fillStyle = "yellow";
                        ctx.fillRect(x*scale,y*scale,scale,scale);
                        break;
                    case "T": 
                        ctx.fillStyle = "purple";
                        ctx.fillRect(x*scale,y*scale,scale,scale);
                        break;       
                    case "S":
                        ctx.fillStyle = "lime";
                        ctx.fillRect(x*scale,y*scale,scale,scale);
                        break;
                    case "Z":
                        ctx.fillStyle = "red";
                        ctx.fillRect(x*scale,y*scale,scale,scale);
                        break;
                    case "J":
                        ctx.fillStyle = "blue";
                        ctx.fillRect(x*scale,y*scale,scale,scale);
                        break;
                    case "L":
                        ctx.fillStyle = "orange";
                        ctx.fillRect(x*scale,y*scale,scale,scale);
                        break;
                }
            }
            else{
                ctx.fillStyle = "#252525";
                ctx.fillRect(x*scale,y*scale,scale,scale);
                ctx.fillStyle = "black";
                ctx.fillRect(x*scale,y*scale,scale-1,scale-1);
            }
        };
    };
}

block = new Block;


async function startGame(){
    while(block.center[1]<20){
        grid[block.center[1]][block.center[0]] = "I";
        draw();
        grid[block.center[1]][block.center[0]] = 0;
        block.center[1] += 1;
        await sleep(300);
    }
}

startGame();