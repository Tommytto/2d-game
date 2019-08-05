import Component from '../Base';
import {isIntersected} from '../../helpers/canvas';

export default class Coiner extends Component {
    init() {
        this.coinList = [
            {x: 700, y: 300, exist: true},
            {x: 800, y: 100, exist: true},
            {x: 900, y: 300, exist: true},
            {x: 1000, y: 100, exist: true},
            {x: 1100, y: 100, exist: true},
            {x: 1200, y: 100, exist: true},
            {x: 1300, y: 100, exist: true},
            {x: 1400, y: 300, exist: true},
            {x: 1500, y: 300, exist: true},
            {x: 1600, y: 300, exist: true},
            {x: 1700, y: 300, exist: true},
            {x: 1800, y: 300, exist: true},
            {x: 1900, y: 300, exist: true},
        ];
    }

    getState({x: heroX, y: heroY, w: heroW, h: heroH}) {
        return this.coinList.some((coin) => {
            if (!coin.exist) {
                return false;
            }
            const existIntersected = isIntersected(
                {
                    x: heroX,
                    y: heroY,
                    w: heroW,
                    h: heroH,
                },
                {
                    x: coin.x,
                    y: coin.y,
                    w: 50,
                    h: 50,
                },
                this.store.camera
            );
            if (existIntersected) {
                coin.exist = false;
            }
            return existIntersected;
        });
    }

    draw() {
        const {ctx} = this;
        this.coinList.forEach(({x, y, exist}) => {
            if (exist) {
                ctx.beginPath();
                ctx.rect(x - this.store.camera.x, y - this.store.camera.y, 50, 50);
                ctx.fillStyle = 'green';
                ctx.fill();
                ctx.closePath();
            }
        });
    }
}
