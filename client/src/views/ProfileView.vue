<template>
  <div class="p-sm-5">
    <h1 class="text-muted"># Profile</h1>
    <hr/>
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
            <label class="text-muted font-bold h4">Categories selected:</label>
            <label class="text-success h4 ml-4"
            >{{ User.selectedCategoriesCount }}</label
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

        <div class="col-md-6 col-sm-12">
          <b-form-group>
            <label class="text-muted font-bold h4">Selected voice :</label>
            <label class="text-success h4 ml-4"
            >{{ selectedVoice || '' }}</label
            >
          </b-form-group>
        </div>

        <div class="col-md-6 col-sm-12">
          <b-form-group>
            <b-form-select v-model="selectedVoice" :options="voicesList"></b-form-select>
          </b-form-group>
        </div>
      </b-row>

      <hr/>
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

                <br/>
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

                <b-badge
                    v-b-popover.hover.top="'I know this card'"
                    @click="knowThisCard(data.item._id)"
                    class="mx-1 pointer"
                    variant="success"
                >
                  <b-icon icon="check" class="pointer"></b-icon>
                </b-badge>
              </template>
            </b-table>
            <b-row v-show="favoritesList.items.length" class="px-3">
              <b-pagination
                  v-model="favoritesList.pageNumber"
                  :total-rows="favoritesList.total"
                  :per-page="favoritesList.pageSize"
                  @change="getFavoritesList"
                  class="my-1 float-left"
              ></b-pagination>
            </b-row>
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
                :items="learningList.items"
                :fields="learningList.fields"
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

                <br/>
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
                :items="learnedList.items"
                :fields="learnedList.fields"
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

                <br/>
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
              >Approve!
              </b-button>
            </div>
          </b-card>
        </div>
      </b-row>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {
  getLearnedCards,
  getLearningCards,
  getFavoriteCards,
  approveAsAdmin, knowTheCard
} from "@/gate";
import {removeUserData, getSelectedVoice} from "@/store/userLocalStorage";

export default {
  name: "ProfileView",
  data() {
    return {
      date: new Date(),
      adminSecret: null,
      voicesList: [],
      voiceLoaded: false,
      selectedVoice: '',
      favoritesList: {
        pageNumber: 1,
        pageSize: 10,
        total: 10,
        items: [],
        fields: [
          {key: "front", label: "Front"},
          {key: "back", label: "Back"},
          {key: "actions", label: "Actions"}
        ]
      },
      learnedList: {
        pageNumber: 1,
        pageSize: 10,
        total: 10,
        items: [],
        fields: [
          {key: "front", label: "Front"},
          {key: "back", label: "Back"}
        ]
      },
      learningList: {
        pageNumber: 1,
        pageSize: 10,
        total: 10,
        items: [],
        fields: [
          {key: "front", label: "Front"},
          {key: "back", label: "Back"}
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
    getLearningList(page) {
      this.setLoading(true);
      getLearningCards(this.learningList.pageSize, page - 1)
          .then(res => {
            this.learningList.items = res.data.cards;
            this.learningList.total = res.data.total;
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false));
    },
    getLearnedList(page) {
      this.setLoading(true);
      getLearnedCards(this.learnedList.pageSize, page - 1)
          .then(res => {
            this.learnedList.items = res.data.cards;
            this.learnedList.total = res.data.total;
          })
          .catch(e => this.$toasted.global.handleError(e))
          .finally(() => this.setLoading(false));
    },
    getFavoritesList(page) {
      this.setLoading(true);
      getFavoriteCards(this.favoritesList.pageSize, page - 1)
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
        getLearnedCards(this.learnedList.pageSize, 0),
        getLearningCards(this.learningList.pageSize, 0),
        getFavoriteCards(this.favoritesList.pageSize, 0)
      ])
          .then(([learned, learning, favorite]) => {
            this.favoritesList.items = favorite.data.cards;
            this.favoritesList.total = favorite.data.total;
            this.learningList.items = learning.data.cards;
            this.learningList.total = learning.data.total;
            this.learnedList.items = learned.data.cards;
            this.learnedList.total = learned.data.total;
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
                  this.getFavoritesList(this.favoritesList.pageNumber);
                })
                .catch(e => this.$toasted.global.handleError(e))
                .finally(() => this.setLoading(false));
          }
        }
      });
    },
  },
  created() {
    this.loadAll();
    this.init();
    setTimeout(() => {

          this.voicesList = window.speechSynthesis.getVoices().map(v => {
            return {
              value: v.voiceURI,
              text: v.name
            }
          })
          this.selectedVoice = this.voicesList.filter(v => v.value === getSelectedVoice())[0].text || ''
        }
        , 1000)
  },
  watch: {
    selectedVoice: function (val) {
      if (!val || !this.voiceLoaded) {
        this.voiceLoaded = true
        return
      }
      window.selectVoice(val)
      const quotes = ["The way to get started is to quit talking and begin doing",
        'The greatest glory in living lies not in never falling, but in rising every time we fall',
      'If life were predictable it would cease to be life, and be without flavor',
      "Whether you think you can or you think you can't, you're right",
      "I have learned over the years that when one's mind is made up, this diminishes fear",
      "Nothing is impossible, the word itself says, ‘I'm possible!",
      "The only person you are destined to become is the person you decide to be",
      "An unexamined life is not worth living",
      "Dream big and dare to fail",
      "You may be disappointed if you fail, but you are doomed if you don't try",
      "Things work out best for those who make the best of how things work out",
      "It is better to fail in originality than to succeed in imitation"]
      const text = quotes[Math.round(Math.random() * quotes.length)]
          window.toSpeech(text)
      this.$toasted.info(text)
    }
  }
};
</script>

<style scoped></style>
