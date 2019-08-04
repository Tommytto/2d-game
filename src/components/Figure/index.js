import {getCanvasSize} from "../../helpers/canvas";

export default class Figure {
    static getCoordinates({x, y, w, h, xInverted, yInverted}, ctx) {
        const [canvasWidth, canvasHeight] = getCanvasSize(ctx);
        let left = x;
        let top = y;
        let width = w;
        let height = h;

        if (yInverted) {
            top = canvasHeight - top;
        }
        if (xInverted) {
            left = canvasWidth - left;
        }
        return [top, left, width, height]
    }

    static rect(params, ctx) {
        const coord = Figure.getCoordinates(params, ctx);
        ctx.rect(coord);
    }
}
