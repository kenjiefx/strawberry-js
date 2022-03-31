class Scope {
    constructor(appName,scopeName){
        this.$app = appName;
        this.$name = scopeName;
        this.$hidden = {};
        this.$togglers = {};
        this.$switchers = {};
        this.$patchables = {};
        this.$renderables = {};
        this.$pagination = {};
        this.$templates = {};
        this.$services = new Services(scopeName);
    }
    invokePreset(presets){

        let regex = /^[a-zA-Z0-9]*$/;

        for (var i = 0; i < presets.length; i++) {
           let preset = presets[i];
           if (!regex.test(preset)) {
               if (strawberry.debug) {
                   console.warn('strawberry.js: Unable to satisfy presets for scope: '+this.$name+'invalid preset names');
               }
           }
           if (strawberry.$factory.hasOwnProperty(preset)) {
               this[preset] = strawberry.$factory[preset];
           }
        }

    }
}
