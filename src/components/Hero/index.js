import Component from '../Base';

export default class Hero extends Component {
    draw() {
        const {ctx} = this;
        const {x, y, h, w} = this.engine.getHeroState();
        const image = document.getElementById('source');

        ctx.beginPath();
        ctx.drawImage(image, x, y, w, h);
        ctx.closePath();
    }
}
