<template>
  <q-card class="bg-color card_wrp row justify-center items-center">
    <div>
      <div class="row justify-center q-pb-lg">
        <img alt="HRBR logo" src="@/assets/hrbt.webp" class="d-block" />
        <p
          class="q-ma-none full-width text-center q-pt-sm q-ma-none text-indigo-10 text-body1"
        >
          Hardware Resource Booking Tool
        </p>
      </div>
      <q-card class="q-pt-md login_card q-pb-md shadow-0 shadow_custom">
        <div class="q-py-lg">
          <h6
            class="text-h5 q-ma-none text-center text-indigo-10 text-weight-regular"
          >
            Login to Your Account
          </h6>
          <p class="q-ma-none text-center q-pt-xs">
            Enter your username &amp; password to login
          </p>
        </div>
        <q-card-section class="q-py-none q-pt-md q-px-lg">
          <div class="q-pb-xs">
            <q-input
              outlined
              v-model="email"
              dense="dense"
              placeholder="Email Id"
              :rules="[rules.email.required, rules.email.validEmail]"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
          </div>
          <div class="q-pb-xs">
            <q-input
              outlined
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              dense="dense"
              placeholder="Password"
              :rules="[rules.password.required]"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>
          </div>
          <div style="margin: -6px 0 8px -8px">
            <q-checkbox v-model="showPassword" label="Show Password" />
          </div>
          <div class="q-pt-xs q-pb-lg">
            <q-btn
              color="primary"
              class="full-width"
              unelevated
              label="Login"
              :loading="loading"
              @click="registerUser"
              :disable="disableBtn"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Please wait...
              </template>
            </q-btn>
          </div>
          <p>
            Don't have account?
            <router-link to="/sign-up" class="text-indigo-14 no_underline">
              Create account</router-link
            >
            <!-- or
            <router-link
              to="/forget-password"
              class="text-indigo-14 no_underline"
              >forget password?</router-link
            > -->
          </p>
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { RouterLink, useRouter } from "vue-router";
import { validateEmail, notifyAlert } from "@/utils/helper";

export default defineComponent({
  name: "SignIn",
  data() {
    return {
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
      showPassword: false,
      loading: false,
      router: useRouter(),

      rules: {
        email: {
          required: (v) => !!v || "Email id is required",
          validEmail: (v) =>
            validateEmail(v) || "Use a valid incedoinc email ID",
        },
        password: {
          required: (v) => !!v || "Password is required",
        },
      },
    };
  },
  mounted() {
    this.checkActiveUser();
  },
  computed: {
    disableBtn() {
      if (
        this.email == null ||
        !validateEmail(this.email) ||
        this.password == null ||
        this.password == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    checkActiveUser() {
      if (localStorage.hasOwnProperty("token")) {
        return this.router.push("/");
      }
    },
    registerUser: async function () {
      try {
        this.loading = true;
        const payload = {
          email: this.email,
          password: this.password,
        };
        const response = await this.$store.dispatch("user/login", payload);
        if (response.status == 200) {
          localStorage.setItem("token", response.data.jwtToken);
          this.router.push("/");
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        notifyAlert("negative", err.response.data.message);
      }
    },
    clearForm: function () {
      this.email = null;
      this.password = null;
    },
  },
});
</script>

<style lang="sass" scoped>
.no_underline
  text-decoration: none

.card_wrp
  width: 100%
  height: 100vh

.login_card
  width: 450px

.bg-color
  background: #f6f9ff

.shadow_custom
  box-shadow: 0px 0 30px rgb(1 41 112 / 10%) !important

::v-deep(.q-field__bottom)
  padding-left: 0px

::v-deep(.q-field--error .q-field__bottom)
  padding-top: 5px
</style>
