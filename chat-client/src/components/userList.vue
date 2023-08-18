<template>
  <ul class="contacts">
    <li v-for="contact in list" :key="contact.userId" @click="scan(contact)">
      <img :src="contact.avatar">
      <span>
          {{ contact.remark || contact.username }}
        </span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const chatModule = namespace("chat");
@Component
export default class Nav extends Vue {
  @Prop() list: User
  @chatModule.Mutation("set_active_room") _setActiveRoom: Function;

  scan(contact: User & Group) {
    this._setActiveRoom(contact);
    this.$router.push("chat");
  }
}
</script>
<style lang="scss" scoped>
.contacts {
  height: 100%;
  overflow-y: scroll;
  width: 100%;

  li {
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 4px 10px;

    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }
  }
}
</style>
