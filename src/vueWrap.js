import EventX from './eventX.js';


function install (Vue, options) {
    Vue.prototype.$EventX = EventX(Vue);
}

export default install;