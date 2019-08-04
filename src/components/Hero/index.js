import Component from '../Base';

export default class Hero extends Component {
    draw() {
        const {ctx} = this;
        const {x, y, h, w} = this.engine.getHeroState();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
    }
}
