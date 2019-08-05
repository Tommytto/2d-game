export function getCanvasSize(ctx) {
    return [ctx.canvas.width, ctx.canvas.height];
}

export function isIntersected({x: x1, y: y1, w: w1, h: h1}, {x: x2, y: y2, w: w2, h: h2}, camera) {
    const tooLeft = x1 + w1 + camera.x <= x2;
    const tooTop = y1 + h1 + camera.y <= y2;
    const tooRight = x1 + camera.x >= x2 + w2;
    const tooBottom = y1 + camera.y >= y2 + h2;
    return !tooTop && !tooRight && !tooBottom && !tooLeft;
}
