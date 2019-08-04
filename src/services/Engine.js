import {getCanvasSize} from '../helpers/canvas';
import {ELEMENT} from '../consts/element';
import {of} from 'rxjs';

export default class Engine {
    constructor({modules, ctx, config, store}) {
        this.modules = modules;
        this.config = config;
        this.store = store;
        this.modulesArr = Object.values(modules);
        const [canvasWidth, canvasHeight] = getCanvasSize(ctx);
        const bound = Math.floor(canvasWidth * 0.4);
        const boundVertical = Math.floor(canvasHeight * 0.4);
        this.maxLeft = canvasWidth - bound;
        this.maxTop = canvasHeight - boundVertical;
        this.minTop = boundVertical;
        this.minLeft = bound;
        const heroHeight = 50;
        const heroWidth = 50;
        this.onGround = false;
        this.heroState = {
            stateList: [],
            x: bound,
            y: bound,
            w: heroWidth,
            h: heroHeight,
            canvasOffset: {
                x: 0,
                y: 0,
            },
        };
        this.dx = 10;
        this.jump = {
            size: 300,
            count: 0,
            interval: null,
        };
        this.dy = this.jump.size / 30;
        this.falling = {
            interval: null,
        };

        this.move = {
            left: {
                interval: null,
                active: false,
            },
            right: {
                interval: null,
                active: false,
            },
        };

        this.handleArrowUp = this.handleArrowUp.bind(this);
        this.handleArrowLeft = this.handleArrowLeft.bind(this);
        this.handleArrowRight = this.handleArrowRight.bind(this);

        this.bind();
    }

    setMap(map) {
        this.map = map;
        this.runFalling();
    }

    bind() {
        setInterval(() => {
            console.log(this.map.getState(this.heroState).current);
            console.log(this.map.getState(this.heroState).bottom);
            console.log(this.heroState);
        }, 2000);
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.handleArrowUp();
                    break;
                case 'ArrowLeft':
                    if (this.move.left.active) {
                        return;
                    }
                    this.move.left.active = true;
                    this.handleArrowLeft();
                    break;
                case 'ArrowRight':
                    if (this.move.right.active) {
                        return;
                    }
                    this.move.right.active = true;
                    this.handleArrowRight();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.move.left.active = false;
                    break;
                case 'ArrowRight':
                    this.move.right.active = false;
                    break;
            }
        });
    }

    moveRight(offset) {
        this.heroState.x += offset;
    }

    moveLeft(offset) {
        this.heroState.x -= offset;
    }

    moveUp(offset) {
        this.heroState.y -= offset;
    }

    moveDown(offset) {
        this.heroState.y += offset;
    }

    isTouching(hero, target) {}

    getOffset({target, side}) {
        const {
            map: {tileSize},
        } = this.config;
        switch (side) {
            case 'top':
                return Math.min(this.dy, this.heroState.y + this.store.camera.y - (target.y + tileSize + 1));
            case 'right':
                return Math.min(this.dx, target.x - 1 - (this.heroState.x + this.heroState.w + this.store.camera.x));
            case 'bottom':
                return Math.min(this.dy, target.y - 1 - (this.heroState.y + this.store.camera.y + this.heroState.h));
            case 'left':
                return Math.min(this.dx, this.heroState.x + this.store.camera.x - (target.x + tileSize + 1));
        }
    }

    runFalling() {
        this.falling.interval = setInterval(() => {
            const {bottom} = this.map.getState(this.heroState);
            const offset = bottom.type === ELEMENT.GROUND ? this.getOffset({target: bottom, side: 'bottom'}) : this.dy;
            const isBound = this.heroState.y + this.heroState.h > this.maxTop;
            this.onGround = !offset;
            if (!this.jump.interval) {
                if (isBound) {
                    this.store.camera.y += offset;
                } else {
                    this.moveDown(offset);
                }
            }
        }, 5);
    }

    stopJump() {
        clearInterval(this.jump.interval);
        this.jump.interval = null;
        this.jump.count = 0;
    }

    stopFalling() {
        clearInterval(this.falling.interval);
        this.falling.interval = null;
    }

    handleArrowUp() {
        if (this.jump.interval || !this.onGround) {
            return;
        }
        this.jump.interval = setInterval(() => {
            const {top} = this.map.getState(this.heroState);
            const offset = top.type === ELEMENT.GROUND ? this.getOffset({target: top, side: 'top'}) : this.dy;
            const isBound = this.heroState.y < this.minTop;
            if (isBound) {
                this.store.camera.y -= offset;
            }
            if (!offset) {
                this.stopJump();
            } else {
                if (!isBound) {
                    this.moveUp(offset);
                }
                this.jump.count++;
                if (this.jump.size / this.dy === this.jump.count) {
                    this.stopJump();
                }
            }
        }, 5);
    }

    handleArrowRight() {
        this.move.right.interval = setInterval(() => {
            const {right} = this.map.getState(this.heroState);
            const offset = right.type === ELEMENT.GROUND ? this.getOffset({target: right, side: 'right'}) : this.dx;
            const isBound = this.heroState.x + this.heroState.w > this.maxLeft;
            if (isBound) {
                this.store.camera.x += offset;
            }
            if (!this.move.right.active) {
                clearInterval(this.move.right.interval);
            } else if (!isBound) {
                this.moveRight(offset);
            }
        }, 10);
    }

    handleArrowLeft() {
        this.move.left.interval = setInterval(() => {
            const {left} = this.map.getState(this.heroState);
            const offset = left.type === ELEMENT.GROUND ? this.getOffset({target: left, side: 'left'}) : this.dx;
            const isBound = this.heroState.x < this.minLeft;
            if (isBound) {
                this.store.camera.x -= offset;
            }
            if (!this.move.left.active) {
                clearInterval(this.move.left.interval);
            } else if (!isBound) {
                this.moveLeft(offset);
            }
        }, 10);
    }

    stopRight() {}

    stopLeft() {}

    getHeroState() {
        // const {x, y, w, h} = this.heroState;
        // const newStateList = this.modulesArr.map((modules) => modules.getState({x, y, w, h}));
        // this.heroState.stateList = newStateList;
        return this.heroState;
    }
}
