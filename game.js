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

function transposeArray(array, arrayLength){
    var newArray = [];
    for(var i = 0; i < array.length; i++){
        newArray.push([]);
    };
    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };
    return newArray;
}

const tetromino = [
{type:"I",grid:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],color:"cyan",center:{x:1.5,y:1.5}},
// {type:"O",grid:[[0,1,1,0],[0,1,1,0],[0,0,0,0]],color:"yellow",center:{x:1.5,y:0.5}},
// {type:"T",grid:[[0,1,0],[1,1,1],[0,0,0]],color:"purple",center:{x:1,y:1}},
// {type:"S",grid:[[0,1,1],[1,1,0],[0,0,0]],color:"lime",center:{x:1,y:1}},
// {type:"Z",grid:[[1,1,0],[0,1,1],[0,0,0]],color:"red",center:{x:1,y:1}},
// {type:"J",grid:[[1,0,0],[1,1,1],[0,0,0]],color:"blue",center:{x:1,y:1}},
// {type:"L",grid:[[0,0,1],[1,1,1],[0,0,0]],color:"orange",center:{x:1,y:1}},
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

function getSolid(array){
    for(let y = 0;y<array.length;y++){
        function checkZero(x){
            return x == 0;
        }
        let empty = array[y].every(checkZero);
        if(empty==1){
            array.splice(y,1);
            y--;
        }
    }
    {
        let sum = 0;
        for(let y in array){
            sum += array[y][0];
        }
        if(sum===0){
            for(let y in array){
                array[y].shift();
            }
        }
        sum = 0;
        for(let y in array){
            sum += array[y][array[y].length-1];
        }
        if(sum == 0){
            for(let y in array){
                array[y].pop();
            }
        }
    }
    return array;
}


class Block {
    constructor(){
        addQueue();
        this.tetromino = queue.shift();
        this.center = this.tetromino.center;
        this.position = {x:4.5,y:0}
        this.type = this.tetromino.type;
        this.grid = [...this.tetromino.grid];
        this.rotation = 0;
        this.locked = false;
        this.solid = [...this.grid];
        this.solid = getSolid(this.solid);
        if(this.type=="O"){
            this.position.x = 5.5;
        }
    }
    move(dir){
        switch(dir){
            case "left":
                block.position.x-=(Math.floor(block.position.x)>1);
                console.log(block.position.x);
                break;
            case "right":
                // (Math.floor(block.position.x)-block.solid[0].length>0);
                block.position.x+=(Math.floor(block.position.x)+block.solid[0].length<=10);
                break;
            case "down":
                block.position.y++;
                break;
        }
    }
    rotate(dir){
        switch(dir){
            case "cw":
                this.grid = transposeArray(this.grid,this.grid.length);
                for(let y = 0;y<this.grid.length;y++){
                    this.grid[y].reverse();
                }
                this.rotation+=90;
                break;
            case "ccw":
                for(let y = 0;y<this.grid.length;y++){
                    this.grid[y].reverse();
                }
                this.grid = transposeArray(this.grid,this.grid.length);
                this.rotation-=90;
                break;
        }
        if(this.rotation==360){
            this.rotation=0;
        }
        this.solid = [...this.grid];
        this.solid = getSolid(this.solid,this.solid.length);
    }
    drop(){}
    draw(){
        this.solid.forEach((element,index) => {
            element.forEach((element2,index2) => {
                try{
                    if((grid[block.position.y+index+1][Math.floor(block.position.x)+index2-1].locked)&&(element2==1)){
                        block.locked=1;
                    }
                }
                catch{
                    block.locked=1;
                }
            })
        });
        for(let y=0;y<block.solid.length;y++){
            for(let x=0;x<block.solid[y].length;x++){
                switch(block.solid[y][x]){
                    case 1:
                        try{
                            if(grid[parseInt(block.position.y)+parseInt(y)][Math.floor(block.position.x)+parseInt(x)-1].type!=""){
                                grid[parseInt(block.position.y)+parseInt(y)][Math.floor(block.position.x)+parseInt(x)-1].locked=1;
                                block.locked=1;
                                break;
                            }
                            else{
                                grid[parseInt(block.position.y)+parseInt(y)][Math.floor(block.position.x)+parseInt(x)-1].type=block.type;
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
        if(!block.locked){
            for(let y=0;y<block.solid.length;y++){
                for(let x=0;x<block.solid[y].length;x++){
                    switch(block.solid[y][x]){
                        case 1:
                            try{
                                grid[parseInt(block.position.y)+parseInt(y)][Math.floor(block.position.x)+parseInt(x)-1].type="";
                            }
                            finally{
                                break;
                            }
                    }
                }
            }
        }
    }
}

var grid = [
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
    [{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0},{type:"",locked:0}],
]

function draw(){
    block.draw();
    for(y in grid){
        for(x in grid[y]){
            switch(grid[y][x].type){
                case "I": ctx.fillStyle = "cyan"; ctx.fillRect(x*scale,y*scale,scale,scale); break;
                case "O": ctx.fillStyle = "yellow"; ctx.fillRect(x*scale,y*scale,scale,scale); break;
                case "T": ctx.fillStyle = "purple"; ctx.fillRect(x*scale,y*scale,scale,scale); break;
                case "S": ctx.fillStyle = "lime"; ctx.fillRect(x*scale,y*scale,scale,scale); break;
                case "Z": ctx.fillStyle = "red"; ctx.fillRect(x*scale,y*scale,scale,scale); break;
                case "J": ctx.fillStyle = "blue"; ctx.fillRect(x*scale,y*scale,scale,scale); break;
                case "L": ctx.fillStyle = "orange"; ctx.fillRect(x*scale,y*scale,scale,scale); break;
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
            block.rotate("cw");
            break;
        case "a":
        case "ArrowLeft":
            block.move("left");
            break;
        case "s": 
        case "ArrowDown":
            speed = 70;
            break;
        case "d": 
        case "ArrowRight":
            block.move("right");
            break;
        case " ":
            block.drop();
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

async function startGame(){
    while(!block.locked){
        await sleep(speed);
        draw();
        if((!block.locked)&&(block.position.y+block.solid.length<20)){
            block.move("down");
        }
        else{
            block.locked=1;
        }
    }
    draw();
    block = new Block;
    startGame();
}

startGame();