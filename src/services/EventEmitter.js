import {Observable} from 'rxjs';

export class EventEmitter {
    constructor() {
        this.observable = new Observable((subscriber) => {
            this.emitFunc = subscriber.next();
        });
    }

    subscribe(cb) {
        this.observable.subscribe(cb);
    }

    emit(data) {
        this.emitFunc(data);
    }
}
