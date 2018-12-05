import Event from './event.js';
import {funcName} from './pureFn.js';

const EventManager = {};
const GlobalErrorListeners = [];
const nameTemplate = '$';
const EventXName = 'EventX';

function API(Vue) {
    let vue = Vue;
    return {
        createNewBus(options) {
            if(!options) {
                console.error('创建事件总线时需要传入总线的配置信息。');
                return;
            }
            let name = options.name;
            if(!name || name.length === 0 || EventManager.hasOwnProperty(name)) {
                console.error('事件总线名称为空。');
                return;
            }
            if(name === 'EventX') {
                console.error('事件总线名称不能是EventX。');
                return;
            }
            if(options.replace && EventManager[name]) {
                this.destroy(options);
            }
    
            EventManager[name] = new Event(this, Event);
            EventManager[name].error(_errorListenerProxy);
            
            vue.prototype[eventBusNameTemplate(name)] = EventManager[name];
        },
        destroy(options) {
            let name = null;
            if(options) {
                name = options.name;
            }
            delete vue.prototype[eventBusNameTemplate(name)];
            delete EventManager[name];
        },
        error(fn) {
            GlobalErrorListeners.push(fn);
        },
        isDestroyed(name) {
            return vue.prototype[eventBusNameTemplate(name)] || EventManager[name];
        },
        state() {
            return {
                name: EventXName,
                eventBus: Object.keys(EventManager),
                globalErrorListenerNum: GlobalErrorListeners.length,
                namePrefix: nameTemplate
            };
        }
    }
}

function eventBusNameTemplate (name) {
    return `${nameTemplate}${name}`
}

function _errorListenerProxy() {
    if(GlobalErrorListeners.length > 0) {
        GlobalErrorListeners.forEach(listener => {
            try{
                listener(...arguments)
            }catch(e) {
                console.error(`${EventXName}全局错误处理器 ${funcName(listener)} 发生错误：${e}`);
            } 
        });
    }
}

export default API;
export {EventXName};