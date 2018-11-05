# 基于 Vue 的事件管理

## 使用方法

```javascript
import Event from 'vue-event';

Vue.use(Event, {
    name: 'demoEvent'
});

new Vue({
    method: {
        listen() {
            this.$demoEvent.on('event', () => {
                ...
            })
        },
        handle() {
            ...
            this.$demoEvent.emit('event', ...);
        },
        error() {
            this.$demoEvent.error((name, error, ...args) => {
                ...
            });
        }
    }
})

```

## options
{
    name: '事件管理器名称，在使用的时候请在开头加上`$`符号'
}

## api
||||
|---------|----------|---------|
|on(type, fn)||监听函数|
|on(array)|[{type: 'type', fn: func}]|监听函数|
|on(obj)|{type: fn}|监听函数|
|emit(type, ...arg)|可变参数|触发事件|
|error(fn)||错误监听。回调接收：事件类型；错误信心；...处理参数|