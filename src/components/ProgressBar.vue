<template>
  <div>
    <span id="ProgressLabel" class="sr-only">Loading</span>

    <span
      role="progressbar"
      aria-labelledby="ProgressLabel"
      :aria-valuenow="percentage"
      class="relative block rounded-full bg-gray-300"
    >
      <span class="absolute inset-0 flex items-center justify-center text-[10px]/4">
        <span class="font-bold text-white">{{ percentage }}%</span>
      </span>

      <span
        class="block h-4 rounded-full bg-blue-700 text-center"
        :style="{ width: `${percentage}%` }"
      ></span>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  percentage: {
    type: String,
    required: true,
    validator: (value) => value >= 0 && value <= 100 // Upewniamy się, że procenty mieszczą się w zakresie 0-100
  }
})
</script>

<style>
/* Dodatkowe style, jeśli chcesz coś zmienić */
</style>
