import axios from "axios";
import { avoidHeader } from "@/utils/constant";

const state = {
  resources: [],
};

const mutations = {
  SET_RESOURCE(state, data) {
    state.resources = data;
  },
};

const actions = {
  async fetchAll({ commit }) {
    await axios.get("resource").then((response) => {
      const result = response.data.filter((s) => s.status != 0);
      commit("SET_RESOURCE", result);
    });
  },
};

const getters = {
  GET_RESOURCES: (state) => state.resources,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
