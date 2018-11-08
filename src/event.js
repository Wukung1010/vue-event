class Event {
    constructor() {
        this._listeners = {};
    }
    on() {
        if (arguments.length > 1) {
            let type = arguments[0];
            let fn = arguments[1];
            this._listeners
        } else {
            let arg = arguments[0];
            arg;
        }
    }
    emit() {}
    error() {}
}
