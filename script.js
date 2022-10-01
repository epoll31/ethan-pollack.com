
import {pageManager} from "./pageManager";

this.toggleFrame = (url) => {
    let frame = document.getElementById('frame');
    let header = document.getElementById('header');
    let bg = document.getElementById('background');

    if (url != undefined) {
        bg.classList.add('blur');
        frame.classList.remove('noheader');
        header.classList.remove('nodisp');

        frame.src = url;
    }
    else {
        
        frame.classList.add('noheader');
        bg.classList.remove('blur');
        header.classList.add('nodisp');

        frame.data = 'pages/main.html';
        frame.contentWindow.toggleFrame = toggleFrame;

        document.getElementById('targetFrame').contentWindow.targetFunction();
    }
};

window.onload = () => {
    console.log('hit');
    //pageManager.init(document.getElementById('frame'));
    //pageManager.setPage(homePage);
};

