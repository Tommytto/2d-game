import {getCanvasSize} from '../helpers/canvas';

export default class Config {
    constructor({ctx}) {
        const [width] = getCanvasSize(ctx);
        this.map = {
            tileSize: 200,
        };
    }
}
