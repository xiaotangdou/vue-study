import Vue from "vue";
import Vuex from "./vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    count_1: 0,
  },
  getters: {
    sumCount: (state) => {
      console.log("getters");
      return state.count + 2;
    },
  },
  mutations: {
    add(state, payload) {
      state.count += payload;
    },
    add_1(state, payload) {
      state.count_1 += payload;
    },
  },
  actions: {
    add({ commit }, payload) {
      setTimeout(() => {
        commit("add", payload);
      }, 3000);
    },
  },
});

export default store;
