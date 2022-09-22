
size = 500;
tileCount = 20;
tileSize = this.size / 20;

mouse = { x: 0, y: 0 };
keyboard = { curr: null, prev: null };

direction = 'up';
speed = 2;
parts = [[this.size / 2, this.size / 2]];
partsToAdd = 10;
food = [1, 1];

snake_init = () => {
    div = document.getElementById('snake');

    game = div.getElementsByClassName('game')[0];
    for (let i = 1; i <= tileCount; i++) {
        for (let j = 1; j <= tileCount; j++) {
            let tile = document.createElement('div')
            tile.classList.add('tile');
            tile.style.gridRow = i.toString();
            tile.style.gridColumn = j.toString();
            game.appendChild(tile);
        }
    }

    window.onmousemove = (e) => {
        let bounds = game.getBoundingClientRect();
        mouse.x = e.clientX - bounds.left;
        mouse.y = e.clientY - bounds.top;
    };
    window.onkeydown = (e) => {
        keyboard.curr = e.key;
        keyboard.prev = null;

        console.log(e);
        switch (e.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;

        }
    };
    window.onkeyup = (e) => {
        keyboard.prev = e.key;
        keyboard.curr = null;
    };

    for (; partsToAdd > 0; partsToAdd--) {
        parts.push(parts[parts.length - 1].slice(0));
    }

    update();
};

update = () => {

    //update
    for (let i = parts.length - 1; i > 0; i--) {
        let dx = parts[i - 1][0] - parts[i][0];
        let dy = parts[i - 1][1] - parts[i][1];

        if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) <= tileSize ) {
            continue;
        }

        parts[i][0] += Math.sign(dx) * speed;
        parts[i][1] += Math.sign(dy) * speed;
    }
    switch (direction) {
        case 'up':
            if (parts[0][0] >= speed + tileSize) {
                parts[0][0] -= speed;
            }
            break;
        case 'down':
            if (parts[0][0] <= size - speed) {
                parts[0][0] += speed;
            }
            break;
        case 'left':
            if (parts[0][1] >= speed+ tileSize) {
                parts[0][1] -= speed;
            }
            break;
        case 'right':
            if (parts[0][1] <= size - speed) {
                parts[0][1] += speed;
            }
            break;

    }

    if (Math.floor(parts[0][0] / tileSize) == food[0] 
     && Math.floor(parts[0][1] / tileSize) == food[1])  {
        
     }
 
    // draw
    refreshChildren();

    //set variables for next update
    keyboard.prev = keyboard.curr;

    //request new frame
    window.requestAnimationFrame(update);
};

refreshChildren = () => {

    let indices = [];
    for (let i = 0; i < parts.length; i++) {
        indices.push([
            Math.floor(parts[i][0] / tileSize),
            Math.floor(parts[i][1] / tileSize),
            i == 0 ? 'head' : i == (parts.length - 1) ? 'tail' : 'body']);
    }

    let tiles = document.getElementsByClassName('tile');
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].classList.remove('head', 'body', 'tail');
        let x = parseInt(tiles[i].style.gridRow);
        let y = parseInt(tiles[i].style.gridColumn);

        for (let j = 0; j < indices.length; j++) {
            if (indices[j][0] == x && indices[j][1] == y) {
                tiles[i].classList.add(indices[j][2]);
            }
        }

        if (tiles[i].classList.contains('food')) {
            tiles[i].classList.remove('food');
        }
        if (food[0] == x && food[1] == y) {
            tiles[i].classList.add('food');
        }
    }
};