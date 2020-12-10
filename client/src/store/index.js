import Vue from "vue";
import Vuex from "vuex";
import {getUser as getUserFromApi, getLanguages} from "../gate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        loading: false,
        languages: null
    },
    mutations: {
        setLoading: (state, payload) => (state.loading = payload),
        setUser: (state, user) => (state.user = user),
        setLanguages: (state, languages) => (state.languages = languages)
    },
    actions: {
        init({commit}, done) {
            Promise.all([getUserFromApi(), getLanguages()])
                .then(([user, languages]) => {
                    commit("setUser", user);
                    commit("setLanguages", languages.data);
                    done();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    modules: {},
    getters: {
        User(state) {
            return state.user;
        },
        Loading(state) {
            return state.loading;
        },
        Languages(state) {
            return state.languages;
        }
    }
});
