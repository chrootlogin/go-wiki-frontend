<template >
  <div v-if="error === 0">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Editor
          </h1>
        </div>
      </div>
    </section>
    <div class="container">
      <b-tabs
        v-model="activeEditorTab"
        type="is-boxed"
        @change="editorTabChanged">
        <b-tab-item label="Editor">
          <div v-if="createMode">
            <b-field label="Path">
              <b-input v-model="path"/>
            </b-field>
          </div>
          <markdown-editor
            ref="markdownEditor"
            v-model="page.content"/>
        </b-tab-item>
        <b-tab-item label="Preview">
          <div
            class="content"
            v-html="preview"/>
        </b-tab-item>
        <b-tab-item label="Settings">
          <b-field label="Path">
            <b-input
              v-model="path"
              disabled/>
          </b-field>
        </b-tab-item>
      </b-tabs>
      <p class="has-text-right">
        <button
          class="button is-danger"
          @click="cancel">
          <span>Cancel</span>
          <span class="icon is-small">
            <i class="fa fa-times"/>
          </span>
        </button>
        <button
          :class="{'is-loading': loading}"
          class="button is-primary"
          @click="save">
          <span>Save page</span>
          <span class="icon is-small">
            <i class="fa fa-save"/>
          </span>
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor.vue'

export default {
  components: {
    markdownEditor
  },
  data () {
    return {
      createMode: false,
      loading: false,
      error: 0,
      page: {
        title: '',
        content: ''
      },
      activeEditorTab: 0,
      preview: ''
    }
  },
  computed: {
    path () {
      let path = this.$route.query.path

      // fix url if needed...
      if (path == null) {
        path = ''
      }

      // remove first character if needed
      if (path.startsWith('/')) {
        path = path.substring(1)
      }

      return path
    }
  },
  watch: {
    '$route' (to, from) {
      if (to !== from) this.loadAsyncPageData()
    }
  },
  mounted: function () {
    this.loadAsyncPageData()
  },
  methods: {
    loadAsyncPageData: function () {
      this.$http.get(this.$store.state.backendURL + '/api/page/' + this.path + '?format=no-render').then(
        res => {
          this.error = 0
          this.createMode = false

          this.page = res.body
        }, res => {
          if (res.status === 404) {
            // remove error
            this.$store.commit('setNotification', {notification: {}})

            // switch to create mode
            this.createMode = true
            this.error = 0
            this.page = {
              content: '# Empty page'
            }
          } else {
            this.error = res.status
          }
        })
    },
    loadAsyncPreviewData: function () {
      this.$http.post(
        this.$store.state.backendURL + '/api/preview',
        {'content': this.page.content}
      ).then(
        res => {
          this.error = 0
          this.preview = res.body.content
        }, res => {
          this.error = res.status
        }
      )
    },
    redirectToPage: function (homepage) {
      // on main page, go direct
      if (homepage === 'index.md') {
        this.$router.push({
          name: 'page'
        })

        return
      }

      // otherwise, clean url
      if (homepage.endsWith('.md')) {
        homepage = homepage.substring(0, homepage.length - 3)
      }

      if (homepage.endsWith('index')) {
        homepage = homepage.substring(0, homepage.length - 5)
      }

      if (homepage.endsWith('/')) {
        homepage = homepage.substring(0, homepage.length - 1)
      }

      this.$router.push({
        name: 'page',
        params: {
          pageSlug: homepage
        }
      })
    },
    cancel () {
      if (this.createMode) {
        this.redirectToPage('')
      } else {
        this.redirectToPage(this.path)
      }
    },
    save () {
      this.loading = true

      if (this.createMode) {
        this.$http.post(
          this.$store.state.backendURL + '/api/page/' + this.path,
          this.page
        ).then(
          () => {
            this.loading = false

            this.$toast.open({
              type: 'is-success',
              message: 'Page created!'
            })

            this.redirectToPage(this.path)
          }, res => {
            this.loading = false

            this.error = res.status
          }
        )
      } else {
        this.$http.put(
          this.$store.state.backendURL + '/api/page/' + this.path,
          this.page
        ).then(
          () => {
            this.loading = false

            this.$toast.open({
              type: 'is-success',
              message: 'Page updated!'
            })

            this.redirectToPage(this.path)
          }, res => {
            this.loading = false

            this.error = res.status
          }
        )
      }
    },
    editorTabChanged (index) {
      if (index === 1) {
        this.loadAsyncPreviewData()
      }
    }
  }
}
</script>

<style>
    @import '~simplemde/dist/simplemde.min.css';
</style>
