<template>
  <CBox
    :width="[
      '90vw', // base
      '90vw', // 480px upwards
      '50vw', // 768px upwards
      '40vw', // 992px upwards
    ]"
    mb="3"
  >
    <div v-if="loading">Loading...</div>
    <CInput
      v-model="searchItem"
      focus-border-color="black"
      placeholder="Search"
      @click="showResults"
      @keyup.esc="closeResults"
      @keyup.enter="searchKeyword"
    />

    <transition name="fade">
      <CBox
        v-if="showModal"
        border-width="1px"
        rounded="lg"
        overflow="hidden"
        box-shadow="sm"
        p="5"
        mt="2"
      >
        <CFlex>
          <p class="search">Search Results: {{ searchResults.length }}</p>
        </CFlex>

        <hr />
        <div>
          <NuxtLink
            v-for="person in searchResults"
            :key="person.name"
            :to="`/people/${person.name}`"
            @click.native="saveSearchItem(person.name)"
          >
            <CPseudoBox
              mt="2"
              p="2"
              :_hover="{ bg: 'black', color: 'white', rounded: 'lg' }"
            >
              <span v-if="person.history">🕒️</span>
              <span class="search">{{ person.name }}</span>
            </CPseudoBox>
          </NuxtLink>
        </div>
        <hr />
        <div v-if="searchHistory.length > 0">
          <CButton variant-color="red" m='2' size="sm" @click="clearHistory">Clear History</CButton>
        </div>
      </CBox>
    </transition>
  </CBox>
</template>

<script lang="js">
import { CBox, CInput,CPseudoBox,CFlex,CButton } from '@chakra-ui/vue'
import { gql } from 'graphql-tag'
import _ from 'lodash'

const CHARACTERS_BY_NAME_QUERY = gql`
    query People($name:String!) {
        peopleByKeyWord(name:$name) {
            name
        }
    }
`;
export default {
  name: 'Search',
  components: {
    CBox,
    CInput,
    CPseudoBox,
    CFlex,
    CButton

  },
  data () {
    return {
      showModal: false,
      mainStyles: {
        dark: {
          bg: 'gray.700',
          color: 'whiteAlpha.900'
        },
        light: {
          bg: 'white',
          color: 'gray.900'
        }
      },
      searchItem:'',
      searchResults:[],
      client:{},
      loading:false

    }
  },
  computed: {
    searchHistory () {
      return _.reverse(this.$store.state.localStorage.list)
    }

  },
  watch:{
    searchItem() {
      this.searchKeyword()
    }
  },
  mounted() {
    this.searchResults.push(...this.searchHistory)
  },
  methods: {
    async searchKeyword() {

      if (this.searchItem.length < 1) {
        this.showModal = false;
        this.searchResults = [];
        this.searchResults.push(...this.searchHistory)
        return;
      }

      const history = this.searchResults


      this.searchResults = history.filter(obj => {
        return obj.name.toLowerCase().includes(this.searchItem.toLowerCase())
      })
      this.showModal = true;

      const client = this.$apollo.getClient()


      try {
        this.loading = true
        const res = await client.query({
          query    : CHARACTERS_BY_NAME_QUERY,
          variables: {
            name: this.searchItem
          },
        });


        if (res) {
          this.loading = false;
          this.searchResults.push(...res.data.peopleByKeyWord);

          const results = _.uniqBy(this.searchResults,'name')

          this.searchResults = results.filter(obj => {
            return obj.name.toLowerCase().includes(this.searchItem.toLowerCase())
          })

        }
      }catch (err) {
        this.loading = false;
        this.searchResults = [];
      }


      this.showModal = true;


    },
    closeResults() {
      this.searchItem = '';
      this.showModal = false
    },
    saveSearchItem(name) {
      this.$store.commit('localStorage/add', name)

    },
    showResults() {
      this.showModal = true
    },
    clearHistory() {
      this.searchResults = [];
      this.$store.commit('localStorage/resetState', name)
      return localStorage.removeItem('localStorage')
    }
  }

}
</script>

<style scoped>
.search {
  font-family: 'Inter', serif !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
