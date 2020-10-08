<template>
  <div class="p-sm-5">
    <h1 class="text-muted"># Suggestions</h1>
    <hr />

    <b-card>
      <div slot="header" class="clearfix">
        <span class="align-middle">
          <i class="fa fa-paw"></i>Suggestions list</span
        >
      </div>
      <b-table
        hover
        fixed
        :items="suggestionsList.items"
        :fields="suggestionsList.fields"
        show-empty
        empty-html="<h6>There is no item to show!</h6>"
      >
        <template v-slot:cell(front)="data">
          <span class="text-muted font-weight-bolder">
            {{ data.value }}
          </span>
          <b-icon
            @click="playCard(data.value, 0.8)"
            class="pointer mx-1"
            scale="1.5"
            icon="volume-up"
            variant="success"
          ></b-icon>

          <br />
          <span class="font-italic" style="font-size: 8px">{{
            data.item.createdAt | moment("YYYY-MM-DD")
          }}</span>
        </template>
        <template v-slot:cell(back)="data">
          {{ data.value }}
          <b-icon
            @click="playCard(data.value, 1)"
            class="pointer mx-1"
            scale="1.5"
            icon="volume-up"
            variant="success"
          ></b-icon>
        </template>
        <template v-slot:cell(actions)="data">
          <b-badge
            v-b-popover.hover="'Learn this card'"
            @click="addToFavorites(data.item.id)"
            class="mx-1 pointer"
            variant="primary"
          >
            <b-icon icon="plus-circle" class="pointer"></b-icon>
          </b-badge>
          <a
            target="_blank"
            :href="
              'https://translate.google.co.uk/#view=home&op=translate&sl=en&tl=fa&text=' +
                data.item.front
            "
          >
            <b-badge
              v-b-popover.hover="'See details'"
              variant="info"
              class="mx-1"
            >
              <b-icon icon="search" class="pointer"></b-icon>
            </b-badge>
          </a>
          <b-badge
            v-b-popover.hover="'I know this card'"
            @click="knowThisCard(data.item.id)"
            class="mx-1 pointer"
            variant="success"
          >
            <b-icon icon="check" class="pointer"></b-icon>
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
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { getSuggestions, addToFavorites, knowTheCard } from "../gate";

export default {
  name: "SuggestView",
  data() {
    return {
      suggestionsList: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
        items: [],
        fields: [
          { key: "front", label: "Front" },
          { key: "back", label: "Back" },
          { key: "actions", label: "Actions" }
        ]
      }
    };
  },
  methods: {
    ...mapMutations({
      setLoading: "setLoading"
    }),
    loadSuggestions() {
      this.setLoading(true);
      getSuggestions(
        this.suggestionsList.pageSize,
        this.suggestionsList.pageNumber - 1
      )
        .then(res => {
          this.suggestionsList.items = res.data.cards;
          this.suggestionsList.total = res.data.total;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    addToFavorites(cardId) {
      this.setLoading(true);
      addToFavorites(cardId)
        .then(res => {
          this.$toasted.global.success(res);
          this.loadSuggestions();
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    playCard(text, rate) {
      window.toSpeech(text, rate);
    },
    knowThisCard(cardId) {
      this.$toasted.show("Do you know the card?", {
        action: {
          text: "Yes",
          onClick: (e, toastObject) => {
            this.setLoading(true);
            toastObject.goAway(0);
            knowTheCard(cardId)
              .then(res => {
                this.$toasted.global.success(res);
                this.loadSuggestions();
              })
              .catch(e => this.$toasted.global.handleError(e))
              .finally(() => this.setLoading(false));
          }
        }
      });
    }
  },
  created() {
    this.loadSuggestions();
  }
};
</script>

<style scoped></style>
