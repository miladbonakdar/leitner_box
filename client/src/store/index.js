import Vue from "vue";
import Vuex from "vuex";
import { getUser as getUserFromApi } from "../gate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    loading: false
  },
  mutations: {
    setLoading: (state, payload) => (state.loading = payload),
    setUser: (state, user) => (state.user = user)
  },
  actions: {
    init({ commit }, done) {
      getUserFromApi()
        .then(res => {
          commit("setUser", res);
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
    }
  }
});
