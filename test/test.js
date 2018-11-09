import Vue from 'vue';
import iView from 'iview';
// import EventX from '../dist/EventX.js';
import App from './App1.vue';

Vue.use(iView);
Vue.use(EventX);

new Vue({
    el: '#app',
    mounted() {
        this.$EventX.error((...args) => {
            console.log('EventX全局错误处理器被触发', ...args);
        });
    },
    components: {App},
    template: `<App />`
});