<template>
  <div class="upload-photo">
    <h2>上传照片</h2>
    <form @submit.prevent="uploadPhoto">
      <input type="file" @change="onFileChange" required />
      <input type="date" v-model="date" required />
      <input type="text" v-model="location" placeholder="输入地点" required />
      <button type="submit">上传</button>
    </form>
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadPhoto",
  data() {
    return {
      file: null,
      date: "",
      location: "",
      message: "",
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadPhoto() {
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("date", this.date);
      formData.append("location", this.location);
      try {
        const response = await axios.post("http://localhost:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.message = response.data.message; // 显示成功消息
        this.$emit("photoUploaded"); // 通知父组件照片上传成功
      } catch (error) {
        this.message = "上传失败: " + (error.response?.data || error.message); // 显示错误消息
        console.error("Error uploading photo:", error);
      }
    },
  },
};
</script>

<style>
.upload-photo {
  margin: 20px 0;
}
</style>