<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-1 text-sm text-gray-600">
      <!-- Zawsze dodajemy domek na początku -->
      <li class="flex items-center">
        <a href="/projects" class="block transition hover:text-gray-700">
          <span class="sr-only">Home</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </a>
        <svg
          v-if="breadcrumbs.length > 0"
          xmlns="http://www.w3.org/2000/svg"
          class="size-4 rtl:rotate-180 mt-[4px]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </li>

      <!-- Dynamically generated breadcrumbs -->
      <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <a v-if="item.url" :href="item.url" class="block transition hover:text-gray-700">
          <span> {{ item.label }} </span>
        </a>
        <span v-else class="block text-gray-700 font-medium"> {{ item.label }} </span>

        <!-- Separator, ale nie dodajemy go dla ostatniego elementu -->
        <svg
          v-if="index < breadcrumbs.length - 1"
          xmlns="http://www.w3.org/2000/svg"
          class="size-4 mt-[4px] rtl:rotate-180"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  breadcrumbs: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>
