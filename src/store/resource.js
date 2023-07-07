import axios from "axios";
import { avoidHeader } from "@/utils/constant";

const state = {
  resources: [],
  // resourceDetails: [],
};

const mutations = {
  SET_RESOURCE(state, data) {
    state.resources = data;
  },
  SET_ADD_RESOURCE(state, data) {
    state.resources = data;
  },
  // SET_RESOURCE_DETAILS(state, data) {
  //   state.resourceDetails = data;
  // },
};

const actions = {
  async fetchAll({ commit }) {
    const response = await axios.get("/resource");
    const result = response.data.filter((s) => s.status != 0);
    commit("SET_RESOURCE", result);
    return result;
  },

  async createResource({ commit, dispatch }, payload) {
    const result = await axios.post(`/resource`, payload);
    // commit("SET_ADD_RESOURCE", result.data);
    dispatch("fetchAll");
    return result;
  },

  async updateResource({ commit, dispatch }, data) {
    const result = await axios.put(`/resource/${data.id}`, data.payload);
    dispatch("fetchAll");
    return result;
  },

  // async resourceDetails({ commit }, id) {
  //   const response = await axios.get(`resource/${id}`);
  //   commit("SET_RESOURCE_DETAILS", response.data);
  // },
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
