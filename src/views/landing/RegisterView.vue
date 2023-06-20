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
            Create to Your Account
          </h6>
          <p class="q-ma-none text-center q-pt-xs">
            Enter your name, email & password to signup
          </p>
        </div>
        <q-card-section class="q-py-none q-pt-md q-px-lg">
          <q-form>
            <div class="q-pb-xs">
              <q-input
                ref="inputRef"
                outlined
                v-model="username"
                dense="dense"
                placeholder="User name"
                lazy-rules
                :rules="[rules.username.required]"
              >
                <template v-slot:prepend>
                  <q-icon name="people" />
                </template>
              </q-input>
            </div>
            <div class="q-pb-xs">
              <q-input
                outlined
                v-model="email"
                dense="dense"
                placeholder="Email Id"
                lazy-rules
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
                type="password"
                v-model="password"
                dense="dense"
                placeholder="Password"
                lazy-rules
                :rules="[rules.password.required]"
              >
                <template v-slot:prepend>
                  <q-icon name="password" />
                </template>
              </q-input>
            </div>
            <div class="q-pb-xs">
              <q-input
                outlined
                type="password"
                v-model="confirmPassword"
                dense="dense"
                placeholder="Confirm password"
                lazy-rules
                :rules="[
                  rules.confirmPassword.required,
                  rules.confirmPassword.passMatch,
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="password" />
                </template>
              </q-input>
            </div>
            <div class="q-pt-xs q-pb-lg">
              <q-btn
                color="primary"
                class="full-width"
                unelevated
                label="Register"
                :loading="loading"
                @click="registerUser"
                :disable="disableBtn"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Sending mail...
                </template>
              </q-btn>
            </div>
          </q-form>
          <p>
            Already have an
            <router-link to="/sign-in" class="text-indigo-14 no_underline">
              account?</router-link
            >
          </p>
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { validateEmail, notifyAlert } from "@/utils/helper";

export default defineComponent({
  name: "SignUp",
  data() {
    return {
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
      showPassword: false,
      loading: false,

      rules: {
        username: {
          required: (v) => !!v || "User name is required",
        },
        email: {
          required: (v) => !!v || "Email id is required",
          validEmail: (v) =>
            validateEmail(v) || "Use a valid incedoinc email ID",
        },
        password: {
          required: (v) => !!v || "Password is required",
        },
        confirmPassword: {
          required: (v) => !!v || "Confirm password is required",
          passMatch: (v) =>
            v == this.password || "Confirm password not matched",
        },
      },
    };
  },
  computed: {
    ...mapState("user", {
      name: (state) => state.name,
    }),
    disableBtn() {
      if (
        this.username == null ||
        this.email == null ||
        !validateEmail(this.email) ||
        this.password == null ||
        this.password == "" ||
        this.confirmPassword == null ||
        this.password != this.confirmPassword
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    registerUser: async function () {
      if (this.password != this.confirmPassword) {
        notifyAlert(
          "negative",
          "Password and confirma password is not matched"
        );
      }
      try {
        this.loading = true;
        const payload = {
          username: this.username,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
        };
        const result = await this.$store.dispatch("user/createUser", payload);
        if (result.status == 200) {
          this.clearForm();
          notifyAlert("positive", result.data);
        }
        this.loading = false;
      } catch (err) {
        notifyAlert("negative", err.response.data.message);
        this.loading = false;
      }
    },
    clearForm: function () {
      this.username = null;
      this.email = null;
      this.password = null;
      this.confirmPassword = null;
      inputRef.resetValidation();
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
