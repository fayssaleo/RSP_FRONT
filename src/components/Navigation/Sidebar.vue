<template>
  <div class="sidebar">
    <v-card>
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent >
        <div class="topitems">
          <span v-if="rail">
            <v-list-item v-if="authUser?.profile_picture" @click.stop="rail = !rail"
              :prepend-avatar="authUser?.profile_picture ? 'http://127.0.0.1:8000/uploads/' + authUser?.profile_picture : 'mdi-account-circle-outline'"
              :title="authUser ? authUser.firstname + ' ' + authUser.lastname?.toUpperCase() : ''
                " style="color: #f9fbfc">
              <template v-slot:append>
                <v-btn icon v-bind:class="{ closedrawer: true }">
                  <v-icon size="small" style="color: white">
                    mdi-arrow-left
                  </v-icon>
                </v-btn>
              </template>
            </v-list-item>
            <v-list-item v-else @click.stop="rail = !rail"
              :title="authUser ? (authUser.firstname.length > 1 ? authUser.firstname[0].toUpperCase() + authUser.firstname.slice(1) : '') + ' ' + authUser.lastname?.toUpperCase() : ''"
              style="color: #f9fbfc">
              <!-- Custom prepend icon with controlled size -->
              <template #prepend>
                <v-icon
                  style="font-size: 40px; height: 40px; width: 40px; color: white; padding-right: 19px;">mdi-account-circle-outline</v-icon>
              </template>

              <template #append>
                <v-btn icon v-bind:class="{ closedrawer: true }">
                  <v-icon size="small" style="color: white">
                    mdi-arrow-left
                  </v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </span>
          <div v-else class="profile-section">
            <div class="avatar-wrapper" @click.stop="rail = !rail" >
    <v-avatar size="140" v-if="authUser?.profile_picture" >
      <img style="width: 100%;" :src="'http://127.0.0.1:8000/uploads/' + authUser.profile_picture" alt="Profile Picture" />
    </v-avatar>
    <v-avatar size="140" v-else >
      <v-icon size="140" color="white">mdi-account-circle-outline</v-icon>
    </v-avatar>
    <span class="shrink-icon" style="    overflow: hidden;"></span>
  </div>
            <div class="full-name" v-if="authUser">
              <span>{{ authUser ? (authUser.firstname.length > 1 ? authUser.firstname[0].toUpperCase() + authUser.firstname.slice(1) : '') + ' '  : '' }}</span><br />
              <span>{{ authUser ? authUser.lastname.toUpperCase() : '' }}</span>
            </div>
            <v-list-item class="editProfileBtn" prepend-icon="mdi-lock-reset" title="CHANGE PASSWORD" value="planning" :style="{
            color: '#F9FBFC',
            backgroundColor: 'rgba(217, 217, 217, 0.2)',
          }" @click="
            selectItem(1)
            " nav>
          </v-list-item>
          </div>

          <v-list-item prepend-icon="mdi-gantry-crane" title="RTG Planning" value="planning" :style="{
            color: '#F9FBFC',
            backgroundColor: 'rtg' == $route.name
              ? 'rgba(217, 217, 217, 0.2)'
              : '',
          }" @click="
            selectItem(1)
            " nav>
          </v-list-item>
          <v-list-item prepend-icon="mdi-crane" title="STS Planning" value="planning" :style="{
            color: '#F9FBFC',
            backgroundColor: 'sts' == $route.name
              ? 'rgba(217, 217, 217, 0.2)'
              : '',
          }" @click="
            selectItem(2)
            " nav>
          </v-list-item>

          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="Users" :style="{
            color: '#F9FBFC',
            backgroundColor: items[4].value == $route.name
              ? 'rgba(217, 217, 217, 0.2)'
              : '',
          }" @click="
            selectItem(4)
            " nav></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="Equipments" value="Equipments" :style="{
            color: '#F9FBFC',
            backgroundColor: items[5].value == $route.name
              ? 'rgba(217, 217, 217, 0.2)'
              : '',
          }" @click="
            selectItem(5)
            " nav></v-list-item>
        </div>

        <!-- divider -->
        <v-divider></v-divider>

        <!-- bottom items -->
        <div class="bottomitems" style="bottom: 0;
    position: absolute;">
          <v-list-item prepend-icon="mdi-logout" title="LOGOUT" value="logout" :style="{
            color: '#F9FBFC',
            backgroundColor: items[5].value == $route.name
              ? 'rgba(217, 217, 217, 0.2)'
              : '',
          }" @click="logout
            " nav></v-list-item>

        </div>
      </v-navigation-drawer>
    </v-card>
  </div>

</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {

      drawer: true,
      rail: true,
      authUser: null,
      role: null,
      items: [
        {
          icon: "mdi-view-dashboard",
          title: "Planning Dashbord",
          value: "PlanningDashbord",
          selected: false,
        },
        {
          icon: "mdi-view-dashboard",
          title: "RTG Planning",
          value: "rtgPlanning",
          selected: false,
        },
        {
          icon: "mdi-view-dashboard",
          title: "STS Planning",
          value: "stsPlanning",
          selected: false,
        },
        {
          icon: "mdi-view-dashboard",
          title: "Planning",
          value: "dashboard",
          selected: false,
        },
        {
          icon: "mdi-account-group-outline",
          title: "Users",
          value: "users",
          selected: false,
        },
        {
          icon: "mdi-crane",
          title: "Equipments",
          value: "equipments",
          selected: false,
        },
      ],
    };
  },

  mounted() {
    this.getAuthUser();
  },

  computed: {
    ...mapGetters(["getMessages", "getUserActive", "getUserRole"]),
  },

  methods: {
    ...mapActions(["logoutAction", "clearPlannings"]),
    getAuthUser() {
      this.authUser = this.getUserActive;
    },

    logout() {
      this.logoutAction()
        .then(() => {
          // this.clearPlannings();
          this.redirectAfterLogout();
        })
        .catch((error) => {
          localStorage.clear();
          window.location.reload();
        });
    },

    redirectAfterLogout() {
      this.$router.push("/");
      localStorage.clear();
    },

    selectItem(index) {
      this.items.forEach((item, i) => {
        item.selected = i === index;
      });
      switch (index) {
        case 0:
          for (let i = 0; i <= index; i++) {
            this.items[i].selected = false;
          }
          this.items[index].selected = true;
          this.$router.push("/PlanningDashbord");
          break;
        case 1:
          for (let i = 0; i <= index; i++) {
            this.items[i].selected = false;
          }
          this.items[index].selected = true;
          this.$router.push("/rtgPlanning");
          break;
        case 2:
          for (let i = 0; i <= index; i++) {
            this.items[i].selected = false;
          }
          this.items[index].selected = true;
          this.$router.push("/stsPlanning");
          break;
        case 3:
          for (let i = 0; i <= index; i++) {
            this.items[i].selected = false;
          }
          this.items[index].selected = true;
          this.$router.push("/dashboard");
          break;
        case 4:
          for (let i = 0; i <= index; i++) {
            this.items[i].selected = false;
          }
          this.items[index].selected = true;
          this.$router.push("/users");
          break;
        case 5:
          for (let i = 0; i <= index; i++) {
            this.items[i].selected = false;
          }
          this.items[index].selected = true;
          this.$router.push("/equipements");
          break;
      }
    },
    setItems() {
      this.items = [];
      this.role = this.getUserRole;
      switch (this.role.name) {
        case "admin":
          this.items = [
            {
              icon: "mdi-view-dashboard",
              title: "RTG Planning",
              value: "planning",
              selected: true,
            },
            {
              icon: "mdi-view-dashboard",
              title: "Planning",
              value: "planning",
              selected: true,
            },
            {
              icon: "mdi-account-group-outline",
              title: "Users",
              value: "users",
              selected: false,
            },
            {
              icon: "mdi-crane",
              title: "Equipments",
              value: "equipments",
              selected: false,
            },
          ];
          break;
        case "driver":
          this.items = [
            {
              icon: "mdi-view-dashboard",
              title: "RTG Planning",
              value: "planning",
              selected: true,
            },
            {
              icon: "mdi-view-dashboard",
              title: "Planning",
              value: "planning",
              selected: true,
            },
          ];
          break;
        case "am":
          this.items = [
            {
              icon: "mdi-view-dashboard",
              title: "Planning",
              value: "planning",
              selected: true,
            },
          ];
          break;
        case "foreman":
          this.items = [
            {
              icon: "mdi-view-dashboard",
              title: "RTG Planning",
              value: "planning",
              selected: true,
            },
            {
              icon: "mdi-view-dashboard",
              title: "Planning",
              value: "planning",
              selected: true,
            },
          ];
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  z-index: 30;
  opacity: 1;
}

.v-navigation-drawer {
  height: 100vh;
  background-color: #15263f;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background-color: #1e3a5f;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  margin: 20px 10px;

  padding-bottom: 2px;
  padding-top: 13px;
}

.profile-section:hover {
  background-color: #1e3a5f87;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.2);
  transform: scale(1.02); /* Slight scale on hover for subtle effect */
}

.profile-avatar {
  margin-bottom: 10px;
  border: 2px solid #f9fbfc;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease, border-color 0.3s ease; /* Smooth border and shadow changes */
}

.full-name {
  font-size: 16px;
  color: #f9fbfc;
  font-weight: bold;
  transition: color 0.3s ease; /* Color change transition */
}

.firstname {
  font-size: 18px;
  font-weight: 500;
  color: #f9fbfc;
}

.lastname {
  font-size: 16px;
  color: #c0c9d2;
}

.bottomitems {
  width: 100%;
  display: flex;
  justify-content: center;
}

.v-btn {
  background-color: #15263f;
}

.v-list-item {
  margin: 1rem 0;
}
.avatar-wrapper {
  position: relative;
  display: inline-block;
}


.shrink-icon {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  background-color: #00000063;
  border-radius: 50%;
  display: none;;
}
.shrink-icon::after {
  content: "\F004D";
    font-family: "Material Design Icons";
    position: absolute;
    right: -6%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 154px;
    font-weight: 100 !important;
    color: #ffffff24;
    }

.avatar-wrapper:hover .shrink-icon {
  opacity: 1;
}
.avatar-wrapper:hover {
  .shrink-icon {

  display: inline-block;
}
}
</style>

