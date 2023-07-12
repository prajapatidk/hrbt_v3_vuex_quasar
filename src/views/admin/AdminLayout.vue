<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1 bg-color">
    <q-header
      style="box-shadow: 0px 2px 20px rgba(1, 41, 112, 0.1)"
      class="shadow-none bg-white text-grey-8 q-py-xs"
      height-hint="58"
    >
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          color=""
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        /> -->

        <div class="row items-center q-ml-md" v-if="$q.screen.gt.xs">
          <img width="28" src="@/assets/hrbt.webp" />
          <q-toolbar-title shrink class="q-pt-xs q-pl-sm text-primary">
            HRBT
          </q-toolbar-title>
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="indigo-10"
            icon="file_upload_outlined_icon"
            v-if="$q.screen.gt.sm"
          >
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="indigo-10"
            icon="file_download_outlined_icon"
            v-if="$q.screen.gt.sm"
            class="q-mr-md"
          >
          </q-btn>
          <q-btn
            flat
            color="indigo-10"
            icon-right="power_settings_new_icon"
            label="Deepak Kumar"
            class="q-ml-lg"
            @click="logOut"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-fff q-pt-md"
      style="box-shadow: 0px 0px 20px rgba(1, 41, 112, 0.1)"
      :width="260"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item to="/" class="q-py-xs" v-ripple clickable>
            <q-item-section avatar class="q-pl-none">
              <q-icon color="grey" class="" name="home_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="/resource" class="q-py-xs" v-ripple clickable>
            <q-item-section avatar class="q-pl-none">
              <q-icon color="grey" name="handyman_icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Resources</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="/draft-resources" class="q-py-xs" v-ripple clickable>
            <q-item-section avatar class="q-pl-none">
              <q-icon color="grey" name="delete_icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Draft Resources</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-separator class="q-mt-md q-mb-lg" /> -->
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="q-px-lg q-pt-lg text-h5 text-grey-6">
        Manage {{ pageName }}
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { RouterLink, useRouter } from "vue-router";
import { validateEmail, notifyAlert } from "@/utils/helper";

export default defineComponent({
  name: "AdminLayout",
  data() {
    return {
      leftDrawerOpen: false,
      search: "",
      router: useRouter(),

      links1: [
        { icon: "home", text: "Home" },
        { icon: "whatshot", text: "Trending" },
        { icon: "subscriptions", text: "Subscriptions" },
      ],
    };
  },
  mounted() {
    this.checkActiveUser();
  },
  computed: {
    pageName() {
      return this.router.currentRoute.name;
    },
  },
  methods: {
    async checkActiveUser() {
      try {
        if (!localStorage.hasOwnProperty("token")) {
          return this.router.push("/sign-in");
        }
      } catch (err) {
        this.logOut();
      }
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    logOut() {
      localStorage.removeItem("token");
      this.router.push("/sign-in");
    },
  },
});
</script>

<style lang="sass" scoped>
::v-deep(.q-item__section--avatar)
  min-width: initial !important
  padding-right: 10px !important

.bg-color
  background: #f6f9ff !important

.q-link
  color: #012970 !important
  font-size: 16px
  width: 90%
  margin: 0 0 10px auto

  i
    color: #899bbd !important

.q-router-link--exact-active
  color: #0d6efd !important
  background-color: #edf4ff

  i
    color: #0d6efd !important
</style>