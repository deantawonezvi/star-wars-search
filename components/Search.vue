<template>
  <CBox  :width="[
      '90vw', // base
      '90vw', // 480px upwards
      '50vw', // 768px upwards
      '40vw', // 992px upwards
    ]" mb="3">
    <CInput v-model="searchItem" placeholder="Search" @click="showModal = true" @keyup.esc="closeResults" @keyup.enter="searchKeyword" />

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
        History
        <div>
        <hr>
        <CPseudoBox
          mt="2"
          mb='2'
          p="3"
          :_hover="{ bg: 'black', color: 'white', rounded: 'lg' }"
        >
          {{searchHistory}}
        </CPseudoBox>
        </div>
        <hr>
        <p>Search Results: {{ searchResults.length }}</p>
        <hr />
        <div>
          <NuxtLink
            v-for="person in searchResults"
            :key="person.name"
            :to="`/people/${person.name}`"
            @click.native='saveSearchItem(person.name)'
          >

            <CPseudoBox
              mt="2"
              p="2"
              :_hover="{ bg: 'black', color: 'white', rounded: 'lg' }"
            >
              <CIcon name="search"/>
              {{ person.name }}
            </CPseudoBox>
          </NuxtLink>
        </div>
      </CBox>
    </transition>
  </CBox>
</template>

<script lang="js">
import { CBox, CInput,CPseudoBox,CIcon } from '@chakra-ui/vue'
import { gql } from 'graphql-tag'

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
    CIcon

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

    }
  },
  computed: {
    searchHistory () {
      console.log(this.$store.state.searchHistory.list)

      return this.$store.state.searchHistory.list
    }
  },
  watch:{
    searchItem(oldValue,newValue) {
      console.log(oldValue,newValue)
      this.searchKeyword()
    }
  },
  methods: {
    async searchKeyword() {
      if (this.searchItem.length < 2) {
        this.showModal = false;
        return;
      }


      const client = this.$apollo.getClient()

      try {
        const res = await client.query({
          query    : CHARACTERS_BY_NAME_QUERY,
          variables: {
            name: this.searchItem
          },
        });

        if (res) {
          this.loading = false;
          this.searchResults = res.data.peopleByKeyWord;
        }
      }catch (err) {
        this.loading = false;
        this.searchResults = [];
      }


      this.showModal = true;


    },
    closeResults() {
      this.searchResults = [];
      this.searchItem = '';
      this.showModal = false
    },
    saveSearchItem(name) {
      this.$store.commit('searchHistory/add', name)

    }
  }

}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
