import CustomizedAxios from "../../../plugins/axios";
const rolesModule = {
  state: {
    roles: [],
    departments: [],
  },
  mutations: {
    SET_ROLES(state, payload) {
      state.roles = payload;
    },
    SET_DERPARTMENTS(state, payload) {
      state.departments = payload;
    },
  },
  actions: {
    setRolesAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("roles/")
          .then((response) => {
            commit("SET_ROLES", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setDepartmentsAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("departments/")
          .then((response) => {
            commit("SET_DERPARTMENTS", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  getters: {
    getRoles: (state) => {
      return state.roles;
    },
    getDepartments: (state) => {
      return state.departments;
    },
  },
};

export default rolesModule;
