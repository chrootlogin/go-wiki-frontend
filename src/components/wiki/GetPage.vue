<template>
  <section
    v-if="error === 0"
    class="section">
    <div class="container">
      <div class="notification">
        <nav
          class="breadcrumb is-hidden-mobile"
          aria-label="breadcrumbs">
          <ul v-html="breadcrumb"/>
        </nav>
      </div>
      <div class="columns">
        <div class="column is-one-fifth">
          <aside class="menu">
            <p
              v-if="user"
              class="menu-label">
              Page Administration
            </p>
            <ul
              v-if="user"
              class="menu-list">
              <li>
                <router-link :to="{ name: 'edit', query: { path: page.path } }">
                  <span>Edit page</span>
                  <span class="icon is-small">
                    <i class="fa fa-edit"/>
                  </span>
                </router-link>
              </li>
              <li>
                <a @click="createPage">
                  <span>Create page</span>
                  <span class="icon is-small">
                    <i class="fa fa-plus"/>
                  </span>
                </a>
              </li>
              <li>
                <a @click="deletePage">
                  <span>Delete page</span>
                  <span class="icon is-small">
                    <i class="fa fa-times"/>
                  </span>
                </a>
              </li>
            </ul>
            <p class="menu-label">
              Advanced
            </p>
            <ul class="menu-list">
              <li>
                <a :href="apiUrl">
                  <span>API Url</span>
                  <span class="icon is-small">
                    <i class="fa fa-code"/>
                  </span>
                </a>
              </li>
            </ul>
          </aside>
        </div>
        <div class="column">
          <article
            class="content"
            v-html="page.content"/>
          <div class="meta has-text-grey is-size-7">
            Last modified: {{ page["last-modified"] }} | Request time: {{ requestTime }} ms
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    pageSlug: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      loading: false,
      error: 0,
      page: {
        'content': '',
        'path': '',
        'last-modified': ''
      },
      breadcrumb: '',
      requestTime: 0
    }
  },
  computed: {
    url () {
      let url = this.pageSlug
      if (url == null) {
        url = ''
      }

      return url
    },
    user () {
      return this.$store.state.user
    },
    apiUrl () {
      return this.$store.state.backendURL + '/api/page/' + this.url
    }
  },
  watch: {
    '$route' (to, from) {
      if (to !== from) {
        this.loadPage()
      }
    }
  },
  mounted: function () {
    this.loadPage()
  },
  methods: {
    loadPage: function () {
      let pageSlug = this.pageSlug
      // fix url if needed...
      if (pageSlug == null) {
        pageSlug = ''
      }

      // always remove index.md
      if (pageSlug.endsWith('index.md')) {
        this.redirectToPage(
          pageSlug.substring(0, pageSlug.length - 9)
        )
        return
      }

      let startRequest = new Date().getTime()
      this.$http.get(this.$store.state.backendURL + '/api/page/' + pageSlug).then(
        res => {
          this.error = 0
          this.page = res.body
          this.renderBreadcrumb()

          // set request time
          let endRequest = new Date().getTime()
          this.requestTime = endRequest - startRequest
        }, res => {
          this.error = res.status
          this.renderBreadcrumb()
        }
      )
    },
    renderBreadcrumb: function () {
      let pageSlug = this.url
      let htmlList = []

      if (pageSlug == null || pageSlug === '') {
        this.breadcrumb = "<li class='is-active'><a href='#/wiki'><i class='fa fa-home'></i> Home</a></li>"
        return
      }

      pageSlug = pageSlug.split('/')
      if (this.page.path.endsWith('/index.md')) {
        pageSlug.push('Home')
      }

      htmlList.push("<li><a href='#/wiki'><i class='fa fa-home'></i> Home</a></li>")

      let lastElement = pageSlug.length - 1
      let fullUrl = '#/wiki/'
      pageSlug.forEach((slug, index) => {
        fullUrl += slug + '/'

        if (index < lastElement) {
          htmlList.push(`<li><a href="${fullUrl}">${slug}</a></li>`)
        } else {
          htmlList.push(`<li class="is-active"><a href="${fullUrl}">${slug}</a></li>`)
        }
      })

      // set breadcrumb
      this.breadcrumb = htmlList.join('')
    },
    redirectToPage: function (page) {
      if (page === '') {
        this.$router.push({
          name: 'page'
        })

        return
      }

      this.$router.push({
        name: 'page',
        params: {
          pageSlug: page
        }
      })
    },
    createPage () {
      this.$dialog.prompt({
        message: `URL of the new page?`,
        inputAttrs: {
          placeholder: 'e.g. my_page/',
          maxlength: 255,
          value: this.basename(this.page.path)
        },
        onConfirm: (value) => {
          this.$router.push({
            name: 'edit',
            query: {
              path: value
            }
          })
        }
      })
    },
    deletePage () {
      this.$http.delete(
        this.$store.state.backendURL + '/api/wiki/' + this.spaceKey + '/' + this.pageSlug
      ).then(
        () => {
          this.$toast.open({
            type: 'is-success',
            message: 'Page deleted!'
          })

          this.loadPage()
        }, res => {
          this.error = res.status
        })
    },
    basename (path) {
      return path.substring(0, path.lastIndexOf('/') + 1)
    }
  }
}
</script>
