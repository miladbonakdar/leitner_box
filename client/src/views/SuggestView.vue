<template>
    <div class="p-sm-5">
        <h1 class="text-muted"># Suggestions</h1>
        <hr/>


        <b-card>
            <div slot="header" class="clearfix">

                <b-input-group class="">
                    <span style="font-size: 22px">Random suggestions
                    <b-icon @click="loadRandomSuggestions" v-b-popover.hover.top="'Reload random cards'" class="pointer mx-2" scale="1.2" variant="success" icon="arrow-clockwise"></b-icon>
                    </span>
                </b-input-group>
            </div>
            <b-table
                    hover
                    :items="randomSuggestions.items"
                    :fields="randomSuggestions.fields"
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
                    <b-badge
                            v-b-popover.hover.top="'Learn this card'"
                            @click="addToFavorites(data.item._id)"
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
        </b-card>

        <b-card class="mt-3">
            <div slot="header" class="clearfix">

                <b-input-group class="">
                    <span class="w-50" style="font-size: 22px">Suggestions list</span>
                    <b-input v-model="search" @keyup="loadCardsLazy"
                             placeholder="Search..."></b-input>
                </b-input-group>
            </div>
            <b-table
                    hover
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
                    <b-badge
                            v-b-popover.hover.top="'Learn this card'"
                            @click="addToFavorites(data.item._id)"
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
    import {mapMutations} from "vuex";
    import {getSuggestions, addToFavorites, knowTheCard, getRandomSuggestions} from "../gate";
    import debounce from "debounce";

    export default {
        name: "SuggestView",
        data() {
            return {
                search: null,
                suggestionsList: {
                    pageNumber: 1,
                    pageSize: 20,
                    total: 0,
                    items: [],
                    fields: [
                        {key: "front", label: "Front"},
                        {key: "back", label: "Back"},
                        {key: "actions", label: "Actions"}
                    ]
                },
                randomSuggestions: {
                    items: [],
                    fields: [
                        {key: "front", label: "Front"},
                        {key: "back", label: "Back"},
                        {key: "actions", label: "Actions"}
                    ]
                }
            };
        },
        methods: {
            ...mapMutations({
                setLoading: "setLoading"
            }),
            loadSuggestions(page) {
                this.setLoading(true);
                getSuggestions(this.suggestionsList.pageSize, page - 1, this.search)
                    .then(res => {
                        this.suggestionsList.items = res.data.cards;
                        this.suggestionsList.total = res.data.total;
                    })
                    .catch(e => this.$toasted.global.handleError(e))
                    .finally(() => this.setLoading(false));
            },
            loadRandomSuggestions() {
                this.setLoading(true);
                getRandomSuggestions()
                    .then(res => {
                        this.randomSuggestions.items = res.data.cards;
                    })
                    .catch(e => this.$toasted.global.handleError(e))
                    .finally(() => this.setLoading(false));
            },
            addToFavorites(cardId) {
                this.setLoading(true);
                addToFavorites(cardId)
                    .then(res => {
                        this.$toasted.global.success(res);
                        this.loadSuggestions(this.suggestionsList.pageNumber);
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
                                    this.loadSuggestions(this.suggestionsList.pageNumber);
                                })
                                .catch(e => this.$toasted.global.handleError(e))
                                .finally(() => this.setLoading(false));
                        }
                    }
                });
            },
            loadCardsLazy() {
                this.loadSuggestions(this.suggestionsList.pageNumber)
            }
        },
        created() {
            this.loadSuggestions();
            this.loadRandomSuggestions();
            this.loadCardsLazy = debounce(this.loadCardsLazy, 1000)
        }
    };
</script>

<style scoped></style>
