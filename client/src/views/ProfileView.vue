<template>
  <div class="p-sm-5">
    <h1 class="text-muted"># Profile</h1>
    <hr />
    <div class="p-sm-3">
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
      <b-row class="mt-5">
        <div class="col-md-6 col-sm-12 mt-3">
          <b-card>
            <div slot="header" class="clearfix">
              <span class="align-middle">
                <i class="fa fa-paw"></i> Cards you want to learn</span
              >
            </div>
            <b-table
              small
              hover
              fixed
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
                  v-b-popover.hover="'Remove from this list'"
                  class="mx-1 pointer"
                  @click="removeFromFavorites(data.item.id)"
                  variant="warning"
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
                  <b-badge
                    v-b-popover.hover="'See details'"
                    variant="info"
                    class="mx-1"
                  >
                    <b-icon icon="search" class="pointer"></b-icon>
                  </b-badge>
                </a>
              </template>
            </b-table>
          </b-card>
        </div>

        <div class="col-md-6 col-sm-12 mt-3">
          <b-card>
            <div slot="header" class="clearfix">
              <span class="align-middle">
                <i class="fa fa-paw"></i> Cards you are learning</span
              >
            </div>
            <b-table
              small
              hover
              fixed
              :items="learningList.items"
              :fields="learningList.fields"
              show-empty
              empty-html="<h6>There is no item to show!</h6>"
            >
              <template v-slot:cell(front)="data">
                <b-badge variant="info">{{ data.value }} </b-badge>
              </template>
              <template v-slot:cell(back)="data">
                {{ data.value }}
              </template>
            </b-table>
            <b-row v-show="learningList.items.length" class="px-3">
              <b-pagination
                v-model="learningList.pageNumber"
                :total-rows="learningList.total"
                :per-page="learningList.pageSize"
                @change="getLearningList"
                class="my-1 float-left"
              ></b-pagination>
            </b-row>
          </b-card>
        </div>

        <div class="col-md-6 col-sm-12 mt-3">
          <b-card>
            <div slot="header" class="clearfix">
              <span class="align-middle">
                <i class="fa fa-paw"></i>Cards you learned</span
              >
            </div>
            <b-table
              small
              hover
              fixed
              :items="learnedList.items"
              :fields="learnedList.fields"
              show-empty
              empty-html="<h6>There is no item to show!</h6>"
            >
              <template v-slot:cell(front)="data">
                <b-badge variant="info">{{ data.value }} </b-badge>
              </template>
              <template v-slot:cell(back)="data">
                {{ data.value }}
              </template>
            </b-table>
            <b-row v-show="learnedList.items.length" class="px-3">
              <b-pagination
                v-model="learnedList.pageNumber"
                :total-rows="learnedList.total"
                :per-page="learnedList.pageSize"
                @change="getLearnedList"
                class="my-1 float-left"
              ></b-pagination>
            </b-row>
          </b-card>
        </div>

        <div class="col-md-6 col-sm-12 mt-3">
          <b-card>
            <b-form-group
              id="input-group-1"
              label="Admin secret:"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="adminSecret"
                type="password"
                required
                placeholder="Enter admin secret..."
              ></b-form-input>
            </b-form-group>
            <div>
              <b-button @click="approveAsAdmin" variant="primary"
                >Approve!</b-button
              >
            </div>
          </b-card>
        </div>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  getFavorites,
  getLearnedCards,
  getLearningCards,
  removeFromFavorites,
  approveAsAdmin
} from "../gate";
import { removeUserData } from "../store/userLocalStorage";

export default {
  name: "ProfileView",
  data() {
    return {
      date: new Date(),
      adminSecret: null,
      favoritesList: {
        items: [],
        fields: [
          { key: "front", label: "Front" },
          { key: "back", label: "Back" },
          { key: "actions", label: "Actions" }
        ]
      },
      learnedList: {
        pageNumber: 1,
        pageSize: 10,
        total: 10,
        items: [],
        fields: [
          { key: "front", label: "Front" },
          { key: "back", label: "Back" }
        ]
      },
      learningList: {
        pageNumber: 1,
        pageSize: 10,
        total: 10,
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
    })
  },
  methods: {
    ...mapMutations({
      setLoading: "setLoading"
    }),
    ...mapActions({
      init: "init"
    }),
    approveAsAdmin() {
      this.setLoading(true);
      approveAsAdmin(this.adminSecret)
        .then(res => {
          console.log(res);
          removeUserData();
          window.location.replace("/auth");
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    getLearningList() {
      this.setLoading(true);
      getLearningCards()
        .then(res => {
          this.learningList.items = res.data.cards;
          this.learningList.total = res.data.total;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    getLearnedList() {
      this.setLoading(true);
      getLearnedCards
        .then(res => {
          this.learnedList.items = res.data.cards;
          this.learnedList.total = res.data.total;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    getFavoritesList() {
      this.setLoading(true);
      getFavorites()
        .then(res => {
          this.favoritesList.items = res.data.cards;
          this.favoritesList.total = res.data.total;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    loadAll() {
      this.setLoading(true);
      Promise.all([
        getLearnedCards(10, 0),
        getLearningCards(10, 0),
        getFavorites(10, 0)
      ])
        .then(([learned, learning, favorite]) => {
          this.favoritesList.items = favorite.data;
          this.learningList.items = learning.data.cards;
          this.learningList.total = learning.data.total;
          this.learnedList.items = learned.data.cards;
          this.learnedList.total = learned.data.total;
        })
        .catch(e => this.$toasted.global.handleError(e))
        .finally(() => this.setLoading(false));
    },
    removeFromFavorites(cardId) {
      this.$toasted.show("Don't you want to learn this card?", {
        action: {
          text: "Not any more!",
          onClick: (e, toastObject) => {
            this.setLoading(true);
            toastObject.goAway(0);
            removeFromFavorites(cardId)
              .then(res => {
                this.$toasted.global.success(res);
                this.getFavoritesList();
              })
              .catch(e => this.$toasted.global.handleError(e))
              .finally(() => this.setLoading(false));
          }
        }
      });
    },
    playCard(text, rate) {
      window.toSpeech(text, rate);
    }
  },
  created() {
    this.loadAll();
    this.init();
  }
};
</script>

<style scoped></style>
