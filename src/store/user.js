import axios from "axios";
import { avoidHeader } from "@/utils/constant";

const state = {
  users: [{ id: 1, username: "Deepak Kumar", email: "deepak@gmail.com" }],
  name: "Deepak",
};

const mutations = {};

const actions = {
  async createUser(context, payload) {
    const response = await axios.post("register", payload, avoidHeader);
    return response;
  },
  async login(context, payload) {
    const response = await axios.post("login", payload, avoidHeader);
    return response;
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
