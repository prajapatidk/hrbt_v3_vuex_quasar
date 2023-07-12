import axios from "axios";
// import { avoidHeader } from "@/utils/constant";
// import { token } from "../utils/localStorage.js";

const state = {
  resources: [],
  // resourceDetails: [],
};

const mutations = {
  SET_RESOURCE(state, data) {
    state.resources = data;
  },
  SET_ADD_RESOURCE(state, data) {
    state.resources.push(data);
  },
  SET_UPDATE_RESOURCE(state, data) {
    console.log(data);
    //state.resources.push(data);
  },
};

const actions = {
  fetchAll: async function ({ commit }) {
    const response = await axios.get("/resource");
    console.log(response);
    const result = response.data.filter((s) => s.status != 0);
    commit("SET_RESOURCE", result);
    return result;
  },

  fetchAlldraft: async function ({ commit }) {
    const response = await axios.get("/resource");
    const result = response.data.filter((s) => s.status == 0);
    commit("SET_RESOURCE", result);
    return result;
  },

  createResource: async function ({ commit, dispatch }, payload) {
    const result = await axios.post(`/resource`, payload);
    commit("SET_ADD_RESOURCE", result.data);
    return result;
  },

  updateResource: async function ({ commit, dispatch }, data) {
    const result = await axios.put(`/resource/${data.id}`, data.payload);
    // console.log(result.data);
    // commit("SET_UPDATE_RESOURCE", { data });
    dispatch("fetchAll");
    return result;
  },

  softDeleteResource: async function ({ commit, dispatch }, id) {
    const result = await axios.delete(`/sdresource/${id}`);
    dispatch("fetchAll");
    return result;
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
