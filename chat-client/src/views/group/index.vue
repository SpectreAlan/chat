<template>
  <div class="group">
    <div class="top">
      <span class="title">群组</span>
      <a-icon type="usergroup-add" theme="outlined"  @click="handleGroupSearch"/>
    </div>
    <ul class="groups">
      <li v-for="group in groupGather" :key="group.groupId" @click="scan(group)">
        <img class="room-card-type" src="~@/assets/group.png" alt="" />
        <span>
          {{ group.groupName }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const chatModule = namespace("chat");
@Component
export default class Nav extends Vue {
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Mutation('set_active_room') _setActiveRoom: Function;
  scan (group: Group) {
    this._setActiveRoom(group)
    this.$router.push('chat')
  }
  handleGroupSearch () {
    this.$router.push('/groupSearch')
  }
}
</script>
<style lang="scss" scoped>
.group {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 0;
  position: relative;
  background: rgb(236, 244, 250);

  .groups {
    height: 100%;
    overflow-y: scroll;
    width: 100%;

    li {
      text-align: left;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding: 4px 10px;
      img{
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
    }
  }

  .top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #eee;
    text-align: center;
    line-height: 60px;
    background: #fff;
    font-size: 16px;

    i {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
}
</style>
