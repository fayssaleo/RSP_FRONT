<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" style=" min-height: 99vh; background-color: #072d5d14; padding: 0; ">
      <v-col cols="12" md="7" class="hidden-sm-and-down wallpaper"
        style=" padding: 0;position: relative;;min-height: 99vh; background-color: #072d5d14; ">
        <div class="subtitle-1 font-italic" id="animatedText">Tanger Alliance Resource Planning Application.</div>
        <span class="cover"></span>
      </v-col>
      <v-col cols="12" md="5" style=" min-height: 99vh; background-color: #072d5d14; padding-top: 211px;">
        <form class="mainPage" @submit.prevent="login">
          <v-img class="mx-auto my-12" max-width="250" src="../../assets/images/TA-logo.png"></v-img>

          <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Matricule</div>
            <v-text-field density="compact" placeholder="Matricule" prepend-inner-icon="mdi-account-outline"
              variant="outlined" v-model="matricule" ref="matriculeInput" :autofocus="autofocus"
              required></v-text-field>
            <div class="passwordZone">
              <div class="text-subtitle-1 text-medium-emphasis flex">
                Password
              </div>
              <div v-if="showCredError">
                <p class="error">
                  Matricule or Password Incorrect
                </p>
              </div>
            </div>
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
              variant="outlined" @click:append-inner="visible = !visible" v-model="password" required></v-text-field>
            <v-btn class="mb-8" color="blue" size="large" variant="tonal" block type="submit">
              Log In
            </v-btn>
          </v-card>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  data() {
    return {
      visible: false,
      matricule: "",
      password: "",
      load: false,
      autofocus: true,
      error: "",
      showCredError: false
    }
  },
  mounted() {
    if (this.autofocus) {
      this.$refs.matriculeInput.focus();
    }
  },
  computed: {
    ...mapGetters(["getUserActive", "getToken", "getLoadingValue"])
  },
  watch: {
    getLoadingValue(val) {
      this.load = val
    },
    getUserActive(val) {
      if (val === null) this.autofocus = true
    }
  },
  methods: {
    ...mapActions(["LoginAction", "setLoadingValueAction", "setProfileGroupsAction", "setShiftsAction", "changeSelectedProfileGroup"]),
    login() {
      this.setLoadingValueAction(true);
      this.LoginAction({ matricule: this.matricule, password: this.password })
        .then(user => {
          this.setProfileGroupsAction().then((e) => {
            this.setShiftsAction().then((r) => {
              this.changeSelectedProfileGroup({ "id": 1, "type": "rtg", "created_at": "2024-08-16T14:28:03.000000Z", "updated_at": "2024-08-16T14:28:03.000000Z" })
            });
          });
          this.redirectAfterLogin();
          this.setLoadingValueAction(false);
        })
        .catch(error => {
          this.error = error.message
          if (error == "TypeError: Cannot read properties of undefined (reading 'user')")
            this.showCredError = true
          this.setLoadingValueAction(false);
        });
    },
    redirectAfterLogin() {
      this.$router.push('/rtgPlanning');
    }
  }
}
</script>

<style scoped>
@keyframes typing {
  0% {
    width: 0;
    border-right: .15em solid rgba(100, 130, 190, 0.503);
  }

  /* Start with the cursor visible */
  99.9% {
    width: 90%;
    border-right: .15em solid rgba(100, 130, 190, 0.503);
  }

  /* Keep the cursor for the entire typing duration */
  100% {
    width: 100%;
    border-right: none;
  }

  /* Hide the cursor at the very end */
}

#appTitle {
  text-align: left;
  color: white;
  /* Ensuring text is visible on potentially dark background */
}

#animatedText {
  font-size: 46px;
  color: white;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  animation: typing-050f9a64 4s steps(44) 1 forwards;
  margin-top: 91px;
  margin-left: 29px;

}

.passwordZone {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.error {
  font-size: x-small;
  color: red;
}

.wallpaper {
  height: 100%;
  background-image: url('../../assets/login_page.jpg');
  /* Corrected URL syntax */
  background-size: cover;
  /* Cover the entire column space */
  background-position: center;
  /* Center the background image */
}

.cover[data-v-050f9a64] {
  display: inline-block;
  width: 101%;
  height: 101%;
  position: absolute;
  top: -5px;
  background-color: #166dba69;
  left: -4px;
}
</style>
