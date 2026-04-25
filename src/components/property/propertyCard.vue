<template>
  <div class="card property-card h-100 shadow-sm border-0" style="transition: transform 0.2s, box-shadow 0.2s;">
    <img :src="property.img" class="card-img-top img-fluid rounded-top" :alt="property.title" style="height: 200px; object-fit: cover;">
    
    <div class="card-body d-flex flex-column flex-grow-1">
      <h5 class="card-title text-dark mb-1 font-weight-bold h6">{{ property.title }}</h5>
      <p class="small text-primary font-weight-bold mb-2">
        <i class="fas fa-map-marker-alt"></i> {{ property.city }} &bull; {{ property.type }}
      </p>
      
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="font-weight-bold">{{ property.price }}</span>
        <span><i class="fas fa-star text-warning small"></i> {{ property.rating }}</span>
      </div>
      
      <p class="card-text text-muted small">{{ property.text }}</p>
      
      <div class="mt-auto d-flex justify-content-between pt-3 border-top">
        <button class="btn btn-outline-secondary btn-sm" @click="$emit('open-details', property.id)">Деталі</button>
        <button class="btn btn-success btn-sm" @click="$emit('open-booking', property)">Забронювати</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  property: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>