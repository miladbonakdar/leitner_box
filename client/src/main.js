import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
import Toasted from "vue-toasted";
import VueMoment from "vue-moment";
import Multiselect from 'vue-multiselect'

Vue.use(Toasted, {
    position: "bottom-right",
    duration: 5000
});

Vue.toasted.register(
    "warn",
    message => {
        return message;
    },
    {
        className: "bg-warning text-dark"
    }
);

Vue.toasted.register(
    "handleError",
    body => {
        if (body.message) return body.message;
        console.error(body);
        return "something bad happened please check the console";
    },
    {
        type: "error"
    }
);

Vue.toasted.register(
    "success",
    body => {
        if (body.message) return body.message;
        return "action completed successfully";
    },
    {
        type: "success"
    }
);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueMoment);

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-multiselect/dist/vue-multiselect.min.css";

Vue.config.productionTip = false;
Vue.component('multi-select',Multiselect)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
