import { createStore } from "vuex";
import user from "./user";
import resource from "./resource";

export default createStore({
  modules: { user, resource },
});
