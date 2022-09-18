
size = 500;
tileSize = this.size / 10;

mouse = { x: 0, y: 0 };
keyboard = { curr: null, prev: null };

direction = 'up';
parts = [[this.size / 2, this.size / 2]];
food = [1, 1];

snake_init = () => {
    div = document.getElementById('snake');
    game = div.getElementsByClassName('game')[0];
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
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
    };
    window.onkeyup = (e) => {
        keyboard.prev = e.key;
        keyboard.curr = null;
    };

    update();
};

update = () => {
    
    //update
    for (let i = parts.length - 1; i > 0; i--) {
        let dx = parts[i - 1][0] - parts[i][0];
        let dy = parts[i - 1][1] - parts[i][1];

        if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) <= tileSize) {
            continue;
        }

        parts[i][0] += dx * dt;
        parts[i][1] += dy * dt;
    }

    let dx = Math.sign(mouse.x - parts[0][0]);
    let dy = Math.sign(mouse.y - parts[0][1]);

    parts[0][0] += dx;
    parts[0][1] += dy;

    // draw
    refreshChildren(); 

    //set variables for next update
    prevGameTime = gametime;
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
        console.log(i + ': ' + parts[i]);
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