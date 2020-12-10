<template>
  <div class="p-sm-5">
    <h1 class="text-muted"># Suggestions</h1>
    <hr/>
    <b-card>
      <div slot="header" class="clearfix">
        <b-input-group class="">
          <span class="w-50" style="font-size: 22px">Suggestions list</span>
          <b-input
              v-model="search"
              @keyup="loadCategoriesLazy"
              placeholder="Search..."
          ></b-input>
          <b-form-select class="ml-2" v-model="selectedLanguage" :options="Languages"></b-form-select>
        </b-input-group>
      </div>
      <b-table
          hover
          :items="suggestionsList.items"
          :fields="suggestionsList.fields"
          show-empty
          empty-html="<h6>There is no item to show!</h6>"
      >
        <template v-slot:cell(name)="data">
          <b-icon v-if="data.item.isPrivate" icon="lock-fill" class="text-danger"
                  v-b-popover.hover.top="'Private category'"></b-icon>
          <span class="text-muted font-weight-bolder">
            {{ data.value }}
          </span>
          <br/>
          <span class="font-italic" style="font-size: 8px">{{
              data.item.createdAt | moment("YYYY-MM-DD")
            }}</span>
          <span class="font-italic text-success ml-2" style="font-size: 10px">
            cards : {{
              data.item.cards
            }}
          </span>
        </template>
        <template v-slot:cell(language)="data">
          {{ data.value }}
        </template>
        <template v-slot:cell(rating)="data">
          {{ data.item.rate || 5 }}
          <b-icon icon="star-fill" class="text-warning"></b-icon>
        </template>
        <template v-slot:cell(actions)="data">
          <b-badge
              v-b-popover.hover.top="'want to learn'"
              variant="info"
              class="mx-1"
              @click="addToFavorites(data.item.id)"
          >
            <b-icon icon="plus-circle" class="pointer"></b-icon>
          </b-badge>
        </template>
      </b-table>
      <b-row v-show="suggestionsList.items.length" class="px-3">
        <b-pagination
            v-model="suggestionsList.pageNumber"
            :total-rows="suggestionsList.total"
            :per-page="suggestionsList.pageSize"
            @change="loadSuggestions"
            class="my-1 float-left"
        ></b-pagination>
      </b-row>
    </b-card>

    <b-card class="mt-3">
      <div slot="header" class="clearfix">
        <b-input-group class="">
          <span style="font-size: 22px"
          >My Categories
          </span>
        </b-input-group>
      </div>
      <b-table
          hover
          :items="myCategories.items"
          :fields="myCategories.fields"
          show-empty
          empty-html="<h6>There is no item to show!</h6>"
      >
        <template v-slot:cell(name)="data">
          <b-icon v-if="data.item.isPrivate" icon="lock-fill" class="text-danger"
                  v-b-popover.hover.top="'Private category'"></b-icon>
          <span class="text-muted font-weight-bolder">
            {{ data.value }}
          </span>
          <br/>
          <span class="font-italic" style="font-size: 8px">{{
              data.item.createdAt | moment("YYYY-MM-DD")
            }}</span>
        </template>
        <template v-slot:cell(language)="data">
          {{ data.value }}
        </template>
        <template v-slot:cell(rating)="data">
          {{ data.item.rate || 5 }}
          <b-icon icon="star-fill" class="text-warning"></b-icon>
        </template>
        <template v-slot:cell(actions)="data">
          <b-badge
              v-b-popover.hover.top=" data.item.isPrivate ? 'Make category public' : 'Make category private'"
              @click="changeCategoryStatus(data.item.id,!data.item.isPrivate)"
              class="mx-1 pointer"
              :variant="data.item.isPrivate ? 'success' : 'danger'"
          >
            <b-icon icon="shield-lock" class="pointer"></b-icon>
          </b-badge>
          <b-badge
              v-if="!data.item.learning"
              v-b-popover.hover.top="'want to learn'"
              variant="info"
              class="mx-1"
              @click="addToFavorites(data.item.id)"
          >
            <b-icon icon="plus-circle" class="pointer"></b-icon>
          </b-badge>
          <b-badge
              v-else
              v-b-popover.hover.top="'remove from learning'"
              variant="danger"
              class="mx-1"
              @click="removeFromFavorites(data.item.id)"
          >
            <b-icon icon="dash-circle" class="pointer"></b-icon>
          </b-badge>
          <b-badge
              :variant="data.item.learning?'success' : 'warning'"
              class="mx-1"
          >
            {{ data.item.learning ? 'learning' : 'not learning' }}
          </b-badge>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import {
  categorySuggestions,
  addCategoryToFavorite,
  getMyCategories,
  removeCategoryFromFavorite, makeCategoryPrivate,
  makeCategoryPublic, deleteCategory
} from "../gate";
import debounce from "debounce";

export default {
  name: "SuggestView",
  data() {
    return {
      search: null,
      selectedLanguage: 'English',
      languages: [],
      suggestionsList: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
        items: [],
        fields: [
          {key: "name", label: "Name"},
          {key: "language", label: "Language"},
          {key: "rating", label: "Rating"},
          {key: "actions", label: "Actions"}
        ]
      },
      myCategories: {
        items: [],
        fields: [
          {key: "name", label: "Name"},
          {key: "language", label: "Language"},
          {key: "rating", label: "Rating"},
          {key: "actions", label: "Actions"}
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      Languages: "Languages",
      User: "User"
    })
  },
  methods: {
    ...mapMutations({
      setLoading: "setLoading"
    }),
    loadSuggestions(page) {
      this.setLoading(true)
      categorySuggestions(this.suggestionsList.pageSize, page - 1, this.selectedLanguage, this.search)
          .then(res => {
            this.suggestionsList.items = res.data.categories
            this.suggestionsList.total = res.data.total
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false))
    },
    loadMyCategories() {
      this.setLoading(true)
      getMyCategories()
          .then(res => {
            this.myCategories.items = res.data
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false))
    },
    addToFavorites(catId) {
      this.setLoading(true)
      addCategoryToFavorite(catId)
          .then(res => {
            this.$toasted.global.success(res)
            this.loadSuggestions(this.suggestionsList.pageNumber)
            this.loadMyCategories()
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false))
    },
    removeFromFavorites(catId) {
      this.setLoading(true)
      removeCategoryFromFavorite(catId)
          .then(res => {
            this.$toasted.global.success(res)
            this.loadSuggestions(this.suggestionsList.pageNumber)
            this.loadMyCategories()
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false))
    },
    deleteCategory(catId) {
      this.setLoading(true)
      deleteCategory(catId)
          .then(res => {
            this.$toasted.global.success(res)
            this.loadSuggestions(this.suggestionsList.pageNumber)
            this.loadMyCategories()
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false))
    },
    loadCategoriesLazy() {
      this.loadSuggestions(this.suggestionsList.pageNumber)
    },
    changeCategoryStatus(catId, status) {
      this.setLoading(true)
      const todo = status ? makeCategoryPrivate : makeCategoryPublic
      todo(catId)
          .then(res => {
            this.$toasted.global.success(res)
            this.loadSuggestions(this.suggestionsList.pageNumber)
            this.loadMyCategories()
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false))
    },
  },
  created() {
    this.loadSuggestions()
    this.loadMyCategories()
    this.loadCategoriesLazy = debounce(this.loadCategoriesLazy, 700)
  },
  watch: {
    selectedLanguage() {
      this.loadSuggestions()
    }
  }
};
</script>

<style scoped>
</style>
