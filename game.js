// CANVAS SETUP
canvas = document.querySelector('.canvas')
var ctx = canvas.getContext('2d');
var scale = 30;
var speed = 140;

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

var tetromino = [
{type:"I",grid:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],color:"cyan"},
{type:"O",grid:[[0,1,1,0],[0,1,1,0],[0,0,0,0]],color:"yellow"},
{type:"T",grid:[[0,1,0],[1,1,1],[0,0,0]],color:"purple"},
{type:"S",grid:[[0,1,1],[1,1,0],[0,0,0]],color:"lime"},
{type:"Z",grid:[[1,1,0],[0,1,1],[0,0,0]],color:"red"},
{type:"J",grid:[[1,0,0],[1,1,1],[0,0,0]],color:"blue"},
{type:"L",grid:[[0,0,1],[1,1,1],[0,0,0]],color:"orange"},
];
var queue = [];

function addQueue(){
    shuffle(tetromino);
    for(let x = 0;x<tetromino.length;x++){
        queue.push(tetromino[x]);
    }
}

class Block {
    constructor(){
        this.center = {x:4,y:1};
        this.rotation = 0;
        if(queue.length<=7){
            addQueue();
        }
        if(isNaN(grid[this.center.y][this.center.x])){
            resetGame();
        }
        this.tetromino = queue.shift();
        this.type = this.tetromino.type;
        this.grid = this.tetromino.grid;
        this.color = this.tetromino.color;
        this.locked = false;
    }
    moveDown(){
        drawBlock();
        draw();
        if(block.locked == true){
            block = new Block;
        }
        else{
            for(y = 0;y<block.grid.length;y++){
                for(x=0;x<block.grid[y].length;x++){
                    if(block.grid[y][x]==1){
                        grid[block.center.y+(y-1)][block.center.x+(x-1)]= 0;
                    }
                }
            }
            block.center.y += 1;
        }
    }
}

function drawBlock(){
    for(y = 0;y<block.grid.length;y++){
        for(x=0;x<block.grid[y].length;x++){
            if(block.grid[y][x]==1){
                grid[block.center.y+(y-1)][block.center.x+(x-1)]={};
                grid[block.center.y+(y-1)][block.center.x+(x-1)].type=block.type;  
                grid[block.center.y+(y-1)][block.center.x+(x-1)].locked=false;
            }
        }
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
    for(y = 0;y < grid.length;y++){
        for(x = 0;x < grid[y].length;x++){
            if(isNaN(grid[y][x])){
                let z = grid[y][x];
                switch(z.type){
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
};


var handleKeyDown = async function (event){
    keyValue = event.key;
    switch(keyValue){
        case "a":
        case "ArrowLeft":
            for(y = 0;y<block.grid.length;y++){
                for(x=0;x<block.grid[y].length;x++){
                    if(block.grid[y][x]==1){
                        // console.log(y,x)
                        // console.log("type: ",block.type," center: ",block.center.x," X: ",x)
                        if(block.center.x<=1){
                            if(isNaN(grid[block.center.y+(y-1)][block.center.x-x])||grid[block.center.y+(y-1)][block.center.x-x]==undefined){
                                break;
                            }
                        }
                        else{
                            block.center.x--;
                            break;
                        }
                    }
                }
                break;
            }
            break;
        case "s":
        case "ArrowDown":
            speed = 70;
            break;
        case "d":
        case "ArrowRight":
            for(y = 0;y<block.grid.length;y++){
                for(x=0;x<block.grid[y].length;x++){
                    if(block.grid[y][x]==1){
                        if(isNaN(grid[block.center.y+(y-1)][block.center.x+(x)])||grid[block.center.y+(y-1)][block.center.x+(x)]==undefined){
                            break;
                        }
                        else{
                            block.center.x++;
                            break;
                        }
                    }
                }
                break;
            }
            break;
        case " ":
            while(!block.locked){
                block.locked = (block.center.y==19||isNaN(grid[block.center.y+1][block.center.x]));
                block.center.y+= !(block.center.y==19||isNaN(grid[block.center.y+1][block.center.x]));
            }
            break;
    }
};  

var handleKeyUp = function (event){
    keyValue = event.key;
    switch(keyValue){
        case "s":
        case "ArrowDown":
            speed = 140;
            break;
    }
};  


window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

block = new Block;

function lockBlocks(){
    for(y = 0;y<block.grid.length;y++){
        for(x=0;x<block.grid[y].length;x++){
            if(block.grid[y][x]==1){
                grid[block.center.y+(y-1)][block.center.x+(x-1)]= block.type;  
                if(block.center.y<19){
                    if(isNaN(grid[block.center.y+(y)][block.center.x+(x-1)])){
                        block.locked=true;
                    }
                }
                else if(block.center.y==19){
                    block.locked=true;
                }              
            }
        }
    }

}

async function startGame(){
    while(block.center.y<20){
        draw();
        lockBlocks();
        block.moveDown();
        await sleep(speed);
    }
    block = new Block;
    startGame();
}

function resetGame(){
    alert("poopy")
}

startGame();