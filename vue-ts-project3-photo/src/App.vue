<template>
  <div id="app">
    <h1>照片管理系统</h1>
    <!-- 照片库组件，显示所有照片 -->
    <PhotoGallery ref="photoGallery" />
    <!-- 上传照片组件，位于页面底部 -->
    <UploadPhoto @photoUploaded="refreshPhotos" />
  </div>
</template>

<script>
import PhotoGallery from "./components/PhotoGallery.vue";
import UploadPhoto from "./components/UploadPhoto.vue";

export default {
  name: "App",
  components: {
    PhotoGallery,
    UploadPhoto,
  },
  methods: {
    // 调用 PhotoGallery 组件中的 loadPhotos 方法来加载照片
    refreshPhotos() {
      this.$refs.photoGallery.loadPhotos();
    },
  },
  mounted() {
    this.refreshPhotos(); // 页面加载时自动调用，显示所有照片
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
h1 {
  font-size: 2rem;
  color: #42b983;
}
</style>