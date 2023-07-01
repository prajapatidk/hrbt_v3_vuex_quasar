import axios from "axios";
import { avoidHeader } from "@/utils/constant";

const state = {
  resources: [],
  resourceDetails: [],
};

const mutations = {
  SET_RESOURCE(state, data) {
    state.resources = data;
  },
  SET_RESOURCE_DETAILS(state, data) {
    state.resourceDetails = data;
  },
};

const actions = {
  async fetchAll({ commit }) {
    await axios.get("/resource").then((response) => {
      const result = response.data.filter((s) => s.status != 0);
      commit("SET_RESOURCE", result);
    });
  },

  async resourceDetails({ commit }, id) {
    await axios.get(`resource/${id}`).then((response) => {
      commit("SET_RESOURCE_DETAILS", response.data);
    });
  },
};

const getters = {
  GET_RESOURCES: (state) => state.resources,
  GET_RESOURCE_DETAILS: (state) => state.resourceDetails,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
