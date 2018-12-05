import EventX, {EventMixin} from '../index.js';

console.log(EventX, EventMixin);

Vue.use(EventX);

const App = Vue.extend({
    mixins: [EventMixin({name: 'appEventBus'})],
    mounted() {
        this.$appEventBus.on('test', (...args) => {
            console.log('test事件被触发',args);
        });
        this.$appEventBus.on('errorTest', () => {
            throw '错误测试';
        });
        this.$appEventBus.error('test', (...args) => {
            console.log('test错误处理器被触发', ...args);
        });
        this.$appEventBus.error((...args) => {
            console.log('appEventBus的全局错误处理器被触发', ...args);
        });
    },
    methods: {
        fireEvent() {
            this.$appEventBus.emit('test', 1, 2, 3);
        },
        fireError() {
            this.$appEventBus.emit('errorTest', 11, 22, 33);
        }
    },
    template: `<div>
    <div>
        <Button @click="fireEvent">触发事件</Button>
        <Button @click="fireError">触发错误</Button>
    </div>
</div>`
});

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