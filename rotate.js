var grid = [];
for(var i = 0; i < 20; i++){
    grid.push([]);
    for(var j = 0; j < 10; j++){
        grid[i].push({type:"",locked:0});
    }
};
console.log(grid);