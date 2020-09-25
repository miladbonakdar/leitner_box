import Vue from "vue";
import Vuex from "vuex";
import {getUser} from './userLocalStorage'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        loading: false
    },
    mutations: {
        fillUser(state) {
            if (!state.user) {
                state.user = getUser()
            }
        },
        setLoading: (state, payload) => (state.loading = payload),
    },
    actions: {},
    modules: {},
    getters: {
        User(state) {
            return state.user;
        },
        Loading(state) {
            return state.loading
        },
    },
});
