import CustomizedAxios from "../../../plugins/axios";
const usersModule = {
  state: {
    users: [],
    drivers: [],
    drivers_all: [],
    error: null,
    token: null,
    userRole:null,
    activeUser: null,
    messages: {
      logout: "",
    },
    wh_all: [],
    wh_details_sh_gp: [],
    count_wh_details_sh_gp: [],
    users_wh_details_sh_gp: [],
  },
  mutations: {
    LOGIN_USER(state, payload) {
      state.activeUser = payload.user;
      state.token = payload.token;
      state.userRole = payload.role;
    },
    LOGOUT_USER(state, message) {
      state.activeUser = null;
      // console.log(state.activeUser);
      state.token = null;
      state.messages.logout = message;
    },
    DISPLAY_ERROR(state, error, status) {
      state.error = {
        error: error,
        status: status,
      };
    },
    SET_USERS(state, payload) {
      state.users = payload;
    },
    SET_DRIVERS(state, payload) {
      state.drivers = payload;
    },
    SET_DRIVERS_ALL(state, payload) {
      state.drivers_all = payload;
    },
    REGISTER_USER(state, payload) {
      state.users.push(payload);
    },
    ADD_USER(state, payload) {
      state.users.push(payload);
    },
    DELETE_USER(state, user) {
      state.users = state.users.filter((c) => c.id != user);
    },
    EDIT_USER(state, user) {
      state.users = state.users.map((c) => {
        if (c.id == user.id) return user;
        return c;
      });
    },
    RESET_PASS_USER(state, user) {
      const index = state.users.findIndex((c) => c.id === user.id);
      if (index == -1) {
        state.users[index] = user;
      }
    },
    SET_WH_ALL(state, payload) {
      state.wh_all = payload;
    },
    RESET_WH_ALL(state, payload) {
      state.wh_all = payload;
    },
    WH_DETAILS_SHIFT_GROUP(state, payload) {
      console.log(payload)
      state.wh_details_sh_gp = payload.wh_details_sh_gp;
      state.count_wh_details_sh_gp = payload.count_wh_details_sh_gp;
      state.users_wh_details_sh_gp = payload.users_wh_details_sh_gp;
    }
  },
  actions: {
    LoginAction({ commit }, user) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/login", user)
          .then((response) => {
            commit("LOGIN_USER", response.data.payload);
            CustomizedAxios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.payload.token}`;
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    registerUserAction({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/register", user)
          .then((response) => {
            commit("REGISTER_USER", response);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    addUserAction({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/add_user", user)
          .then((response) => {
            commit("ADD_USER", response);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logoutAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/logout")
          .then((response) => {
            commit("LOGOUT_USER", response.data.message);
            resolve(response.data.message);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setUsersAction({ commit, state }) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("users/")
          .then((response) => {
            commit("SET_USERS", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteUserAction({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        let data = {
          id: user,
        };
        CustomizedAxios.post("users/delete", data)
          .then((response) => {
            console.log(response.data.payload);
            commit("DELETE_USER", user);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    editUserAction({ commit }, user) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/update", user,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((response) => {
            commit("EDIT_USER", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    resetPasswordAction({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        let data = {
          id: user,
        };
        CustomizedAxios.put("users/resetpass", data)
          .then((response) => {
            commit("RESET_PASS_USER", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setDriversAction({ commit, state }, inputs) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/drivers", inputs)
          .then((response) => {
            commit("SET_DRIVERS", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setDrivers2Action({ commit, state }, inputs) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/getDriversActiveList_byF", inputs)
          .then((response) => {
            commit("SET_DRIVERS", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setDriversActiveList_allAction({ commit, state }, inputs) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/getDriversActiveList_all", inputs)
          .then((response) => {
            commit("SET_DRIVERS_ALL", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setUserById({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/getById",user)
          .then((response) => {
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    wh_index_action({ commit, state }) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("users/wh_index")
          .then((response) => {
            commit("SET_WH_ALL", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    wh_reset_action({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/WHReset_manual_",data)
          .then((response) => {
            commit("RESET_WH_ALL", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    WhHistory_details_index_action({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/WhHistory_details_index",data)
          .then((response) => {
            commit("WH_DETAILS_SHIFT_GROUP", response.data);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    COUNT_WhHistory_details_index_action({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("users/COUNT_WhHistory_details_index",data)
          .then((response) => {
            commit("COUNT_WH_DETAILS_SHIFT_GROUP", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  getters: {
    getUserActive: (state) => {
      return state.activeUser;
    },
    getToken: (state) => {
      return state.token;
    },
    getMessages: (state) => {
      return state.messages;
    },
    getUsers: (state) => {
      return state.users;
    },
    getDriversAll: (state) => {
      return state.drivers_all;
    },
    getDrivers: (state) => {
      return state.drivers;
    },
    getUserRole:(state) =>{
      return state.userRole;
    },
    get_wh_all(state) {
      return state.wh_all;
    },
    get_wwh_details_sh_gp(state) {
      return state.wh_details_sh_gp;
    },
    get_count_wwh_details_sh_gp(state) {
      return state.count_wh_details_sh_gp;
    },
    get_users_wh_details_sh_gp(state) {
      return state.users_wh_details_sh_gp;
    }
  },
};

export default usersModule;
