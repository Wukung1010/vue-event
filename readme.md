# 基于 Vue 的事件管理

## 使用方法

```javascript
import Event, { EventMixin } from 'vue-event-x';

Vue.use(Event, {
    name: 'demoEvent'
});

// 或者
Vue.use(Event);

new Vue({mixins: [EventMixin]});
```
导入Event之后使用use进行安装。

当你的组件存在习销毁和重建的时候，你需要混入EventMixin（建议无脑混入）。

安装时，如果提供了name的配置，则默认自动创建一个名叫name的消息总线。如果没有提供name配置，则不会创建消息总线，需要开发人员后续手动创建消息总线。

## $$EventX，全局对象是event-x的通用api。
```javascript
this.$$EventX = {
    createNewBus,
    destroy,
    isDestroy,
    state
}
```
||||
|-|-|-|
|方法|参数|描述|
|createNewBus|{name: 'eventName'}|创建新的消息总线，需要传入消息总线的名称。|
|destroy|{name: 'eventName'}|销毁消息总线，需要传入消息总线的名称。|
|isDestroy|name|查询消息总线的是否被销毁。|
|state|name\|null|查询消息总线的状态。|


## 事件总线的api
```javascript
this.$demoEvent = {
    on,
    emit,
    error,
    destroy,
    state
}
```
||||
|-|-|-|
|方法|参数|描述|
|on|type,fn,option\|[{type,fn,option}]\|{type,fn,option}|监听事件|
|emit|type,...args|事件触发|
|error|fn\|type,fn|错误处理，只传fn则全局错误处理，传入type可以对单个事件进行错误处理。fn的参数为：type,{data,error}|
|destroy||销毁当前时间总线|
|state||当前总线状态|