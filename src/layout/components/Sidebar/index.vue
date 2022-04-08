<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
        <el-menu-item style="position: absolute; top: 900px;">
          <i class="el-icon-watch"></i>
          <span>{{realTime}}</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { getTimeZone } from "@/api/agency";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      realTime: "",
      TimeZone: "",
    };
  },
  mounted() {
    setInterval(()=>this.loadRealTime(this.zone), 1000) 
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    getTime() {
      getTimeZone().then((res) => {
        if (res.err_code == 0) {
          this.TimeZone = res.data.zone;
          console.log(this.TimeZone)
        }
      });
    },
    loadRealTime(zone) {      
      let options = {
          timeZone: zone,
          // year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        },
        formatter = new Intl.DateTimeFormat("zh-cn", options);


      this.realTime = formatter.format(new Date());
      console.log(this.realTime)
    },
  },
};
</script>
<style scoped>
.clock {
  background: red;
}
</style>
