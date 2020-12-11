<template>
  <div>
    <template v-if="isLoading">
      <div class="loading-container"></div>
      <CubeShadow background="#20a8d8" class="loading"></CubeShadow>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import { CubeShadow } from "vue-loading-spinner";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    CubeShadow
  },
  computed: {
    ...mapGetters({
      isLoading: "Loading"
    })
  }
};
</script>
<style>
#app {
  float: none;
  margin: 10px auto;
}

#container {
  margin-bottom: 40px;
  margin-top: 25px;
}

input.form-control + span {
  position: absolute;
  top: 0px;
  right: 15px;
  font-size: x-large;
}

.loading {
  position: absolute;
  left: calc(50% - 20px);
  top: calc(50% - 20px);
  z-index: 10000;
}

.loading-container {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9999;
  background-color: whitesmoke;
  opacity: 0.6;
}

.font-14{
  font-size: 14px;
}
.font-12{
  font-size: 12px;
}
.font-10{
  font-size: 10px;
}
.font-8{
  font-size: 8px;
}
.pointer {
  cursor: pointer;
}
</style>
