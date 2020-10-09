<template>
  <div class="p-sm-5">
    <keyListener v-on:keyup="keyPressed"></keyListener>
    <h1 class="text-muted"># Session</h1>
    <hr />
    <div v-if="!info.session.isOpen">
      <b-row>
        <div class="col-md-6 col-sm-12 col-lg-4">
          <b-form-group>
            <label class="text-muted font-bold h4">Full Name :</label>
            <label class="text-success h4 ml-4">{{ User.name }}</label>
          </b-form-group>
        </div>
        <div class="col-md-6 col-sm-12 col-lg-4">
          <b-form-group>
            <label class="text-muted font-bold h4">Username :</label>
            <label class="text-success h4 ml-4">{{ User.username }}</label>
          </b-form-group>
        </div>
        <div class="col-md-6 col-sm-12 col-lg-4">
          <b-form-group>
            <label class="text-muted font-bold h4">Session :</label>
            <b-badge
              v-if="User.session.isOpen"
              variant="success"
              class="h4 ml-4"
            >
              Open at {{ User.session.lastSlot }}
            </b-badge>
            <b-badge v-else variant="warning" class="h4 ml-4">
              Closed
            </b-badge>
          </b-form-group>
        </div>

        <div class="col-md-6 col-sm-12 col-lg-4">
          <b-form-group>
            <label class="text-muted font-bold h4">Want to learn :</label>
            <label class="text-success h4 ml-4"
              >{{ User.wantToLearnCount }} cards</label
            >
          </b-form-group>
        </div>

        <div class="col-md-6 col-sm-12 col-lg-4">
          <b-form-group>
            <label class="text-muted font-bold h4">Learning :</label>
            <label class="text-success h4 ml-4"
              >{{ User.learningCount }} cards</label
            >
          </b-form-group>
        </div>

        <div class="col-md-6 col-sm-12 col-lg-4">
          <b-form-group>
            <label class="text-muted font-bold h4">Learned :</label>
            <label class="text-success h4 ml-4"
              >{{ User.learnedCount }} cards</label
            >
          </b-form-group>
        </div>
      </b-row>
      <hr />
      <b-form-group>
        <b-button variant="info" @click="newSession">
          <b-icon icon="award"></b-icon>
          New Session
        </b-button>
      </b-form-group>
    </div>
    <div v-else class="col-xs-12 mx-3 mb-3">
      <b-form-group>
        <label class="text-muted h6">Session progress : </label>
        <b-progress :max="progressMax" height="1.3rem" variant="info" animated>
          <b-progress-bar :value="progressValue">
            <span
              >Step:
              <strong>{{ progressValue }} / {{ progressMax }}</strong></span
            >
          </b-progress-bar>
        </b-progress>
      </b-form-group>
    </div>

    <div
      v-if="
        info.session.isOpen && info.session.lastSlot === 0 && !zeroListFinalized
      "
      class="col-sm-12 mt-3"
    >
      <b-card>
        <div slot="header" class="clearfix">
          <span class="align-middle">
            <i class="fa fa-paw"></i>Select your new cards to learn</span
          >
        </div>

        <b-row>
          <div class="col-sm-12 col-md-6">
            <h4 class="text-muted">Want to learn</h4>
            <b-table
              small
              hover
              :items="favoritesList.items"
              :fields="favoritesList.fields"
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
                <br />
                <b-badge
                  v-b-popover.hover.top="'Add to card you want to learn'"
                  @click="addToZeroList(data.item)"
                  class="mx-1 pointer"
                  variant="primary"
                >
                  <b-icon icon="plus-circle" class="pointer"></b-icon>
                </b-badge>
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
            </b-table>
          </div>
          <div class="col-sm-12 col-md-6">
            <h4 class="text-muted">
              Random suggestion
              <b-icon
                @click="loadRandomSuggestions"
                v-b-popover.hover.top="'Reload random cards'"
                class="pointer mx-2"
                scale="1.2"
                variant="success"
                icon="arrow-clockwise"
              ></b-icon>
            </h4>
            <b-table
              small
              hover
              :items="randomSuggestedList.items"
              :fields="randomSuggestedList.fields"
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
                <br />
                <b-badge
                  v-b-popover.hover.top="'Add to card you want to learn'"
                  @click="addToZeroList(data.item)"
                  class="mx-1 pointer"
                  variant="primary"
                >
                  <b-icon icon="plus-circle" class="pointer"></b-icon>
                </b-badge>
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
            </b-table>

            <h4 class="text-muted mt-3">Suggestions</h4>
            <b-table
              small
              hover
              :items="suggestedList.items"
              :fields="suggestedList.fields"
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
                <br />
                <b-badge
                  v-b-popover.hover.top="'Add to card you want to learn'"
                  @click="addToZeroList(data.item)"
                  class="mx-1 pointer"
                  variant="primary"
                >
                  <b-icon icon="plus-circle" class="pointer"></b-icon>
                </b-badge>
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
            </b-table>
            <b-row v-show="suggestedList.items.length" class="px-3">
              <b-pagination
                v-model="suggestedList.pageNumber"
                :total-rows="suggestedList.total"
                :per-page="suggestedList.pageSize"
                @change="loadSuggestions"
                class="my-1 float-left"
              ></b-pagination>
            </b-row>
          </div>
          <div class="col-sm-12">
            <h4 class="text-muted">Selected cards</h4>
            <hr />
            <b-button-group
              class="mr-2 mb-2"
              v-for="card in zeroList"
              v-bind:key="card.id"
            >
              <b-button
                v-b-popover.hover.top="card.back"
                @click="playCard(card.front, 0.8)"
                variant="info"
              >
                {{ card.front }}
                <b-icon
                  class="pointer mx-1"
                  scale="1.2"
                  icon="volume-up"
                ></b-icon>
              </b-button>
              <b-button variant="danger" @click="removeFromZeroList(card.id)">
                <b-icon class="pointer" scale="1.2" icon="x-circle"></b-icon>
              </b-button>
            </b-button-group>
            <hr />
            <b-button @click="confirmCards" variant="primary">
              Confirm selected cards
              <b-icon class="ml-1" icon="arrow-right-circle"></b-icon>
            </b-button>
          </div>
        </b-row>
      </b-card>
    </div>
    <div
      v-if="
        info.session.isOpen &&
          (info.session.lastSlot !== 0 ||
            (info.session.lastSlot === 0 && zeroListFinalized))
      "
      class="col-sm-12 mt-3"
    >
      <b-form-group class="mb-5">
        <label class="text-muted h6">Cards progress : </label>
        <b-progress
          :max="info.cards.length"
          height="1.3rem"
          variant="warning"
          animated
        >
          <b-progress-bar :value="cardProgressValue">
            <span
              >Card:
              <strong
                >{{ cardProgressValue }} / {{ info.cards.length }}</strong
              ></span
            >
          </b-progress-bar>
        </b-progress>
      </b-form-group>
      <div class="w-100">
        <b-card class="mb-2 col-md-4 col-sm-12 mx-auto">
          <span class="text-muted font-italic" style="font-size: 12px">
            Repeat {{ 6 - progressValue + 1 }} / {{ progressMax }}</span
          >
          <h3 class="font-weight-bold">
            {{ selectedCard.front }}
            <b-icon
              @click="playCard(selectedCard.front, 0.8)"
              class="pointer mx-1"
              scale="1.2"
              icon="volume-up"
              variant="success"
            ></b-icon>
            <b-icon
              @click="flipCardBack"
              class="pointer mx-1"
              scale="1"
              icon="eye-fill"
              variant="primary"
            ></b-icon>
          </h3>

          <template v-if="selectedCard.show">
            <hr />
            <h4 class="text-muted">
              {{ selectedCard.back }}
              <b-icon
                @click="playCard(selectedCard.back, 1)"
                class="pointer mx-1"
                scale="1.2"
                icon="volume-up"
                variant="success"
              ></b-icon>
            </h4>
          </template>

          <span class="text-muted font-italic">Was it correct ?</span>
          <hr />
          <b-button
            :active="!stepFinished"
            class="float-left"
            variant="danger"
            @click="moveNext(false)"
          >
            <b-icon icon="x"></b-icon>
            NO
          </b-button>
          <b-button
            :active="!stepFinished"
            class="float-right"
            variant="success"
            @click="moveNext(true)"
          >
            <b-icon icon="check"></b-icon>
            YES
          </b-button>
        </b-card>
      </div>
      <template v-if="info.session.lastSlot === 0">
        <hr />
        <b-button @click="backToCardSelection()" variant="warning">
          <b-icon class="mr-1" icon="arrow-left-circle"></b-icon>
          Back to card selection
        </b-button>
      </template>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  getCurrentSession,
  updateSession,
  createNewSession,
  getSuggestions,
  getFavorites,
  getRandomSuggestions
} from "../gate";
import { zeroCards } from "../store/userLocalStorage";
import { playSound } from "../utils/sounds";
import keyListener from "../components/keyListener";

export default {
  name: "SessionView",
  components: {
    keyListener: keyListener
  },
  data() {
    return {
      progressMax: 6,
      selectedCardIndex: 0,
      selectedCard: {},
      zeroListFinalized: false,
      info: {
        cards: [],
        session: {
          lastSlot: 0,
          isOpen: false
        }
      },
      zeroList: [],
      answers: {
        correctAnswers: [],
        wrongAnswers: []
      },
      suggestedList: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        items: [],
        fields: [
          { key: "front", label: "Front" },
          { key: "back", label: "Back" }
        ]
      },
      randomSuggestedList: {
        items: [],
        fields: [
          { key: "front", label: "Front" },
          { key: "back", label: "Back" }
        ]
      },
      favoritesList: {
        items: [],
        fields: [
          { key: "front", label: "Front" },
          { key: "back", label: "Back" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      User: "User"
    }),
    progressValue() {
      let step = 6;
      if (this.info.session.lastSlot === 15) step = 5;
      if (this.info.session.lastSlot === 8) step = 4;
      if (this.info.session.lastSlot === 4) step = 3;
      if (this.info.session.lastSlot === 2) step = 2;
      if (this.info.session.lastSlot === 1) step = 1;
      if (this.info.session.lastSlot === 0) step = 0;
      return 6 - step;
    },
    cardProgressValue() {
      return (
        this.answers.correctAnswers.length +
        this.answers.wrongAnswers.length +
        1
      );
    },
    stepFinished() {
      return (
        this.answers.correctAnswers.length +
          this.answers.wrongAnswers.length ===
        this.info.cards.length
      );
    }
  },
  methods: {
    ...mapMutations({
      setLoading: "setLoading"
    }),
    ...mapActions({
      init: "init"
    }),
    playCard(text, rate) {
      window.toSpeech(text, rate);
    },
    loadSession() {
      this.setLoading(true);
      getCurrentSession()
        .then(res => {
          this.info = res.data;
          this.checkForGameState();
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    checkForGameState() {
      if (this.info.session.isOpen) {
        if (this.info.session.lastSlot !== 0) {
          this.clearZeroCards();
          return this.startTheGame();
        } else if (this.zeroListFinalized) return this.confirmCards();
      }
    },
    getFavoritesList() {
      this.setLoading(true);
      getFavorites()
        .then(res => {
          this.favoritesList.items = res.data;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    addToZeroList(card) {
      const index = this.zeroList.findIndex(c => c.id === card.id);
      if (index >= 0)
        return this.$toasted.global.warn("This card exist in the list");
      this.zeroList.push(card);
      zeroCards.update(this.zeroList);
      this.$toasted.success(card.front + " added");
      this.playCard(card.front, 0.8);
    },
    removeFromZeroList(cardId) {
      const index = this.zeroList.findIndex(c => c.id === cardId);
      if (index < 0)
        return this.$toasted.global.warn("Card cannot be found in the list");
      this.zeroList.splice(index, 1);
      zeroCards.update(this.zeroList);
    },
    newSession() {
      this.clearZeroCards();
      this.setLoading(true);
      createNewSession()
        .then(res => {
          this.info = res.data;
          this.checkForGameState();
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    updateSession() {
      this.setLoading(true);
      updateSession(this.answers)
        .then(res => {
          this.info = res.data;
          if (!this.info.session.isOpen) {
            this.play("finished");
            this.getFavoritesList();
            this.loadSuggestions();
            this.init();
          }
          this.checkForGameState();
          this.answers = {
            correctAnswers: [],
            wrongAnswers: []
          };
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    loadSuggestions(page) {
      this.setLoading(true);
      getSuggestions(this.suggestedList.pageSize, page - 1)
        .then(res => {
          this.suggestedList.items = res.data.cards;
          this.suggestedList.total = res.data.total;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    confirmCards() {
      if (this.zeroList.length < 3)
        return this.$toasted.global.warn(
          "You should select at least three cards"
        );
      this.zeroListFinalized = true;
      zeroCards.updateFinalized(this.zeroListFinalized);
      this.info.cards = this.zeroList;
      this.startTheGame();
    },
    play(sound) {
      playSound(sound);
    },
    backToCardSelection() {
      this.zeroListFinalized = false;
      zeroCards.updateFinalized(this.zeroListFinalized);
    },
    startTheGame() {
      if (this.info.cards.length === 0)
        return this.$toasted.show("There is no card to play with");
      this.selectedCardIndex = 0;
      this.selectedCard = this.info.cards[this.selectedCardIndex];
      this.selectedCard.show = false;
      this.playCard(this.selectedCard.front, 0.8);
    },
    moveNext(correct) {
      if (correct) {
        this.answers.correctAnswers.push(this.selectedCard);
        this.play("correct");
      } else {
        this.answers.wrongAnswers.push(this.selectedCard);
        this.play("incorrect");
      }

      if (this.stepFinished) {
        return this.updateSession();
      }

      this.selectedCardIndex++;
      this.selectedCard = this.info.cards[this.selectedCardIndex];
      this.selectedCard.show = false;
      this.playCard(this.selectedCard.front, 0.8);
    },
    clearZeroCards() {
      zeroCards.clear();
      this.zeroListFinalized = false;
      this.zeroList = [];
    },
    loadRandomSuggestions() {
      this.setLoading(true);
      getRandomSuggestions(5)
        .then(res => {
          this.randomSuggestedList.items = res.data.cards;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    flipCardBack() {
      this.selectedCard.show = !this.selectedCard.show;
      this.$forceUpdate();
    },
    keyPressed(e) {
      console.debug(e.which);
      if (e.which === 80 && this.selectedCard.front)
        return this.playCard(this.selectedCard.front, 0.8);
      if (this.info.session.isOpen) {
        if (e.which === 83 && this.selectedCard.back)
          this.flipCardBack(this.selectedCard);
        if (
          this.info.session.lastSlot === 0 &&
          !this.zeroListFinalized &&
          e.which === 13
        )
          this.confirmCards();
        if (
          this.info.session.lastSlot === 0 &&
          this.zeroListFinalized &&
          (e.which === 13 || e.which === 89)
        )
          this.moveNext(true);
        if (
          this.info.session.lastSlot !== 0 &&
          (e.which === 13 || e.which === 89)
        )
          this.moveNext(true);
        if (this.info.session.lastSlot !== 0 && e.which === 78)
          this.moveNext(false);
      } else {
        if (e.which === 13) this.newSession();
      }
    }
  },
  created() {
    const zeroCardsStatus = zeroCards.get();
    this.zeroList = zeroCardsStatus.cards;
    this.zeroListFinalized = zeroCardsStatus.finalized;
    this.loadSession();
    this.loadSuggestions();
    this.getFavoritesList();
    this.loadRandomSuggestions();
    this.init();
  }
};
</script>

<style scoped></style>
