<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/project'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from '@/components/Navigation.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SelectInput from '@/components/forms/SelectInput.vue'
import DynamicHtmlRenderer from '@/components/DynamicHtmlRenderer.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import TextareaForm from '@/components/forms/TextareaForm.vue'
// import FacebookPost from '@/components/FacebookPost.vue'
// import TwitterPost from '@/components/TwitterPost.vue'
// import InstagramPost from '@/components/InstagramPost.vue'
import ColorPalette from '@/components/ColorPalette.vue'
import MarkdownViewer from '@/components/MarkdownViewer.vue'

const authStore = useAuthStore()
const route = useRoute()
const projectStore = useProjectStore()
const user = ref(null)
const project = ref(null)
const language = ref('')
const type = ref('')
const errors = ref([])
const subtype = ref('')
const tempResponse = ref(null)
const { t } = useI18n()
const isResultGenerated = ref(false)
const isSaved = ref(false)
const resultType = ref('')
const postTitle = ref('')
const customComment = ref('')
const targetAudience = ref('')
const tone = ref('')
// const isEditTru

onMounted(async () => {
  user.value = await authStore.fetchUser()
})

const isLoading = ref(false)
const isSaveLoading = ref(false)

onBeforeMount(async () => {
  project.value = await projectStore.show(route.params.id)
})

const colors = ref([]) // Tablica kolorów

const generateData = async () => {
  errors.value = []
  isLoading.value = true
  try {
    let response = await projectStore.generateData(
      project.value.data.id,
      language.value,
      type.value,
      subtype.value,
      project.value.data.description,
      customComment.value,
      targetAudience.value,
      tone.value
    )
    tempResponse.value = response
    postTitle.value = response.blog_title
    isResultGenerated.value = true
    isSaved.value = false
    resultType.value = subtype.value

    // Automatyczne pobranie kolorów, jeśli subtype to 'colors'
    if (subtype.value === 'colors' && tempResponse.value?.result) {
      colors.value = tempResponse.value.result
    }

    return response
  } catch (error) {
    if (error && error.response && error.response.data) {
      const errorData = error.response.data

      for (const key in errorData) {
        if (Array.isArray(errorData[key])) {
          errors.value.push(...errorData[key])
        } else if (typeof errorData[key] === 'string') {
          errors.value.push(errorData[key])
        } else {
          errors.value.push(String(errorData[key]))
        }
      }
    } else {
      errors.value.push('Failed to generate data. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

// Funkcja do wyodrębniania kolorów z odpowiedzi AI
const extractColorsFromResponse = (responseText) => {
  const colorRegex = /#([0-9A-Fa-f]{6})/g // Wyszukuje kody HEX w odpowiedzi
  const matches = responseText.match(colorRegex) // Zwraca tablicę dopasowań

  return matches ? matches.map((hex) => ({ hex })) : [] // Tworzy obiekty kolorów
}

const saveData = async (contentType) => {
  errors.value = []
  isSaveLoading.value = true
  console.log('Begin! ' + isSaveLoading.value)
  try {
    let response = null
    if (contentType == 'SEO') {
      response = await projectStore.saveData(
        project.value.data.id,
        type.value,
        subtype.value,
        tempResponse.value.result
      )
    } else if (contentType == 'Branding') {
      if (subtype.value == 'fonts') {
        response = await projectStore.saveFonts(project.value.data.id, tempResponse.value.result)
      } else if (subtype.value == 'colors') {
        response = await projectStore.saveColors(project.value.data.id, colors.value)
      }
    } else {
      response = await projectStore.savePost(
        postTitle.value
          ? postTitle.value
          : project.value.data.title + '-' + subtype.value + '-' + Date.now(),
        tempResponse.value.result,
        subtype.value,
        project.value.data.id
      )
    }

    isSaved.value = true
    return response
  } catch (error) {
    if (error) {
      for (const key in error.response.data) {
        errors.value.push(...error.response.data[key])
      }
    } else {
      errors.value.push('Failed to save data. Please try again.')
    }
  } finally {
    isSaveLoading.value = false
    console.log('Saved! ' + isSaveLoading.value)
  }
}

const contentTypes = [
  {
    value: 'SEO',
    label: 'SEO for website',
    isChildren: true,
    children: [
      { value: 'meta-description', label: 'Meta Description' },
      { value: 'meta-keywords', label: 'Meta Keywords' },
      { value: 'title', label: 'Title' }
    ]
  },
  {
    value: 'Blog',
    label: 'Blog',
    isChildren: true,
    children: [{ value: 'wordpress', label: 'WordPress' }],
    isTone: true,
    tone: [
      { value: 'formal', label: 'Formal' },
      { value: 'informal', label: 'Informal' }
    ],
    isTargetAudience: true,
    targetAudience: [
      { value: 'young', label: 'Young' },
      { value: 'adults', label: 'Adults' },
      { value: 'seniors', label: 'Seniors' }
    ]
  },
  {
    value: 'Social Media',
    label: 'Social Media',
    isChildren: true,
    children: [
      { value: 'facebook', label: 'Facebook' },
      { value: 'twitter', label: 'X (Twitter)' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'linkedin', label: 'LinkedIn' }
    ],
    isTone: true,
    tone: [
      { value: 'formal', label: 'Formal' },
      { value: 'informal', label: 'Informal' }
    ],
    isTargetAudience: true,
    targetAudience: [
      { value: 'young', label: 'Young' },
      { value: 'adults', label: 'Adults' },
      { value: 'seniors', label: 'Seniors' }
    ]
  },
  {
    value: 'Branding',
    label: 'Branding',
    isChildren: true,
    children: [
      { value: 'colors', label: 'Colors' },
      { value: 'fonts', label: 'Fonts' }
    ]
  }
]

const languages = [
  { value: 'Polish', label: 'Polish' },
  { value: 'English', label: 'English' }
]
</script>

<template>
  <Navigation>
    <div>
      <Breadcrumb
        class="mb-4"
        :breadcrumbs="[
          { label: project?.data?.title, url: '/projects/' + project?.data?.id },
          { label: t('Generate data'), url: null }
        ]"
      />
    </div>
    <h2 class="text-xl font-semibold mb-4">{{ project?.data?.title }}</h2>
    <div class="p-6 bg-white border-2 border-gray-100 rounded-lg shadow-sm">
      <SelectInput
        v-model="type"
        :options="contentTypes"
        label="Choose content type"
        name="type"
        :useTranslation="false"
      />

      <SelectInput
        v-if="contentTypes.find((item) => item.value === type)?.isTargetAudience"
        v-model="targetAudience"
        :options="contentTypes.find((item) => item.value === type)?.targetAudience"
        label="Choose target audience"
        name="targetAudience"
        :useTranslation="false"
      />

      <SelectInput
        v-if="contentTypes.find((item) => item.value === type)?.isTone"
        v-model="tone"
        :options="contentTypes.find((item) => item.value === type)?.tone"
        label="Choose tone"
        name="tone"
        :useTranslation="false"
      />

      <span v-if="type == 'SEO' || type == 'Blog' || type == 'Social Media' || type == 'Branding'">
        <SelectInput
          v-if="contentTypes.find((item) => item.value === type)?.isChildren"
          v-model="subtype"
          :options="contentTypes.find((item) => item.value === type)?.children"
          label="Choose category"
          name="type"
          :useTranslation="false"
        />
        <!-- Tones -->
        <!-- <SelectInput
          v-if="
            contentTypes
              .find((item) => item.value === type)
              ?.children?.find((item) => item.value === subtype)?.isTone
          "
          v-model="tone"
          :options="
            contentTypes
              .find((item) => item.value === type)
              ?.children?.find((item) => item.value === subtype)?.tone
          "
          label="Choose tone"
          name="tone"
          :useTranslation="false"
        /> -->

        <!-- Target Group -->
        <!-- <SelectInput
          v-if="
            contentTypes
              .find((item) => item.value === type)
              ?.children?.find((item) => item.value === subtype)?.isTargetGroup
          "
          v-model="targetGroup"
          :options="
            contentTypes
              .find((item) => item.value === type)
              ?.children?.find((item) => item.value === subtype)?.targetGroup
          "
          label="Choose target group"
          name="targetGroup"
          :useTranslation="false"
        /> -->
      </span>

      <div class="mb-4 w-64" v-if="subtype != 'Branding'">
        <SelectInput
          v-model="language"
          :options="languages"
          label="Choose your language"
          name="type"
          :useTranslation="false"
        />
      </div>

      <div class="mb-4">
        <TextareaForm
          v-if="
            (contentTypes.find((item) => item.value === type)?.isChildren && type == 'Blog') ||
            type == 'Social Media'
          "
          v-model="customComment"
          label="Own comment (Optional)"
          name="customComment"
          :rows="3"
          :useTranslation="false"
        />
      </div>

      <ErrorAlert v-if="errors.length" :errors="errors" />

      <div
        v-if="
          (isLoading == false && isResultGenerated && resultType == 'meta-description') ||
          resultType == 'meta-keywords' ||
          resultType == 'title'
        "
      >
        <p class="block text-xl font-medium text-gray-900 mb-2">{{ t('Result') }}</p>
        <DynamicHtmlRenderer v-if="tempResponse" :htmlContent="tempResponse?.result" />
      </div>

      <div v-if="isLoading == false && isResultGenerated && resultType == 'wordpress'">
        <p class="block text-xl font-medium text-gray-900 mb-2">{{ t('Result') }}</p>
        <MarkdownEditor :modelValue="tempResponse?.result" />
      </div>

      <div v-if="isLoading == false && isResultGenerated && resultType == 'colors'">
        <p class="block text-xl font-medium text-gray-900 mb-2">{{ t('Result') }}</p>
        <ColorPalette :aiResponse="tempResponse?.result" />
      </div>

      <div v-if="isLoading == false && isResultGenerated && resultType == 'fonts'">
        <p class="block text-xl font-medium text-gray-900 mb-2">{{ t('Result') }}</p>
        <MarkdownViewer :response="tempResponse?.result" />
      </div>

      <div
        v-if="
          (isLoading == false && isResultGenerated && resultType == 'facebook') ||
          resultType == 'twitter' ||
          resultType == 'instagram' ||
          resultType == 'linkedin'
        "
      >
        <TextareaForm
          v-model="tempResponse.result"
          label="Result"
          name="result"
          :rows="resultType == 'facebook' ? 12 : 4"
          :useTranslation="false"
        />
        <!--
        <FacebookPost
          v-if="isResultGenerated && resultType == 'facebook'"
          :content="tempResponse?.result"
          :author="project?.data?.title"
        />

        <TwitterPost
          v-if="isResultGenerated && resultType == 'twitter'"
          :content="tempResponse?.result"
          :user="{
            name: project?.data?.title,
            username: project?.data?.title,
            avatar: 'https://cdn.fakercloud.com/avatars/nilshoenson_128.jpg'
          }"
        />

        <InstagramPost
          v-if="isResultGenerated && resultType == 'instagram'"
          :content="tempResponse?.result"
          :user="{
            name: project?.data?.title,
            username: project?.data?.title
          }"
          image="https://images.unsplash.com/photo-1566932769119-7a1fb6d7ce23?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />  -->
      </div>

      <div class="flex">
        <div class="my-2 flex">
          <button
            @click="generateData()"
            type="button"
            class="mr-2 focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 w-[160px]"
          >
            <div v-if="isLoading == false">
              <span v-if="isResultGenerated == false">{{ t('Generate data') }}</span>
              <span v-else>{{ t('Generate again') }}</span>
            </div>
            <LoadingSpinner v-else />
          </button>
          <button
            v-if="isResultGenerated == true && isSaved == false"
            @click="saveData(type)"
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 w-[160px] mr-2"
          >
            <div v-if="isSaveLoading == false">
              <span>
                {{ t('Save result') }}
              </span>
            </div>
            <LoadingSpinner v-else />
          </button>
          <div
            v-if="isSaved"
            class="focus:outline-none text-white text-center bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 w-[220px]"
          >
            <font-awesome-icon :icon="['fas', 'circle-check']" />
            {{ t('Data saved successfully') }}
          </div>
        </div>
      </div>
    </div>
  </Navigation>
</template>
