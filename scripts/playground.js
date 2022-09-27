
const point = {
    make: (x, y) => {
        return {x: x, y: y};
    },
    equals: (p1, p2) => {
        return p1.x == p2.x && p1.y == p2.y;
    },
    magnitude: (p) => {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    },
    normal: (p) => {
        return point.make(-p.y, p.x);
    },
    normalize: (p) => {
        let mag = p.magnitude;
        return point.make(p.x / mag, p.y / mag);
    },
    dot: (p1, p2) => {
        return p1.x * p2.x + p1.y * p2.y;
    },
    project: (p, vector) => {
        let coef = point.dot(p, vector) / point.dot(vector, vector)
        return point.make(vector.x * coef, vector.y * coef);
    }
}

const line = {
    make: (p1, p2) => {
        return {p1: p1, p2:p2};
    },
    draw: (ctx, p1, p2, color = '#C16E70', width = 3) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        //console.log('x: ' + p1.x + ', ' + p1.y + '\t y: ' + p2.x + ', ' + p2.y);
    },
    intersection: (l1, l2) => {
        let a1 = l1.p2.y - l1.p1.y;
        let b1 = l1.p1.x - l1.p2.x;
        let c1 = a1 * l1.p1.x + b1 * l1.p1.y;

        let a2 = l2.p2.y - l2.p1.y;
        let b2 = l2.p1.x - l2.p2.x;
        let c2 = a2 * l2.p1.x + b1 * l2.p1.y;

        let det = a1 * b2 - a2 * b1;

        if (det == 0) {
            return undefined;
        }
        let x = (b2 * c1 - b1 * c2) / det;
        let y = (a1 * c2 - a2 * c1) / det;

        if (x < Math.min(l1.p1.x, l1.p2.x))
        return { x: x, y: y };
    },
    project: (l, vector) => {
        return line.make(point.project(l.p1, vector), point.project(l.p2, vector));
    },
    intersect: (l1, l2) => {
        if (point.equals(l1.p1, l2.p1) || point.equals(l1.p1, l2.p2)
         || point.equals(l1.p2, l2.p1) || point.equals(l1.p2, l2.p1)) {
            return true;
        }
        
        let norm = point.make(l1.p2.x - l1.p1.x, l1.p2.y - l1.p1.y);
        let first = line.project(l1, norm);
        let second = line.project(l2, norm);
        let p1 = point.magnitude(first.p1);
        let p2 = point.magnitude(first.p2);
        let p3 = point.magnitude(second.p1);
        let p4 = point.magnitude(second.p2);
        let minFirst = Math.min(p1, p2);
        let maxFirst = Math.max(p1, p2);
        let minSecond = Math.min(p3, p4);
        let maxSecond = Math.max(p3, p4);
        if (maxFirst < minSecond || minFirst > maxSecond) {
            return false;
        }

        norm = point.make(l2.p2.x - l2.p1.x, l2.p2.y - l2.p1.y);    
        first = line.project(l1, norm);
        second = line.project(l2, norm);
        p1 = point.magnitude(first.p1);
        p2 = point.magnitude(first.p2);
        p3 = point.magnitude(second.p1);
        p4 = point.magnitude(second.p2);
        minFirst = Math.min(p1, p2);
        maxFirst = Math.max(p1, p2);
        minSecond = Math.min(p3, p4);
        maxSecond = Math.max(p3, p4);
        
        if (maxFirst < minSecond || minFirst > maxSecond) {
            return false;
        }
        return true;
    }
};

const polys = {
    polys: [],
    at: (i) => {
        return polys.polys[i];
    },
    make: (points) => {
        let poly = {
            points: points,
            fillColor: 'transparent',//'#C16E70',
            borderColor: '#C16E70',
            borderWidth: 3,
            centerColor: '#B15E60',
            drawBounds: true,
        };
        polys.polys.push(poly);
        console.log(polys.polys);
        return poly;
    },
    gen: (x, y, numSides, radius, variance) => {

        let per = (2 * Math.PI) / numSides;
        let points = [];
        for (let i = 0; i < numSides; i++) {
            let min = per * i;
            let max = per * (i + 1);
            let a = Math.random() * (max - min) + min;
            let r = radius + variance * (Math.random() - 0.5);

            points.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
        }

        return polys.make(points);
    },

    draw: (ctx) => {
        for (let i = 0; i < polys.polys.length; i++) {
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

            ctx.strokeStyle = poly.borderColor;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(c.x, c.y, 3, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (poly.drawBounds) {
            let b = polys.bounds(poly);

            ctx.strokeStyle = poly.borderColor;
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
        return { x: x, y: y };
    },
    bounds: (poly) => {
        let b = {
            left: poly.points[0].x,
            right: poly.points[0].x,
            top: poly.points[0].y,
            bottom: poly.points[0].y
        };

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
        b.contains = (x, y) => {
            return (b.x <= x && b.right >= x &&
                b.y <= y && b.bottom >= y);
        };


        return b;
    },
    contains: (poly, point) => {
        let side = { x: polys.bounds(poly).left, y: point.y };
        let test = { p1: side, p2: point };

        let count = 0;
        for (let i = 0; i < poly.points.length; i++) {
            let p1 = poly.points[i];
            let p2 = poly.points[(i + 1) % poly.points.length];

            if (line.intersection({p1: p1, p2: p2}, test)) {
                count++;
            }
        }
        return count % 2 == 1;
    }
};

step = 0;



window.onload = () => {
    polys.gen(200, 200, 5, 100, 90);

    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    this.document.onmousemove = (e) => {
        this.mouse = { x: e.x, y: e.y };
    };
};

loop = () => {
    //update

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // draw
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


    for (let i = 0; i < polys.polys.length; i++) {
        let poly = polys.at(i);
        let bounds = polys.bounds(poly);
        if (this.mouse && polys.contains(poly, this.mouse)) {
            polys.at(0).borderWidth = 5;
        }
        else {
            polys.at(0).borderWidth = 3;
        }

        if (this.mouse && bounds.contains(this.mouse.x, this.mouse.y)) {
            line.draw(this.ctx, { x: bounds.left, y: this.mouse.y }, this.mouse);
        }
    }

    polys.draw(this.ctx);

    line.draw(this.ctx, l1.p1, l1.p2);
    line.draw(this.ctx, l2.p1, l2.p2);

    step++;
    requestAnimationFrame(loop);
};


//l1 = { p1: { x: 70, y: 50 }, p2: { x: 110, y: 10 } };
//l2 = { p1: { x: 70, y: 70 }, p2: { x: 110, y: 110 } };
l1 = { p1: { x: 10, y: 110 }, p2: { x: 110, y: 10 } };
l2 = { p1: { x: 10, y: 10 }, p2: { x: 110, y: 110 } };
requestAnimationFrame(loop);