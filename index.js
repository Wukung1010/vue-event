/**
 * 事件中心
 * @author Gua'dan
 */
import Vue from 'vue';

const DEFUALT_NAME = 'eventBus';

/**
 * 错误器管理
 */
class EventHandlers {
    constructor(name) {
        this._name = name;
        this._handlers = [];
    }
    on(fn) {
        this._handlers.push(fn);
        if(fn.name.length === 0) {
            console.warn('匿名函数会增加调试难度，最好为函数添加名称。');
        }
    }
    emit(e, ...args) {
        this._handlers.forEach(handle => {
            try{
                handle(e, args);
            }catch(e) {
                console.warn(`错误处理函数出错：${handle.name.length > 0 ?handle.name:'匿名函数'}。`, e);
            }
        })
    }
    getName() {
        return this._name;
    }
}

/**
 * 多个事件中心
 * 多个错误管理器
 */
class EventHandlerManager{
    constructor() {
        this._manager = {}
    }
    on(name, fn) {
        let m = this._manager[name];
        if(!m) {
            m = new EventHandlers(name);
            this._manager[name] = m;
        }
        m.on(fn);
    }
    emit(name, e, ...args) {
        let m = this._manager[name];
        if(m){
            m.emit(e, ...args);
        }
    }
}

const manager = new EventHandlerManager();

let state = {};

function $onProxy (bus, ...args) {
    bus.$on(...args);
    let type = args[0];
    if(!state[type]) {
        state[type] = {
            listeners: 1
        };
    }
    state[type].listeners ++;
}

export default function (vue, options) {

    let name;
    let event_bus;

    let methods = {
        emit() {
            try{
                event_bus.$emit(...arguments);
            }catch(e){
                manager.emit(name, e, ...arguments);
            }
        },
        on() {
            try{
                if(arguments.length > 1) {
                    $onProxy(event_bus, ...arguments);
                }else {
                    let arg = arguments[0];
                    if(Array.isArray(arg)) {
                        // 对数组的支持
                        // [{type: '', fn: function}]
                        arg.forEach(config => {
                            if(config.type) {
                                $onProxy(event_bus, type, config.fn);
                            }
                        });
                    }else {
                        Object.keys(arg).forEach(type => {
                            $onProxy(event_bus, type, arg[type]);
                        })
                    }
                }
            }catch(e) {
                manager.emit(name, e, ...arguments);
            }
        },
        error(fn) {
            if(fn instanceof Function) {
                manager.on(name, fn);
            }else {
                console.warn('事件管理：错误处理只接受处理函数，不接受其他类型的参数。');
            }
        },
        state() {
            return state;
        },
        destroyed() {
            try{
                delete vue.prototype[`$${name}`];
            }catch(e) {
                vue.prototype[`$${name}`] = null;
            }
        },
        
    }
    
    let API = {
        createNewBus(options) {
            name = options.name || DEFUALT_NAME;
            event_bus = new Vue();
            vue.prototype[`$${name}`] = methods;
        }
    };
    
    API.createNewBus(options);

    vue.prototype[`$$vueEventBus`] = API;
}