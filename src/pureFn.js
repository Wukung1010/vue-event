function _on(listeners, type, fn) {
    let arr = null;
    if (arr = listeners[type], !arr) {
        arr = [];
        listeners[type] = arr;
    }
    arr.push(fn);
}

function _off(listeners, type, fn) {
    let listenerArr = null;
    let index = null;
    if(listenerArr = listeners[type], listenerArr && (index = listenerArr.indexOf(fn)), index > -1) {
        listenerArr.splice(index, 1);
    }
}

function _errorHandler(glabal, listeners, e, type, ...args) {
    glabal.forEach(listener => {
        try{
            listener(e, type, ...args);
        }catch(e) {
            console.error(`全局错误处理器 ${funcName(listener)} 发生错误：${e}`);
        }
    });
    let arr = null;
    if(arr = listeners[type], arr) {
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

export const on = _on;
export const off = _off;
export const errorHandler = _errorHandler;
export {funcName};