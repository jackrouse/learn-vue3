import Vuex from "vuex";

export default Vuex.createStore({
  state: {
    userName: "aibing"
  },
  mutations: {
    setUserName(state, name) {
      state.userName = name;
    }
  },
  actions: {},
  modules: {}
});
