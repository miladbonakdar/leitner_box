<template>
  <div class="p-sm-5">
    <h1 class="text-muted"># Cards</h1>
    <hr />
    <b-card class="mb-4">
      <div slot="header" class="clearfix">
        <span
          class="align-middle"
          :class="editMode ? 'text-warning' : 'text-success'"
        >
          <i class="fa fa-paw"></i
          >{{ editMode ? "Edit card" : "Create new Card" }}</span
        >
      </div>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group
          id="input-group-1"
          label="Card front:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="card.front"
            type="text"
            required
            placeholder="Enter card front"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Card back:" label-for="input-2">
          <b-form-textarea
            id="input-2"
            v-model="card.back"
            rows="3"
            required
            placeholder="Enter card back"
          ></b-form-textarea>
        </b-form-group>
        <div>
          <b-button
            v-if="card.front || card.back"
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
            <i class="fa fa-paw"></i> Cards list</span
          >
          <b-input
            v-model="search"
            @keyup="loadCardsLazy"
            placeholder="Search..."
          ></b-input>
        </b-input-group>
      </div>
      <b-table
        hover
        :items="cardsList.items"
        :fields="cardsList.fields"
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
            data.item.creator.name
          }}</span>
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
            v-b-popover.hover.top="'Edit card'"
            v-if="data.item.canModify"
            class="mx-1 pointer"
            @click="selectForEdit(data.item)"
            variant="warning"
          >
            <b-icon icon="brush" class="pointer"></b-icon>
          </b-badge>
          <b-badge
            v-b-popover.hover.top="'Remove this card'"
            v-if="data.item.canModify"
            class="mx-1 pointer"
            @click="removeCard(data.item.id)"
            variant="danger"
          >
            <b-icon icon="bucket" class="pointer"></b-icon>
          </b-badge>
          <b-badge v-if="!data.item.canModify" class="mx-1"
            >You cannot modify!
          </b-badge>
          <a
            target="_blank"
            :href="
              'https://translate.google.co.uk/#view=home&op=translate&sl=en&tl=fa&text=' +
                data.item.front
            "
          >
            <b-badge
              v-b-popover.hover.top="'See details'"
              variant="info"
              class="mx-1"
            >
              <b-icon icon="search" class="pointer"></b-icon>
            </b-badge>
          </a>
        </template>
      </b-table>
      <b-row v-show="cardsList.items.length" class="px-3">
        <b-pagination
          v-model="cardsList.pageNumber"
          :total-rows="cardsList.total"
          :per-page="cardsList.pageSize"
          @change="loadCards"
          class="my-1 float-left"
          size="sm"
        ></b-pagination>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import debounce from "debounce";
import { getCardsList, createNewCard, updateCard, removeCard } from "../gate";

export default {
  name: "CardsView",
  data() {
    return {
      search: null,
      card: {
        front: null,
        back: null
      },
      editMode: false,
      cardsList: {
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
    loadCards(page) {
      this.setLoading(true);
      getCardsList(this.cardsList.pageSize, page - 1, this.search)
        .then(res => {
          this.cardsList.items = res.data.cards;
          this.cardsList.total = res.data.total;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.editMode) this.updateCard();
      else this.createCard();
    },
    createCard() {
      this.setLoading(true);
      createNewCard(this.card)
        .then(res => {
          this.$toasted.global.success(res);
          this.loadCards(this.cardsList.pageNumber);
          this.onReset();
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    updateCard() {
      this.setLoading(true);
      updateCard(this.card)
        .then(res => {
          this.$toasted.global.success(res);
          this.loadCards(this.cardsList.pageNumber);
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    onReset() {
      this.card = {
        front: null,
        back: null
      };
      this.editMode = false;
    },
    removeCard(cardId) {
      this.$toasted.show("Are you sure about removing this card?", {
        action: {
          text: "Yes",
          onClick: (e, toastObject) => {
            this.setLoading(true);
            toastObject.goAway(0);
            removeCard(cardId)
              .then(res => {
                this.$toasted.global.success(res);
                this.loadCards(this.cardsList.pageNumber);
              })
              .catch(e => this.$toasted.global.handleError(e))
              .finally(() => this.setLoading(false));
          }
        }
      });
    },
    selectForEdit(card) {
      this.card = card;
      this.editMode = true;
    },
    playCard(text, rate) {
      window.toSpeech(text, rate);
    },
    loadCardsLazy() {
      this.loadCards(this.cardsList.pageNumber);
    }
  },
  created() {
    this.loadCards(this.cardsList.pageNumber);
    this.loadCardsLazy = debounce(this.loadCardsLazy, 1000);
  }
};
</script>

<style scoped></style>
