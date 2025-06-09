import { createP5Sketch } from '@salernoelia/propa';
import p5 from 'p5';

export const CircleFollowMouse = () => {
    return createP5Sketch({
        sketch: (p: p5) => {
            p.setup = () => {
                p.createCanvas(400, 400);
            };

            p.draw = () => {
                p.background(220);
                p.fill(255, 0, 0);
                p.ellipse(p.mouseX, p.mouseY, 50, 50);
            };
        },
        containerClass: 'mouse-follower',
        containerStyle: 'border: 1px solid black; width: 400px; height: 400px;'
    });
};

export const BouncingBall = () => {
    let x = 200;
    let y = 200;
    let xSpeed = 3;
    let ySpeed = 2;

    return createP5Sketch({
        sketch: (p: p5) => {
            p.setup = () => {
                p.createCanvas(400, 400);
            };

            p.draw = () => {
                p.background(0);
                p.fill(0, 255, 0);

                p.ellipse(x, y, 30, 30);

                x += xSpeed;
                y += ySpeed;

                if (x > p.width - 15 || x < 15) {
                    xSpeed *= -1;
                }
                if (y > p.height - 15 || y < 15) {
                    ySpeed *= -1;
                }
            };
        },
        containerStyle: 'margin: 20px 0; width: 400px; height: 400px;'
    });
};