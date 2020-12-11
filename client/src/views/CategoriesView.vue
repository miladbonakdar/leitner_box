<template>
  <div class="p-sm-5">
    <h1 class="text-muted"># Categories</h1>
    <hr/>
    <b-card class="mb-4">
      <div slot="header" class="clearfix">
        <span
            class="align-middle"
            :class="editMode ? 'text-warning' : 'text-success'"
        >
          <i class="fa fa-paw"></i
          >{{ editMode ? "Edit category" : "Create new category" }}</span
        >
      </div>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-row>
          <b-form-group class="col-md-6"
                        id="input-group-1"
                        label="* Category name:"
                        label-for="input-1"
          >
            <b-form-input
                id="input-1"
                v-model="category.name"
                type="text"
                required
                placeholder="Enter category name"
            ></b-form-input>
          </b-form-group>

          <b-form-group class="col-md-6"
                        label="* Language:"
                        label-for="input-1"
          >

            <multi-select
                v-model="category.language"
                :options="Languages" :disabled="editMode">
              <template slot="singleLabel" slot-scope="{option}">{{ option }}</template>
              <template slot="option" slot-scope="{option}">{{ option }}</template>
            </multi-select>
          </b-form-group>

          <b-form-group class="col-md-6" id="input-group-2" label="Category description:" label-for="input-2">
            <b-form-textarea
                id="input-2"
                v-model="category.description"
                rows="3"
                placeholder="Description"
            ></b-form-textarea>
          </b-form-group>
        </b-row>
        <div>
          <b-button
              v-if="category.name || category.description"
              class="float-left"
              type="reset"
              variant="danger"
          >Reset
          </b-button>
          <b-button
              class="float-right"
              type="submit"
              :variant="editMode ? 'warning' : 'success'"
          >
            {{ editMode ? "Edit" : "Create" }}
          </b-button>
        </div>
      </b-form>
    </b-card>

    <b-card>
      <div slot="header" class="clearfix">
        <b-input-group class="">
          <span class="w-50" style="font-size: 22px">
            <i class="fa fa-paw"></i> Categories list</span
          >
          <b-input
              v-model="search"
              @keyup="loadCategoriesLazy"
              placeholder="Search..."
          ></b-input>
        </b-input-group>
      </div>
      <b-table
          hover
          :items="categoriesList.items"
          :fields="categoriesList.fields"
          show-empty
          empty-html="<h6>There is no item to show!</h6>"
      >
        <template v-slot:cell(name)="data">
          <span class="text-muted font-weight-bolder">
            {{ data.value }}
          </span>
          <br/>
          <span class="font-italic" style="font-size: 8px">{{
              data.item.creator.name
            }}</span>
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
        <template v-slot:cell(category)="data">
          {{ data.value.name }} -
          <span style="font-size: 12px" class="text-muted">{{ data.value.language }}</span>
        </template>
        <template v-slot:cell(actions)="data">
          <b-badge
              v-b-popover.hover.top="'Edit category'"
              class="mx-1 pointer"
              @click="selectForEdit(data.item)"
              variant="warning"
          >
            <b-icon icon="brush" class="pointer"></b-icon>
          </b-badge>
          <b-badge
              v-b-popover.hover.top="'Remove this category'"
              class="mx-1 pointer"
              @click="removeCategory(data.item.id)"
              variant="danger"
          >
            <b-icon icon="bucket" class="pointer"></b-icon>
          </b-badge>
          <a
              target="_blank"
              :href="
              'https://translate.google.co.uk/#view=home&op=translate&sl=en&tl=fa&text=' +
                data.item.front
            "
          >
          </a>
        </template>
      </b-table>
      <b-row v-show="categoriesList.items.length" class="px-3">
        <b-pagination
            v-model="categoriesList.pageNumber"
            :total-rows="categoriesList.total"
            :per-page="categoriesList.pageSize"
            @change="loadCategories"
            class="my-1 float-left"
            size="sm"
        ></b-pagination>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import debounce from "debounce";
import {listCategories, createCategory, updateCategory, deleteCategory} from "../gate";

export default {
  name: "CategoriesView",
  data() {
    return {
      search: null,
      category: {
        name: null,
        language: null,
        description: null,
      },
      editMode: false,
      categoriesList: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
        items: [],
        fields: [
          {key: "name", label: "Name"},
          {key: "language", label: "Language"},
          {key: "rating", label: "Rating"},
          {key: "actions", label: "Actions"},
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      Languages: "Languages"
    }),
  },
  methods: {
    ...mapMutations({
      setLoading: "setLoading"
    }),
    loadCategories(page) {
      this.setLoading(true);
      listCategories(this.categoriesList.pageSize, page - 1, this.search)
          .then(res => {

            this.categoriesList.items = res.data.categories;
            this.categoriesList.total = res.data.total;
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false));
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.editMode) this.updateCategory();
      else this.createCategory();
    },
    createCategory() {
      this.setLoading(true);
      createCategory(this.category)
          .then(res => {
            this.$toasted.global.success(res);
            this.loadCategories(this.categoriesList.pageNumber);
            this.onReset();
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false));
    },
    updateCategory() {
      this.setLoading(true);
      updateCategory(this.category)
          .then(res => {
            this.$toasted.global.success(res);
            this.loadCategories(this.categoriesList.pageNumber);
            this.onReset();
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false));
    },
    onReset() {
      this.category = {
        name: null,
        language: null,
        description: null,
      };
      this.editMode = false;
    },
    removeCategory(catId) {
      this.$toasted.show("Are you sure about removing this category?", {
        action: {
          text: "Yes",
          onClick: (e, toastObject) => {
            this.setLoading(true);
            toastObject.goAway(0);
            deleteCategory(catId)
                .then(res => {
                  this.$toasted.global.success(res);
                  this.loadCategories(this.categoriesList.pageNumber);
                })
                .catch(e => this.$toasted.global.handleError(e))
                .finally(() => this.setLoading(false));
          }
        }
      });
    },
    selectForEdit(category) {
      this.category = category;
      this.editMode = true;
    },
    loadCategoriesLazy() {
      this.loadCategories(this.categoriesList.pageNumber);
    }
  },
  created() {
    this.loadCategories(this.categoriesList.pageNumber);
    this.loadCategoriesLazy = debounce(this.loadCategoriesLazy, 1000);
  }
};
</script>

<style scoped></style>
