import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', {
  state: () => ({
    project: null,
    projectNumber: 0,
    post: null,
    postNumber: 0
  }),
  getters: {
    getProject: (state) => state.project,
    getProjectNumber: (state) => state.projectNumber,
    getIsLoading: (state) => state.isLoading,
    getIsSaveLoading: (state) => state.isSaveLoading,
    getPost: (state) => state.post,
    getPostNumber: (state) => state.postNumber
  },
  actions: {
    async store(title, description, is_checked, wp_url, wp_login, wp_password) {
      try {
        const response = await axios.post('/projects/store', {
          title,
          description,
          is_checked,
          wp_url,
          wp_login,
          wp_password
        })

        if (response.status === 200 || response.status === 201) {
          this.project = await this.show(response.data.data.id)
          return response.data
        } else {
          throw new Error('Unexpected response status')
        }
      } catch (error) {
        console.error('Store Error:', error) // Debugging line
        throw error
      }
    },
    async show(id) {
      try {
        const response = await axios.get('/projects/show/' + id)
        this.project = response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch project:', error)
      }
    },
    async index() {
      try {
        const response = await axios.get('/projects/index')
        console.log(response.data)
        this.project = response.data
        this.projectNumber = response.data.length
        return response.data
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    },
    async generateData(id, lang, type, subtype, description, custom_comment, targetAudience, tone) {
      this.isLoading = true
      try {
        const response = await axios.post('/projects/generate_data', {
          id,
          lang,
          type,
          subtype,
          description,
          custom_comment,
          targetAudience,
          tone
        })
        return response.data
      } catch (error) {
        console.error('Failed to generate data:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async saveData(id, type, subtype, description) {
      try {
        const response = await axios.post('/projects/save_data', {
          id,
          type,
          subtype,
          description
        })
        return response.data
      } catch (error) {
        console.error('Failed to save data:', error)
        throw error
      }
    },
    async editData(id, title, description, wp_url, wp_login, wp_password) {
      this.isSaveLoading = true
      try {
        const response = await axios.post('/projects/edit_data', {
          id,
          title,
          description,
          wp_url,
          wp_login,
          wp_password
        })
        return response.data
      } catch (error) {
        console.error('Failed to save data:', error)
        throw error
      } finally {
        this.isSaveLoading = false
      }
    },
    async editSeoData(id, seo_title, seo_description, seo_keywords) {
      this.isSaveLoading = true
      try {
        const response = await axios.post('/projects/edit_seo_data', {
          id,
          seo_title,
          seo_description,
          seo_keywords
        })
        return response.data
      } catch (error) {
        console.error('Failed to save data:', error)
        throw error
      } finally {
        this.isSaveLoading = false
      }
    },
    async savePost(title, content, type, project_id) {
      try {
        const response = await axios.post('/posts/store', { title, content, type, project_id })

        if (response.status === 200 || response.status === 201) {
          // this.project = await this.show(response.data.data.id)
          return response.data
        } else {
          throw new Error('Unexpected response status')
        }
      } catch (error) {
        console.error('Store Error:', error) // Debugging line
        throw error
      }
    },
    async indexPost(project_id) {
      try {
        const response = await axios.get('/posts/index', { params: { project_id } })
        console.log(response.data)
        this.post = response.data
        this.postNumber = response.data.length
        return response.data
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    },
    async showPost(id) {
      try {
        const response = await axios.get('/posts/show/' + id)
        this.project = response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch project:', error)
      }
    },
    async updatePost(id, title, content) {
      try {
        const response = await axios.post('/posts/save_data', {
          id,
          title,
          content
        })
        return response.data
      } catch (error) {
        console.error('Failed to save data:', error)
        throw error
      }
    },
    async saveColors(id, colors) {
      try {
        const response = await axios.post('/projects/save_colors', {
          id,
          colors
        })
        return response.data
      } catch (error) {
        console.error('Failed to save data:', error)
        throw error
      }
    },
    async saveFonts(id, fonts) {
      try {
        const response = await axios.post('/projects/save_fonts', {
          id,
          fonts
        })
        return response.data
      } catch (error) {
        console.error('Failed to save data:', error)
        throw error
      }
    },
    async analyseData(id, lang, type, custom_comment, post_id, content) {
      try {
        const response = await axios.post('/projects/analyse_data', {
          id,
          lang,
          type,
          custom_comment,
          post_id,
          content
        })
        return response.data
      } catch (error) {
        console.error('Failed to save data:', error)
        throw error
      }
    },
    async indexTypePost(project_id, type) {
      try {
        const response = await axios.post('/posts/index_type', {
          project_id,
          type
        })
        console.log(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    },
    async deletePost(id) {
      try {
        const response = await axios.post('/posts/delete_post', {
          id
        })
        console.log(response)
        return response.data
      } catch (error) {
        console.error('Failed to delete post:', error)
        throw error
      }
    },
    async indexAllPosts() {
      try {
        const response = await axios.get('/posts/index_all')
        console.log(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    },
    async countPosts() {
      try {
        const response = await axios.get('/posts/count_posts')
        console.log(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    },
    async exportPost(postId) {
      try {
        const response = await axios.post('/posts/export_to_wordpress/' + postId)
        return response.data // Zwracamy tylko Blob, a nie całą odpowiedź
      } catch (error) {
        console.error('Failed to fetch post export:', error)
        throw error
      }
    },
    async exportPdfAnalysis(data, locale, title) {
      try {
        const response = await axios.post(
          '/export-dynamic-pdf',
          { data, locale, title }, // Przekazujemy dane i język
          {
            responseType: 'blob' // Oczekujemy pliku jako odpowiedź
          }
        )
        return response.data // Zwracamy plik PDF jako Blob
      } catch (error) {
        console.error('Failed to fetch PDF export:', error)
        throw error
      }
    },
    async deleteProject(id) {
      try {
        const response = await axios.post('/projects/delete_project', {
          id
        })
        console.log(response)
        return response.data
      } catch (error) {
        console.error('Failed to delete post:', error)
        throw error
      }
    }
  }
})
