<template>
  <div class="container">
    <h2 class="mt-3 text-success text-center">Boxy</h2>
    <b-card-group class="mt-3" v-if="action === 'register'" deck>
      <b-card header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <h6>Create a new account</h6>
        </template>

        <b-form @submit="onRegister">
          <b-form-group
            id="register-group-1"
            label="Full name:"
            label-for="input-1"
            description="Enter your full name"
          >
            <b-form-input
              id="input-1"
              v-model="form.register.name"
              required
              placeholder="Enter full name"
            ></b-form-input>
          </b-form-group>

          <b-form-group
              id="register-group-2"
              label="Your username:"
              label-for="input-2"
          >
            <b-form-input
                id="input-2"
                v-model="form.register.username"
                required
                placeholder="Enter your username"
            ></b-form-input>
          </b-form-group>

          <b-form-group
              id="register-group-4"
              label="Your email:"
              label-for="input-2"
          >
            <b-form-input
                id="input-4"
                v-model="form.register.email"
                required
                type="email"
                placeholder="Enter your email"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="Your password:"
            label-for="input-3"
          >
            <b-form-input
              id="input-3"
              v-model="form.register.password"
              type="password"
              required
              placeholder="Enter your password"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-4"
            label="Repeat password:"
            label-for="input-4"
          >
            <b-form-input
              id="input-4"
              v-model="form.register.rePassword"
              type="password"
              required
              placeholder="Enter your password again"
            ></b-form-input>
          </b-form-group>

          <div class="row">
            <b-link @click="setAction('login')">
              <span class="col-12 text-info"
                >Already have an account? login here</span
              >
            </b-link>

            <div class="col-12 mt-2">
              <b-button type="submit" variant="success">Register</b-button>
            </div>
          </div>
        </b-form>
      </b-card>
    </b-card-group>

    <b-card-group class="mt-3" v-if="action === 'login'" deck>
      <b-card header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <h6 class="mb-0">Login to your account</h6>
          </b-row>
        </template>

        <b-form @submit="onLogin">
          <b-form-group
            id="login-group-1"
            label="Username:"
            label-for="login-1"
          >
            <b-form-input
              id="login-1"
              v-model="form.login.username"
              type="text"
              required
              placeholder="Enter username or email"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="login-group-2"
            label="Your password:"
            label-for="login-2"
          >
            <b-form-input
              id="login-2"
              v-model="form.login.password"
              type="password"
              required
              placeholder="Enter password"
            ></b-form-input>
          </b-form-group>
          <div class="row">
            <b-link @click="setAction('register')">
              <span class="col-12 text-info"
                >Don't have an account? create a new one here</span
              >
            </b-link>

            <div class="col-12 mt-2">
              <b-button type="submit" variant="success">Login</b-button>
            </div>
          </div>
        </b-form>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { getToken, storeUserToken } from "@/store/userLocalStorage";
import { login, register, updateInstance } from "../gate";
import { mapMutations } from "vuex";

export default {
  name: "AuthView",
  created() {
    if (getToken()) this.$router.replace("/profile");
  },
  data() {
    return {
      form: {
        register: {
          name: null,
          username: null,
          email:null,
          password: null,
          rePassword: null
        },
        login: {
          username: null,
          password: null
        }
      },
      foods: [
        { text: "Select One", value: null },
        "Carrots",
        "Beans",
        "Tomatoes",
        "Corn"
      ],
      action: "login"
    };
  },
  methods: {
    ...mapMutations({
      showLoading: "setLoading"
    }),
    onRegister(evt) {
      evt.preventDefault();
      if (!this.form.register.password)
        return this.$toasted.global.warn("please enter the password");
      if (!this.form.register.username)
        return this.$toasted.global.warn("please enter the username");
      if (!this.form.register.email)
        return this.$toasted.global.warn("please enter your email address");
      if (!this.form.register.rePassword)
        return this.$toasted.global.warn("please repeat the password");
      if (!this.form.register.name)
        return this.$toasted.global.warn("please enter your name");
      if (this.form.register.rePassword !== this.form.register.password)
        return this.$toasted.global.warn(
          "passwords are not match please enter them again"
        );

      let data = { ...this.form.register };
      delete data.rePassword;
      this.showLoading(true);
      register(data)
        .then(res => {
          this.$toasted.success(res.message);
          this.form.login.password = this.form.register.password;
          this.form.login.username = this.form.register.username;
          this.onLogin(evt);
        })
        .catch(err => this.$toasted.global.handleError(err))
        .finally(() => this.showLoading(false));
    },
    onLogin(evt) {
      evt.preventDefault();
      if (!this.form.login.password)
        return this.$toasted.global.warn("please enter the password");
      if (!this.form.login.username)
        return this.$toasted.global.warn("please enter the username");

      this.showLoading(true);

      login(this.form.login)
        .then(res => {
          this.$toasted.success(res.message);
          storeUserToken(res.data.user, res.data.token);
          updateInstance();
          this.$router.replace("/profile");
        })
        .catch(err => this.$toasted.global.handleError(err))
        .finally(() => this.showLoading(false));
    },
    setAction(action) {
      this.action = action;
    }
  }
};
</script>

<style scoped></style>
