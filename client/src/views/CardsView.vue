<template>
    <div class="p-5">
        <h1 class="text-muted"># Cards</h1>
        <hr>
        <b-card class="mb-4">
            <div slot="header" class="clearfix">
                <span class="align-middle" :class="editMode ? 'text-warning' : 'text-success'"> <i
                        class="fa fa-paw"></i>{{editMode ? 'Edit card' : 'Create new Card'}}</span>
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

                <b-form-group
                        id="input-group-2"
                        label="Card back:"
                        label-for="input-2"
                >
                    <b-form-textarea
                            id="input-2"
                            v-model="card.back"
                            rows="3"
                            required
                            placeholder="Enter card back"
                    ></b-form-textarea>
                </b-form-group>
                <div>
                    <b-button v-if="card.front || card.back" class="float-left" type="reset" variant="danger">Reset
                    </b-button>
                    <b-button class="float-right" type="submit" :variant="editMode ? 'warning' : 'success'">
                        {{editMode ? 'Edit' : 'Create'}}
                    </b-button>
                </div>
            </b-form>
        </b-card>

        <b-card>
            <div slot="header" class="clearfix">
                <span class="align-middle"> <i class="fa fa-paw"></i> Cards list</span>
            </div>
            <b-table
                    hover
                    fixed
                    :items="cardsList.items"
                    :fields="cardsList.fields"
                    show-empty
                    empty-html="<h6>There is no item to show!</h6>"
            >
                <template v-slot:cell(index)="data">
                    {{data.index + 1}}
                </template>
                <template v-slot:cell(front)="data">
                    <span class="text-muted font-weight-bolder">
                        {{ data.value }}
                    </span>
                </template>
                <template v-slot:cell(back)="data">
                    {{ data.value }}
                </template>
                <template v-slot:cell(createdAt)="data">
                    <b-badge>{{ data.value | moment('YYYY-MM-DD') }}</b-badge>
                </template>

                <template v-slot:cell(actions)="data">
                    <b-badge class="mx-1 pointer" @click="selectForEdit(data.item)" variant="warning">Edit</b-badge>
                    <b-badge class="mx-1 pointer" @click="removeCard(data.item.id)" variant="danger">Delete</b-badge>
                </template>
            </b-table>
            <b-row v-show="cardsList.items.length" class="px-3">
                <b-pagination
                        v-model="cardsList.pageNumber"
                        :total-rows="cardsList.total"
                        :per-page="cardsList.pageSize"
                        @change="loadCards"
                        class="my-1 float-left"
                ></b-pagination>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import {mapMutations} from "vuex";
    import {getCardsList, createNewCard, updateCard, removeCard} from "../gate";

    export default {
        name: "CardsView",
        data() {
            return {
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
                        {key: 'index', label: 'Index'},
                        {key: 'front', label: 'Front'},
                        {key: 'back', label: 'Back'},
                        {key: 'createdAt', label: 'Created At'},
                        {key: 'actions', label: 'Actions'}
                    ]
                }
            }
        },
        methods: {
            ...mapMutations({
                setLoading: 'setLoading'
            }),
            loadCards() {
                this.setLoading(true)
                getCardsList(this.cardsList.pageSize, this.cardsList.pageNumber - 1)
                    .then(res => {
                        this.cardsList.items = res.data.cards
                        this.cardsList.total = res.data.total
                    }).catch(e => this.$toasted.global.handleError(e))
                    .finally(() => this.setLoading(false))
            },
            onSubmit(evt) {
                evt.preventDefault()
                if (this.editMode)
                    this.updateCard()
                else
                    this.createCard()
            },
            createCard() {
                this.setLoading(true)
                createNewCard(this.card)
                    .then(res => this.$toasted.global.success(res))
                    .catch(e => {
                        this.$toasted.global.handleError(e)
                        this.loadCards()
                    })
                    .finally(() => this.setLoading(false))
            },
            updateCard() {
                this.setLoading(true)
                updateCard(this.card)
                    .then(res => {
                        this.$toasted.global.success(res)
                        this.loadCards()
                    })
                    .catch(e => this.$toasted.global.handleError(e))
                    .finally(() => this.setLoading(false))
            },
            onReset() {
                this.card = {
                    front: null,
                    back: null
                }
                this.editMode = false
            },
            removeCard(cardId) {
                this.$toasted.show("Are you sure about removing this card?", {
                    action: {
                        text: 'Yes',
                        onClick: (e, toastObject) => {
                            this.setLoading(true)
                            toastObject.goAway(0);
                            removeCard(cardId)
                                .then(res => {
                                    this.$toasted.global.success(res)
                                    this.loadCards()
                                })
                                .catch(e => this.$toasted.global.handleError(e))
                                .finally(() => this.setLoading(false))
                        }
                    },
                })
            },
            selectForEdit(card) {
                this.card = card
                this.editMode = true
            }
        },
        created() {
            this.loadCards()
        }

    };
</script>

<style scoped></style>
