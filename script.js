
window.onload = () => {
    //this.snake_init();
    toggleFrame('pages/playground.html')
};

toggleFrame = (url) => {
    let main = document.getElementById('main');
    let frameContainer = document.getElementById('frame-container');
    let frame = document.getElementById('frame');
    let bg = document.getElementById('background');

    if (frameContainer.classList.contains('nodisp')
     && url != undefined ) {
        main.classList.add('nodisp');
        frameContainer.classList.remove('nodisp');
        bg.classList.add('blur');

        frame.src = url;
    }
    else {
        main.classList.remove('nodisp');
        frameContainer.classList.add('nodisp');
        bg.classList.remove('blur');
    }
};