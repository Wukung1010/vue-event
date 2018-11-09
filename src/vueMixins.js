export default function(arg) {
    let options = {};
    if(arg instanceof String) {
        options.name = arg;
    }else {
        options = arg;
    }
    return  {
        created() {
            this.$EventX.createNewBus(options);
        },
        destroyed() {
            this.$EventX.destroy(options);
        }
    };
}