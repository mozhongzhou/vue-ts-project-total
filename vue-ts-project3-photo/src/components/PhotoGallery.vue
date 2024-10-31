<template>
  <div class="photo-gallery">
    <h2>照片库</h2>
    <div>
      <input v-model="filterDate" type="date" placeholder="选择日期" />
      <input v-model="filterLocation" type="text" placeholder="输入地点" />
    </div>
    <div class="photos">
      <div v-for="photo in filteredPhotos" :key="photo.id" class="photo-item">
        <img :src="photo.url" :alt="`Photo taken on ${photo.date} at ${photo.location}`" />
        <p>{{ photo.date }} - {{ photo.location }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PhotoGallery",
  data() {
    return {
      photos: [],          // 所有照片列表
      filterDate: "",      // 日期筛选条件
      filterLocation: "",  // 地点筛选条件
    };
  },
  computed: {
    filteredPhotos() {
      return this.photos.filter((photo) => {
        const matchesDate = this.filterDate ? photo.date === this.filterDate : true;
        const matchesLocation = this.filterLocation
          ? photo.location.includes(this.filterLocation)
          : true;
        return matchesDate && matchesLocation;
      });
    },
  },
  methods: {
    async loadPhotos() {
      try {
        const response = await axios.get("http://localhost:3000/photos");
        this.photos = response.data; // 获取照片数据并赋值给 photos
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    },
  },
  created() {
    this.loadPhotos(); // 自动加载所有照片
  },
};
</script>

<style>
.photo-gallery {
  text-align: left;
}
.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.photo-item {
  width: 150px;
  text-align: center;
}
</style>