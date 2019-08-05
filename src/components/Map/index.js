    import {getCanvasSize} from '../../helpers/canvas';
import Component from '../Base';
import {STATE} from '../../consts/state';
import {ELEMENT} from '../../consts/element';

export default class Map extends Component {
    init() {
        const [width, height] = getCanvasSize(this.ctx);
        this.startGroundHeight = 200;
        this.startY = height - this.startGroundHeight;

        this.map = [
            [
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
            ],
            [
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
            ],
            [
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
            ],
            [
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
                {type: ELEMENT.AIR},
            ],
            [
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
            ],
            [
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
                {type: ELEMENT.GROUND},
            ],
        ];
    }

    getState({x: heroX, y: heroY, w: heroW, h: heroH}) {
        const {
            map: {tileSize},
        } = this.config;
        const stateResult = {
            current: {},
            top: {},
            right: {},
            bottom: {},
            left: {},
        };
        this.map.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                const [tileX, tileY] = this.getCoordByTileIndex(tileIndex, rowIndex);
                const tooLeft = heroX + heroW + this.store.camera.x <= tileX;
                const tooTop = heroY + heroH + this.store.camera.y <= tileY;
                const tooRight = heroX + this.store.camera.x >= tileX + tileSize;
                const tooBottom = heroY + this.store.camera.y >= tileY + tileSize;
                if (!tooTop && !tooRight && !tooBottom && !tooLeft) {
                    stateResult.current = {
                        ...tile,
                        x: tileX,
                        y: tileY,
                    };

                    stateResult.top = this.getInfoByTileIndex(tileIndex, rowIndex - 1);
                    stateResult.right = this.getInfoByTileIndex(tileIndex + 1, rowIndex);
                    stateResult.bottom = this.getInfoByTileIndex(tileIndex, rowIndex + 1);
                    stateResult.left = this.getInfoByTileIndex(tileIndex - 1, rowIndex);
                }
            });
        });
        return stateResult;
    }

    getInfoByTileIndex(x, y) {
        const [tileX, tileY] = this.getCoordByTileIndex(x, y);
        if (!this.map[y] || !this.map[y][x]) {
            return {};
        }
        return {
            ...this.map[y][x],
            x: tileX,
            y: tileY,
        };
    }

    getCoordByTileIndex(x, y) {
        const {
            map: {tileSize},
        } = this.config;
        return [x * tileSize, y * tileSize];
    }

    draw() {
        const {ctx} = this;
        const {
            map: {tileSize},
        } = this.config;
        this.map.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                const [tileX, tileY] = this.getCoordByTileIndex(tileIndex, rowIndex);
                ctx.beginPath();
                ctx.rect(-this.store.camera.x + tileX, -this.store.camera.y + tileY, tileSize, tileSize);
                switch (tile.type) {
                    case ELEMENT.AIR:
                        ctx.fillStyle = 'blue';
                        break;
                    case ELEMENT.GROUND:
                        ctx.fillStyle = '#FF7400';
                        break;
                }
                ctx.fill();
                ctx.closePath();
            });
        });
    }
}
