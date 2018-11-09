import EventX, {EventXName} from './eventX.js';


function install (Vue, options) {
    Vue.prototype[`$${EventXName}`] = EventX(Vue);
}

export default install;