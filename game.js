// CANVAS SETUP
canvas = document.querySelector('.canvas')
var ctx = canvas.getContext('2d');
ctx.scale(30,30);

hCanvas = document.querySelector('.hold-canvas')
var hctx = hCanvas.getContext('2d');

nCanvas = document.querySelector('.next-canvas')
var nctx = nCanvas.getContext('2d');

var level = 1;
var speed = 250;
var normalSpeed = 250;
var hyperSpeed = 50;
var paused = 0;

var score = 0;
var totalLines = 0;
var holding = null;
var xoffset = 1;
var yoffset = 1;

var pauseCountDownRunning = 0;
var nextCanvasInit = 0;

//Sprites

let redBlock = document.getElementById("red");
let blueBlock = document.getElementById("blue");
let purpleBlock = document.getElementById("purple");
let cyanBlock = document.getElementById("cyan");
let greenBlock = document.getElementById("green");
let orangeBlock = document.getElementById("orange");
let yellowBlock = document.getElementById("yellow");
let emptyBlock = document.getElementById("empty");
let greyBlock = document.getElementById("grey");


ctx.imageSmoothingEnabled = false;
hctx.imageSmoothingEnabled = false;
nctx.imageSmoothingEnabled = false;


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

function transposeArray(array){
    var newArray = [];
    for(var i = 0; i < array[0].length; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < array[0].length; j++){
            newArray[j].push(array[i][j]);
        };
    };

    return newArray;
}

// Keyboard input with customisable repeat (set to 0 for no key repeat)
//
function KeyboardController(keys, repeat) {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers= {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    };
};

const tetromino = [
{type:"I",grid:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],effgrid:[["I","I","I","I"]]},
{type:"O",grid:[[1,1],[1,1]],effgrid:[["O","O"],["O","O"]]},
{type:"T",grid:[[0,1,0],[1,1,1],[0,0,0]],effgrid:[[0,"T",0],["T","T","T"]]},
{type:"S",grid:[[0,1,1],[1,1,0],[0,0,0]],effgrid:[[0,"S","S"],["S","S",0]]},
{type:"Z",grid:[[1,1,0],[0,1,1],[0,0,0]],effgrid:[["Z","Z",0],[0,"Z","Z"]]},
{type:"J",grid:[[1,0,0],[1,1,1],[0,0,0]],effgrid:[["J",0,0],["J","J","J"]]},
{type:"L",grid:[[0,0,1],[1,1,1],[0,0,0]],effgrid:[[0,0,"L"],["L","L","L"]]},
];

var queue = [];

function addQueue(){
    if(queue.length<=7){
        shuffle(tetromino);
        for(let x = 0;x<tetromino.length;x++){
            queue.push(tetromino[x]);
        }
    }
}


class Block {
    constructor(){
        addQueue();
        this.tetromino = queue.shift();
        this.type = this.tetromino.type;
        this.pos = {x:4.5,y:0}
        this.grid = [...this.tetromino.grid];
        this.locked = 0;
        this.swapped = 0;
        if(this.type=="I"){
            this.pos.x = 3.5;
        }
    };
    addToGrid(type){
        this.grid.forEach((row,y)=>{
            row.forEach((item,x)=>{
                if(item == 1){
                    grid[this.pos.y+y][Math.floor(this.pos.x)+x].type=type;
                };
            });
        });
    };
    collide(){
        let c = 0;
        this.grid.forEach((row,y)=>{
            row.forEach((item,x)=>{
                try{
                    if(item == 1&&grid[this.pos.y+y][Math.floor(this.pos.x)+x].type!==""){
                        c = 1;
                    };
                }
                catch{
                    c = 1;
                }
            });
        });
        return c;
    };
    drop(){
        while(this.collide()==0){
            this.move(0,1);
        }
    };
    hold(){
        if(this.swapped == 0){
            this.swapped=1;
            if(holding == null){
                block.pos = {x:4.5,y:0};
                holding = block;
                block = new Block;
            }
            else{
                block.pos = {x:4.5,y:0};
                [block,holding] = [holding,block];                
            }
        }
        updateHoldCanvas();
    }
    move(x,y){
        if(this.locked==0){
            this.pos.y+=y;
            this.pos.x+=x;
            if(this.collide()==1){
                this.pos.y-=y;
                this.pos.x-=x;
                if(x == 0){
                    this.locked=1;
                }
            };
            updateCanvas();
        };
    };
    rotate(dir){
        let pos = this.pos.x;
        if(this.locked==0){
            switch(dir){
                case "cw":
                    this.grid = transposeArray(this.grid);
                    this.grid.forEach(arr => {arr.reverse()});
                    if(this.collide()==1){
                        let i = -1;
                        for(let n=0;n<4;n++){
                            this.pos.x+=i;
                            if(this.collide()==1){
                                i > 0 ? i = -(Math.abs(i)+1) : i = Math.abs(i)+1;
                            }
                            else{
                                break;
                            }
                        }
                    }
                    if(this.collide()==1){
                        this.pos.x=pos;
                        this.grid.forEach(arr => {arr.reverse()});
                        this.grid = transposeArray(this.grid);
                    }
                    break;
                case "ccw":
            }
            updateCanvas();
        }
    }
}

var brightness = 1;
function animateLineClear(array){
    ctx.filter = `brightness(${brightness})`;
    array.forEach(y =>{
        grid[y].forEach((item,x) =>{
            switch(item.type){
                case "I": ctx.drawImage(cyanBlock,x,y,1,1); break;
                case "O": ctx.drawImage(yellowBlock,x,y,1,1); break;
                case "T": ctx.drawImage(purpleBlock,x,y,1,1); break;
                case "S": ctx.drawImage(redBlock,x,y,1,1); break;
                case "Z": ctx.drawImage(greenBlock,x,y,1,1); break;
                case "J": ctx.drawImage(blueBlock,x,y,1,1); break;
                case "L": ctx.drawImage(orangeBlock,x,y,1,1); break;
                case "": ctx.drawImage(emptyBlock,x,y,1,1); break;
            };
        });
    });
    if(brightness<5){
        brightness+=0.1;
        animateLineClear(array);
    }
}

function clearLines(){
    brightness = 1;
    let lines=0; 
    let clear = [];
    grid.forEach((row,y)=>{
        if(row.some(x => x.type === "")==0){
            clear.push(y);
        }
    });
    if(clear.length>0){
        animateLineClear(clear);
    }
    ctx.filter = "none";
    for(let y=0;y<grid.length;y++){
        let total = 0;
        for(let x in grid[y]){
            total += grid[y][x].type==="";
        }
        if(total==0){
            lines += 1;
            grid.splice(y,1);
            grid.unshift([{type:""},{type:""},{type:""},{type:""},{type:""},{type:""},{type:""},{type:""},{type:""},{type:""}]);
            y--;
        }
    }
    totalLines += lines;
    score += ((lines ** 2)*100)*level;
    updateScores();
    return lines;
}

const grid = new Array(20)
for (let i = 0; i < 20; i++) {
    grid[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
        grid[i][j] = {type:""};
    }
}



function draw(grid,context,scale,xoff,yoff){
    grid.forEach((row,y)=>{
        row.forEach((cell,x)=>{
            let item;
            if(cell.type==undefined){
                item = cell;
            }
            else{
                item = cell.type;
            }
            switch(item){
                case "I": context.drawImage(cyanBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
                case "O": context.drawImage(yellowBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
                case "T": context.drawImage(purpleBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
                case "S": context.drawImage(redBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
                case "Z": context.drawImage(greenBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
                case "J": context.drawImage(blueBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
                case "L": context.drawImage(orangeBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
                case "": context.drawImage(emptyBlock,(x*scale)+xoff,(y*scale)+yoff,scale,scale); break;
            };
        });
    });
};

function updateCanvas(){
    block.addToGrid(block.type);
    draw(grid,ctx,1,0,0);
    if(block.locked==0){
        block.addToGrid("");
    }
}


function updateHoldCanvas(){
    resetCanvas(hctx,hCanvas);
    let height = holding.tetromino.effgrid.length;
    let width = holding.tetromino.effgrid[0].length;
    draw(holding.tetromino.effgrid,hctx,30,((120-(width*30))/2)+10,((90-(height*30))/2));
}

function updateNextCanvas(){
    resetCanvas(nctx,nCanvas);
    let height1 = queue[0].effgrid.length;
    let width1 = queue[0].effgrid[0].length;
    let height2 = queue[1].effgrid.length;
    let width2 = queue[1].effgrid[0].length;
    let height3 = queue[2].effgrid.length;
    let width3 = queue[2].effgrid[0].length;
    draw(queue[0].effgrid,nctx,30,((120-(width1*30))/2)+10,((90-(height1*30))/2));
    draw(queue[1].effgrid,nctx,30,((120-(width2*30))/2)+10,((90-(height2*30))/2)+90);
    draw(queue[2].effgrid,nctx,30,((120-(width3*30))/2)+10,((90-(height3*30))/2)+180);
}

function resetCanvas(context,canvas){
    context.fillstyle="black";
    context.fillRect(0,0,canvas.width,canvas.height);
}

var pressed = 0;
var handleKeyDown = function (event){
    keyValue = event.key;
    switch(keyValue){
        case "w": 
        case "ArrowUp":
            if(!paused&&pressed==0){
                block.rotate("cw");
                pressed = 1;
            }
            break;
        case " ":
            if(!paused){
                block.drop();
            }
            break;
        case "p":
            if(pauseCountDownRunning==0){
                if(paused){
                    pauseCountDownRunning = 1;
                    document.querySelector(".paused p").style.display = "none";
                    document.querySelector(".paused h1").innerHTML = "3"
                    setTimeout(function(){document.querySelector(".paused h1").innerHTML = "2";}, 1000);
                    setTimeout(function(){document.querySelector(".paused h1").innerHTML = "1";}, 2000);
                    setTimeout(function(){
                        document.querySelector(".paused").style.display = "none";
                        document.querySelector(".canvas").style.filter = "brightness(1)";
                        paused = !paused;
                        pauseCountDownRunning = 0;
                    }, 3000);
                }
                else{
                    pauseCountDownRunning = 1;
                    document.querySelector(".paused h1").innerHTML = "Game <br> paused"
                    document.querySelector(".paused").style.display = "inline";
                    document.querySelector(".paused p").style.display = "inline";
                    document.querySelector(".canvas").style.filter = "brightness(0.5)"
                    paused = !paused;
                    pauseCountDownRunning = 0;
                }
            }
            break;
        case "c":
            if(!paused){
                block.hold();
            }
            break;
    };
};

var handleKeyUp = function (event){
    keyValue = event.key;
    switch(keyValue){
        case "w": 
        case "ArrowUp":
            pressed = 0;
            break;
        case "s":
        case "ArrowDown":
            speed = normalSpeed;
            break;
        
    }
};  

window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

KeyboardController({
    37: function(){if(!paused){block.move(-1,0)}},
    65: function(){if(!paused){block.move(-1,0)}},
    39: function(){if(!paused){block.move(1,0)}},
    68: function(){if(!paused){block.move(1,0)}},
    40: function(){if(!paused){speed=hyperSpeed}},
    83: function(){if(!paused){speed=hyperSpeed}}
}, 110);



function updateScores(){
    level = 1+Math.floor(totalLines/25);
    normalSpeed = 100 + Math.max(0,(170 - level*20));
    speed = normalSpeed;
    document.querySelector(".score").innerHTML = `Score: ${score}`;
    document.querySelector(".level").innerHTML = `Level: ${level}`
    document.querySelector(".lines").innerHTML = `Lines: ${totalLines}`
}

function resetGameVariables(){
    for(let i = 0; i < 20; i++){
        grid[i] = new Array(10);
        for (let j = 0; j < 10; j++){
            grid[i][j] = {type:""}
        }
    }
    score = 0;
    totalLines = 0;
    holding = null;
    nextCanvasInit = 0;
    queue = [];
    resetCanvas(hctx,hCanvas);
    updateScores();
}

async function startGame(){
    while(!block.locked){
        await sleep(speed);
        if(!paused){
            block.move(0,1);
            if(nextCanvasInit==0){
                updateNextCanvas();
                nextCanvasInit=1;
            }
        }
    }
    resetGame();
}

function resetGame(){
    let timeout = 0;
    if(clearLines()>0){
        timeout = 150;
    }
    setTimeout(() => {
        block = new Block;
        updateNextCanvas();
        updateScores();
        if(block.collide()==1){
            alert("GAME OVER");
            resetGameVariables();
            resetGame();
        }
        else{
            updateCanvas();
            startGame();
        }
    }, timeout);    
}

resetGame();