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
            _on(this._listeners, type, fn);
        } else {
            let args = arguments[0];
            if (Array.isArray(args)) {
                args.forEach(arg => _on(this._listeners, arg.type, arg.fn));
            }else {
                Object.keys(args).forEach(key => _on(this._listeners, key, args[key]))
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
                    _errorHandler(this._globalErrorListeners, this._errorListeners, e, type, ...args);
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
            _on(this._errorListeners, type, fn);
        }else {
            let fn = arguments[0];
            this._globalErrorListeners.push(fn);
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

function _on(listeners, type, fn) {
    let arr = listeners[type];
    if (!arr) {
        arr = [];
        listeners[type] = arr;
    }
    arr.push(fn);
}

function _errorHandler(glabal, listeners, e, type, ...args) {
    if(glabal.length > 0) {
        glabal.forEach(listener => {
            try{
                listener(e, type, ...args);
            }catch(e) {
                console.error(`全局错误处理器 ${funcName(listener)} 发生错误：${e}`);
            }
        });
    }
    let type = args[1];
    let arr = listeners[type];
    if(arr && arr.length > 0) {
        arr.forEach(listener => {
            try{
                listener(e, type, ...args);
            }catch(e) {
                console.error(`${type}错误处理器 ${funcName(listener)} 发生错误：${e}`);
            }
        });
    }
}

function funcName(fn) {
    let name = fn.name;
    if(!name || name.length === 0) {
        return '匿名处理器';
    }
    return name;
}

export default Event;
export {funcName};