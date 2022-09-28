
const point = {
    make: (x, y) => {
        return {x: x, y: y};
    },
    zero: () => point.make(0, 0),
    one: () => point.make(1, 1),
    up: () => point.make(0, -1),
    down: () => point.make(0, 1),
    left: () => point.make(-1, 0),
    right: () => point.make(1, 0),
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
    },
    draw: (p, color = '#C16E70', radius = 3, lineWidth = 2, fillColor = 'transparent') => {
        this.ctx.fiilStyle = fillColor;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
    }
}

const line = {
    make: (p1, p2) => {
        return {p1: p1, p2:p2};
    },
    draw: (l, color = '#C16E70', width = 3) => {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(l.p1.x, l.p1.y);
        this.ctx.lineTo(l.p2.x, l.p2.y);
        this.ctx.stroke();
        //console.log('x: ' + p1.x + ', ' + p1.y + '\t y: ' + p2.x + ', ' + p2.y);
    },
    project: (l, vector) => {
        return line.make(point.project(l.p1, vector), point.project(l.p2, vector));
    },
    overlapOnAxis: (l1, l2, axis) => {
        let first = line.project(l1, axis);
        let second = line.project(l2, axis);
        let p1 = point.magnitude(first.p1);
        let p2 = point.magnitude(first.p2);
        let p3 = point.magnitude(second.p1);
        let p4 = point.magnitude(second.p2);
        let minFirst = Math.min(p1, p2);
        let maxFirst = Math.max(p1, p2);
        let minSecond = Math.min(p3, p4);
        let maxSecond = Math.max(p3, p4);
        return !(maxFirst < minSecond || minFirst > maxSecond);

    },
    intersects: (l1, l2) => {
        if (point.equals(l1.p1, l2.p1) || point.equals(l1.p1, l2.p2)
         || point.equals(l1.p2, l2.p1) || point.equals(l1.p2, l2.p1)) {
            return true;
        }
        let norm = point.make(l1.p2.x - l1.p1.x, l1.p2.y - l1.p1.y);
        
        return line.overlapOnAxis(l1, l2, line.normal(l1))
            & /* using & not && for drawQueue in line.normal */ 
            line.overlapOnAxis(l1, l2, line.normal(l2));
    },
    normal: (l) => {
        let output = point.normal(point.make(l.p2.x - l.p1.x, l.p2.y - l.p1.y));
        let n = point.normalize(output);
        n.x *= l.length;
        n.y *= 100;
        let centerX = line.center(l).x;
        let centerY = line.center(l).y;
        drawQueue.queue.push({
            type: 'line',
            line: line.make(point.make(-n.x + centerX, -n.y + centerY),
                            point.make(centerX, centerY))
        }); 

        return output;
    },
    center: (l) => {
        let centerX = (l.p1.x + l.p2.x) / 2;
        let centerY = (l.p1.y + l.p2.y) / 2;
        return point.make(centerX, centerY);
    },
    length: (l) => {
        return point.dist(point.make(l.p2.x - l.p1.x, l.p2.y - l.p1.y));
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

    draw: () => {
        for (let i = 0; i < polys.polys.length; i++) {
            polys.drawPoly(polys.at(i));
        };
    },
    drawPoly: (poly) => {
        this.ctx.fillStyle = poly.fillColor;
        this.ctx.strokeStyle = poly.borderColor;
        this.ctx.lineWidth = poly.borderWidth;
        this.ctx.beginPath();
        for (let i = 0; i < poly.points.length; i++) {
            this.ctx.lineTo(poly.points[i].x, poly.points[i].y);
        }
        this.ctx.lineTo(poly.points[0].x, poly.points[0].y);
        this.ctx.fill();
        this.ctx.stroke();

        if (poly.centerColor !== 'transparent') {
            point.draw(polys.center(poly));
        }
        if (poly.drawBounds) {
            let b = polys.bounds(poly);

            this.ctx.strokeStyle = poly.borderColor;
            this.ctx.lineWidth = 1;

            this.ctx.beginPath();
            this.ctx.rect(b.x, b.y, b.width, b.height);
            this.ctx.stroke();
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
        b.contains = (p) => {
            return (b.x <= p.x && b.right >= p.x &&
                b.y <= p.y && b.bottom >= p.y);
        };


        return b;
    },
    contains: (poly, p) => {
        let bounds = polys.bounds(poly);
        if (!bounds.contains(p)) {
            return false;
        }

        let side = point.make(bounds.left, p.y);
        let test = line.make(side, p);

        drawQueue.queue.push({
            type: 'line',
            line: test
        }); 

        let count = 0;
        for (let i = 0; i < poly.points.length; i++) {
            let p1 = poly.points[i];
            let p2 = poly.points[(i + 1) % poly.points.length];

            if (line.intersects(line.make(p1, p2), test)) {
                count++;

                drawQueue.queue.push({
                    type: 'line',
                    line: line.make(p1, p2),
                    color: '#ffffff3f',
                    width: 4
                }); 
            }
        }
        //console.log(count);
        return count % 2 == 1;
    }
};

const drawQueue = {
    queue: [],
    draw: () => {
        if (drawQueue.queue.length == 0){
            return;
        }
        for (let item = drawQueue.queue.pop(); item != undefined; item = drawQueue.queue.pop()) {
            if (item.type === 'line') {
                line.draw(item.line, item.color, item.width);
            }
        }
    }
};

step = 0;



window.onload = () => {
    polys.gen(200, 200, 5, 100, 90);

    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    this.document.onmousemove = (e) => {
        this.mouse = point.make(e.x, e.y);
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
    }

    polys.draw();

    drawQueue.draw();

    step++;
    requestAnimationFrame(loop);
};


requestAnimationFrame(loop);