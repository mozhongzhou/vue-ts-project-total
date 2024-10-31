<template>
  <div class="photo-gallery">
    <h2>照片库</h2>
    <div class="filters">
      <input v-model="filterDate" type="date" placeholder="选择日期" />
      <input v-model="filterLocation" type="text" placeholder="输入地点" />
      <button @click="loadPhotos">筛选</button>
    </div>
    <div class="photos">
      <div v-for="photo in filteredPhotos" :key="photo.id" class="photo-item" @click="showPhoto(photo)">
        <img :src="photo.url" :alt="`Photo taken on ${photo.date} at ${photo.location}`" />
        <p>{{ photo.date }} - {{ photo.location }}</p>
      </div>
    </div>
    <div v-if="selectedPhoto" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <img :src="selectedPhoto.url" :alt="`Photo taken on ${selectedPhoto.date} at ${selectedPhoto.location}`" />
        <p>{{ selectedPhoto.date }} - {{ selectedPhoto.location }}</p>
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
      photos: [],
      filterDate: "",
      filterLocation: "",
      selectedPhoto: null,
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
        this.photos = response.data;
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    },
    showPhoto(photo) {
      this.selectedPhoto = photo;
    },
    closeModal() {
      this.selectedPhoto = null;
    },
  },
  created() {
    this.loadPhotos();
  },
};
</script>

<style>
.photo-gallery {
  text-align: left;
}
.filters {
  margin-bottom: 20px;
}
.photos {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.photo-item {
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}
.photo-item:hover {
  transform: scale(1.05);
}
.photo-item img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
.modal-content img {
  max-width: 100%;
  height: auto;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}
</style>