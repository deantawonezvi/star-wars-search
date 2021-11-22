<template>
  <CBox w="40vw" mb="3">
    <CInput v-model="chosen" placeholder="Search" @click="showModal = true" @keyup.esc="closeResults" @keyup.enter="searchKeyword" />

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
        <p>Search Results: {{ searchResults.length }}</p>
        <hr />
        <div>
          <NuxtLink
            v-for="person in searchResults"
            :key="person.name"
            :to="`/people/${person.name}`"
            @click='saveSearchItem(person.name)'
          >
            <CPseudoBox
              mt="2"
              p="3"
              :_hover="{ bg: 'black', color: 'white', rounded: 'lg' }"
            >
              {{ person.name }}
            </CPseudoBox>
          </NuxtLink>
        </div>
      </CBox>
    </transition>
  </CBox>
</template>

<script lang="js">
import { CBox, CInput,CPseudoBox } from '@chakra-ui/vue'
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
    CPseudoBox

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
      chosen:'',
      searchResults:[],

    }
  },
  watch:{
    chosen(oldValue,newValue) {
      console.log(oldValue,newValue)
      this.searchKeyword()
    }
  },
  methods: {
    async searchKeyword() {
      if (this.chosen.length < 2) {
        this.showModal = false;
        return;
      }
      const client = this.$apollo.getClient()

      try {
        const res = await client.query({
          query    : CHARACTERS_BY_NAME_QUERY,
          variables: {
            name: this.chosen
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
      this.chosen = '';
      this.showModal = false
    },
    saveSearchItem(name) {
      console.log(name)

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
