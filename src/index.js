import Hero from './components/Hero';
import Map from './components/Map';
import Config from './services/Config';
import {EventEmitter} from './services/EventEmitter';
import Engine from './services/Engine';
import Store from "./services/Store";
import Coiner from "./components/Coiner";

window.onload = function() {
    const canvas = document.querySelector('#canvas');
    // const mapCanvas = document.querySelector('#map-canvas');
    const ctx = canvas.getContext('2d');
    // const mapCtx = mapCanvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    // mapCtx.canvas.width = window.innerWidth;
    // mapCtx.canvas.height = window.innerHeight;
    const touchChannel = new EventEmitter();
    const store = new Store();
    const config = new Config({ctx});
    const coiner = new Coiner({ctx, store, config})
    const engine = new Engine({store, modules: {}, ctx, config, coiner});
    const map = new Map({ctx, engine, store, config, touchChannel});
    engine.setMap(map);
    const hero = new Hero({ctx, config, touchChannel, store, engine});
    loop();

    function loop() {
        clearCanvas();
        map.draw();
        hero.draw();
        coiner.draw();
        requestAnimationFrame(loop);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
};
