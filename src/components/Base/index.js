export default class Component {
    constructor({ctx, config, store, engine}) {
        this.ctx = ctx;
        this.config = config;
        this.engine = engine;
        this.store = store;
        this.init();
        this.bind();
    }

    init() {}
    bind() {}

    draw() {
        throw new Error('Override method draw');
    }
}
