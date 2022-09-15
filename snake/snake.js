
window.onload = () => {
    this.div = document.getElementById('snake');
    this.game = div.getElementsByClassName('game')[0];

    game.appendChild(document.createElement('div'));


    this.snake = [ [5,5] ];

    update();
};


update = (gametime) => {  
    
    createSnakeDivs();
    window.requestAnimationFrame(update);    
};

createSnakeDivs = () => {
    game.innerHTML = "";

    for (let i = 0; i < snake.length; i++) {
        var tile = document.createElement('div');
        tile.style.gridColumn = snake[i][0];
        tile.style.gridRow = snake[i][1];
        game.appendChild(tile);
    }
};