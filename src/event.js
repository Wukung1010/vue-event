import {on, off, errorHandler} from './pureFn.js';
class Event {
    constructor(parent, name) {
        this.name = name;
        this.parent = parent;
        this._listeners = {};
        this._errorListeners = {};
        this._globalErrorListeners = [];
    }
    on() {
        if (arguments.length > 1) {
            let type = arguments[0];
            let fn = arguments[1];
            on(this._listeners, type, fn);
        } else {
            let args = arguments[0];
            if (Array.isArray(args)) {
                args.forEach(arg => on(this._listeners, arg.type, arg.fn));
            }else {
                Object.keys(args).forEach(key => on(this._listeners, key, args[key]))
            }
        }
    }
    off(type, fn, all = false) {
        if(arguments.length >= 2) {
            off(this._listeners, type, fn);
            if(all) {
                this.offError(type);
                this.offGlobalError(fn);
            } 
        }
    }
    emit(type, ...args) {
        let arr = this._listeners[type];
        if(arr) {
            arr.forEach(listener => {
                try{
                    listener(...args);
                }catch(e) {
                    errorHandler(this._globalErrorListeners, this._errorListeners, e, type, ...args);
                }
            });
        }else {
            console.warn(`没有找到 ${type} 的事件处理器。`);
        }
    }
    error() {
        if(arguments.length > 1) {
            let type = arguments[0];
            let fn = arguments[1];
            on(this._errorListeners, type, fn);
        }else {
            let fn = arguments[0];
            this._globalErrorListeners.push(fn);
        }
    }
    offError() {
        if(arguments.length > 1) {
            let type = arguments[0];
            let fn = arguments[1];
            off(this._errorListeners, type, fn);
        }else {
            let fn = arguments[0];
            let index = -1;
            if(index = this._globalErrorListeners.indexOf(fn), index > -1) {
                this._globalErrorListeners.splice(index, 1);
            }
        }
    }
    destroy() {
        this._listeners = {};
        this._errorListeners = {};
        this._globalErrorListeners = [];
        this.parent.destroy({name: this.name});
    }
    state() {
        return {
            name: this.name,
            types: Object.keys(this._listeners),
            errorListeners: Object.keys(this._errorListeners),
            globalErrorListenerNum: this._globalErrorListeners.length
        }
    }
}

export default Event;