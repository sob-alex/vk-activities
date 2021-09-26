<template>
  <div class="about">
    <transition appear name="fade">
      <v-sheet
        class="d-flex justify-center align-center"
        color="white"
        height="400"
        elevation="2"
        ><transition appear name="fade-text">
          <div class="text-h2">Скоро...</div>
        </transition>
      </v-sheet>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s, transform 0.5s ease-out;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-text-enter-active,
.fade-text-leave-active {
  transition: opacity 1.3s, transform 0.7s ease-out;
}
.fade-text-enter, .fade-text-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
