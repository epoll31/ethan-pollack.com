

const polys = {
    polys: [],
    at: (i) => {
        return polys.polys[i];
    },
    gen: (x, y, numSides, radius, variance) => {
        
        let per = (2 * Math.PI) / numSides;
        let points = [];
        for (let i = 0; i < numSides; i++) {
            let min = per * i;
            let max = per * (i + 1);
            let a = Math.random() * (max - min) + min;
            let r = radius + variance * (Math.random() - 0.5);

            points.push({x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
        }
        
        polys.polys.push({
            points: points,
            fillColor: 'transparent',//'#C16E70',
            borderColor: '#C16E70',
            borderWidth: 3,
            centerColor: '#B15E60',
            drawBounds: true,
        });
    },

    draw: (ctx) => {
        for(let i = 0; i < polys.polys.length; i++) {
            polys.drawPoly(polys.at(i), ctx);
        };
    },  
    drawPoly: (poly, ctx) => {
        ctx.fillStyle = poly.fillColor;
        ctx.strokeStyle = poly.borderColor;
        ctx.lineWidth = poly.borderWidth;
        ctx.beginPath();
        for (let i = 0; i < poly.points.length; i++) {
            ctx.lineTo(poly.points[i].x, poly.points[i].y);
        }
        ctx.lineTo(poly.points[0].x, poly.points[0].y);
        ctx.fill();
        ctx.stroke();

        if (poly.centerColor !== 'transparent') {
            let c = polys.center(poly);

            ctx.strokeStyle = poly.strokeStyle;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(c.x, c.y, 3, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (poly.drawBounds) {
            let b = polys.bounds(poly);

            ctx.strokeStyle = poly.strokeStyle;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.rect(b.x, b.y, b.width, b.height);
            ctx.stroke();
        }
    },
    rotate: (poly, theta) => {
        //let poly = polys.polys[index];
        let center = polys.center(poly);
        for (let i = 0; i < poly.points.length; i++) {
            let dx = center.x - poly.points[i].x;
            let dy = center.y - poly.points[i].y;
            let angle = Math.atan2(-dy, -dx);
            let dist = Math.sqrt(dx * dx + dy * dy);
            poly.points[i].x = center.x + dist * Math.cos(angle + theta);
            poly.points[i].y = center.y + dist * Math.sin(angle + theta);
        }
    },
    center: (poly) => {
        //return polys.bounds(poly).center;
        
        let x = 0;
        let y = 0;
        for (let i = 0; i < poly.points.length; i++) {
            x += poly.points[i].x;
            y += poly.points[i].y;
        }
        x /= poly.points.length;
        y /= poly.points.length;
        return {x: x, y: y};
    },
    bounds: (poly) => {
        let b = {
            left: poly.points[0].x, 
            right: poly.points[0].x, 
            top: poly.points[0].y, 
            bottom: poly.points[0].y };

        for (let i = 1; i < poly.points.length; i++) {
            b.left = Math.min(b.left, poly.points[i].x);
            b.right = Math.max(b.right, poly.points[i].x);
            b.top = Math.min(b.top, poly.points[i].y);
            b.bottom = Math.max(b.bottom, poly.points[i].y);
        }

        b.width = b.right - b.left;
        b.height = b.bottom - b.top;
        b.x = b.left;
        b.y = b.top;
        b.center = {
            x: (b.left + b.right) / 2,
            y: (b.top + b.bottom) / 2
        };

        return b;
    }
}

step = 0;



window.onload = () => {
    polys.gen(200, 200, 5, 100, 90);

    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
};

loop = () => {
    //update

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    polys.rotate(polys.at(0), Math.PI / 200);

    // draw
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    polys.draw(this.ctx);
    
    step++;
    requestAnimationFrame(loop);
};
requestAnimationFrame(loop);