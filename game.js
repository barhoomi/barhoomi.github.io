// CANVAS SETUP
canvas = document.querySelector('.canvas')
var ctx = canvas.getContext('2d');
var scale = 30;
var speed = 140;
var score = 0;
var totallines = 0;
var paused = 0;

var yoff = 0;
var xoff = 0;


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

function checkZero(x){
    return (x == 0);
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

const tetromino = [
{type:"I",grid:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],center:{x:1.5,y:1.5}},
// {type:"O",grid:[[1,1],[1,1]],center:{x:0.5,y:0.5}},
// {type:"T",grid:[[0,1,0],[1,1,1],[0,0,0]],center:{x:1,y:1}},
// {type:"S",grid:[[0,1,1],[1,1,0],[0,0,0]],center:{x:1,y:1}},
// {type:"Z",grid:[[1,1,0],[0,1,1],[0,0,0]],center:{x:1,y:1}},
// {type:"J",grid:[[1,0,0],[1,1,1],[0,0,0]],center:{x:1,y:1}},
// {type:"L",grid:[[0,0,1],[1,1,1],[0,0,0]],center:{x:1,y:1}},
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
        this.center = this.tetromino.center;
        this.position = {x:4.5,y:0}
        this.grid = [...this.tetromino.grid];
        this.locked = false;
        this.solid = this.getSolid([...this.grid]);
        if(this.type=="O"){
            this.position.x = 5.5;
        }
        this.holding = 0;
    }
    move(dir){
        switch(dir){
            case "left":
                let validL = 1;
                for(let y=0;y<this.solid.length;y++){
                    for(let x=0;x<this.solid[y].length;x++){
                        try{
                            if(grid[this.position.y+y][Math.floor(this.position.x)+x-2].locked){
                                validL = 0;
                            }
                        }
                        catch{
                            validL = 0;
                        }
                    }
                }
                this.position.x-=validL;
                break;
            case "right":
                let validR = 1;
                for(let y=0;y<this.solid.length;y++){
                    for(let x=0;x<this.solid[y].length;x++){
                        try{
                            if(grid[this.position.y+y][Math.floor(this.position.x)+x].locked){
                                validR = 0;
                            }
                        }
                        catch{
                            validR = 0;
                        }
                    }
                }
                this.position.x+=validR;
                break;
            case "down":
                this.position.y++;
                break;
        }
    }
    rotate(dir){
        switch(dir){
            case "cw":
                let validCW = 1;
                let newgrid = transposeArray([...this.grid]);
                for(let y = 0;y<newgrid.length;y++){
                    newgrid[y]=newgrid[y].reverse();
                }
                let newsolid = this.getSolid([...newgrid]);
                for(let y=0;y<newsolid.length;y++){
                    for(let x=0;x<newsolid[y].length;x++){
                        try{
                            if(grid[this.position.y+y][Math.floor(this.position.x-this.center.x+x)].locked){
                                validCW=0;
                            }
                        }
                        catch{
                            validCW=0;
                        }
                    }
                }
                if(validCW==1){
                    this.grid = [...newgrid];
                    this.solid = [...newsolid];
                }
                else{
                    this.solid = this.getSolid([...this.grid])
                }
                break;
            case "ccw":
                break;
        }
    }
    drop(){
        while(this.locked==0){
            this.solid.forEach((element,index) => {
                element.forEach((element2,index2) => {
                    try{
                        if((grid[this.position.y+index+1][Math.floor(this.position.x)+index2-1].locked)&&(element2==1)){
                            this.locked=1;
                        }
                    }
                    catch{
                        this.locked=1;
                    }
                })
            });
            if(this.locked==0){
                block.move("down");
            }
        }
    }
    hold(){
        if((this.holding==0)&&(held.holding==0)){
            switch(holding){
                case 1:
                    let temp = block;
                    block = held;
                    held = temp;
                    held.position = {x:4.5,y:0};
                    break;
                case 0:
                    held = block;
                    held.position = {x:4.5,y:0};
                    block = new Block;
                    holding = 1;
                    break;
            }
            this.holding=1;
            held.holding=1;
        }
    }
    draw(){
        this.solid.forEach((element,index) => {
            element.forEach((element2,index2) => {
                try{
                    if((grid[this.position.y+index+1][Math.floor(this.position.x)+index2-1].locked)&&(element2==1)){
                        this.locked=1;
                    }
                }
                catch{
                    this.locked=1;
                }
            })
        });
        for(let y=0;y<this.solid.length;y++){
            for(let x=0;x<this.solid[y].length;x++){
                switch(this.solid[y][x]){
                    case 1:
                        try{
                            if(grid[parseInt(this.position.y)+parseInt(y)][Math.floor(this.position.x)+parseInt(x)-1].type!=""){
                                grid[parseInt(this.position.y)+parseInt(y)][Math.floor(this.position.x)+parseInt(x)-1].locked=1;
                                this.locked=1;
                                break;
                            }
                            else{
                                grid[parseInt(this.position.y)+parseInt(y)][Math.floor(this.position.x)+parseInt(x)-1].type=this.type;
                            }
                        }
                        finally{
                            break;
                        }
                }
            }
        }
    }
    undraw(){
        if(!this.locked){
            for(let y=0;y<this.solid.length;y++){
                for(let x=0;x<this.solid[y].length;x++){
                    switch(this.solid[y][x]){
                        case 1:
                            try{
                                grid[parseInt(this.position.y)+parseInt(y)][Math.floor(this.position.x)+parseInt(x)-1].type="";
                            }
                            finally{
                                break;
                            }
                    }
                }
            }
        }
    }
    getSolid(array){

        if(xoff!=undefined&&(this.position.y!=0)){
            this.position.x-=xoff;
        }
        if(yoff!=undefined&&(this.position.y!=0)){
            this.position.y-=yoff;
        }

        let yabove = 0;
        let ybelow = 0;
        let xleft = 0;
        let xright = 0;

        yoff = 0;
        xoff = 0;
        for(let y = 0;y<array.length;y++){
            let empty = array[y].every(checkZero);
            if(empty){
                if(y>this.center.y){
                    ybelow++;
                }
                else if(y<this.center.y){
                    yabove++;
                }
            }
        }
        array = transposeArray(array);
        for(let y = 0;y<array.length;y++){
            let empty = array[y].every(checkZero);
            if(empty){
                if(y>this.center.x){
                    xright++;
                }
                else if(y<this.center.x){
                    xleft++;
                }
            }
        }
        array = transposeArray(array);

        for(let y = 0;y<array.length;y++){
            let empty = array[y].every(checkZero);
            array.splice(y,empty);
            y-=empty;
        }
        array = transposeArray(array);
        for(let y = 0;y<array.length;y++){
            let empty = array[y].every(checkZero);
            array.splice(y,empty);
            y-=empty;
        }
        array = transposeArray(array);

        (yabove>ybelow)&&(ybelow>0)?yoff = ybelow - yabove:0;
        (xright>xleft)? (xleft>0)? xoff = xright-xleft : xoff = xright-xleft-1 : 0;
        (xleft>xright)? (xright>0)? xoff = xleft-xright+1 : xoff = xleft-xright : 0; 

        this.position.y+=yoff;
        this.position.x+=xoff;

        return array;
    }
}

var grid = Array(20).fill(Array(10).fill({type:"",locked:0}));

function draw(){
    block.draw();
    for(y in grid){
        for(x in grid[y]){
            ctx.strokeStyle = "rgba(0,0,0,0.5)";
            switch(grid[y][x].type){
                case "I": ctx.fillStyle = "cyan"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); ctx.lineWidth = 1; ctx.strokeRect(x*scale,y*scale,scale,scale); break;
                case "O": ctx.fillStyle = "yellow"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); ctx.lineWidth = 1; ctx.strokeRect(x*scale,y*scale,scale,scale); break;
                case "T": ctx.fillStyle = "purple"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); ctx.lineWidth = 1; ctx.strokeRect(x*scale,y*scale,scale,scale); break;
                case "S": ctx.fillStyle = "lime"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); ctx.lineWidth = 1; ctx.strokeRect(x*scale,y*scale,scale,scale); break;
                case "Z": ctx.fillStyle = "red"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); ctx.lineWidth = 1; ctx.strokeRect(x*scale,y*scale,scale,scale); break;
                case "J": ctx.fillStyle = "blue"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); ctx.lineWidth = 1; ctx.strokeRect(x*scale,y*scale,scale,scale); break;
                case "L": ctx.fillStyle = "orange"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); ctx.lineWidth = 1; ctx.strokeRect(x*scale,y*scale,scale,scale); break;
                case "": ctx.fillStyle = "#252525"; ctx.fillRect(x*scale,y*scale,scale,scale); ctx.fillStyle = "black"; ctx.fillRect(x*scale,y*scale,scale-1,scale-1); break;
            };
        }
    };
    block.undraw();
};


var handleKeyDown = function (event){
    keyValue = event.key;
    switch(keyValue){
        case "w": 
        case "ArrowUp":
            if(!paused){
                block.rotate("cw");
            }
            break;
        case "a":
        case "ArrowLeft":
            if(!paused){
                block.move("left");
            }
            break;
        case "s": 
        case "ArrowDown":
            if(!paused){
                speed = 70;
            }
            break;
        case "d": 
        case "ArrowRight":
            if(!paused){
                block.move("right");
            }
            break;
        case " ":
            if(!paused){
                block.drop();
            }
            break;
        case "p":
            paused=!paused;
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
        case "s":
        case "ArrowDown":
            speed = 140;
            break;
    }
};  

function clearLines(){
    let lines=0; 
    for(let y=0;y<grid.length;y++){
        let total = 0;
        for(let x in grid[y]){
            total += grid[y][x].locked;
        }
        if(total==10){
            lines += 1;
            grid.splice(y,1);
            grid.unshift([{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}]);
            y--;
        }
    }
    totallines+=lines;
    score+=(lines**2)*10;
}


window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

block = new Block;
var holding = 0;
var held = block;

async function startGame(){
    while(!block.locked){
        await sleep(speed);
        if(!paused){
            draw();
            if((!block.locked)&&(block.position.y+block.solid.length<20)){
                block.move("down");
            }
            else{
                block.locked=1;
            }  
        }
    }
    draw();
    clearLines();
    block = new Block;
    held.holding=0;
    gameOver();
    startGame();
}

function gameOver(){
    for(i in grid[0]){
        if(grid[0][i].locked){
            alert(`Game Over | Score: ${score}`);
        }
    }
}

startGame();