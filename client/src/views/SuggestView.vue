<template>
    <div class="p-5">
        <h1 class="text-muted"># Suggestions</h1>
        <hr>

        <b-card>
            <div slot="header" class="clearfix">
                <span class="align-middle"> <i class="fa fa-paw"></i>Suggestions list</span>
            </div>
            <b-table
                    hover
                    fixed
                    :items="suggestionsList.items"
                    :fields="suggestionsList.fields"
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
                    <b-badge @click="addToFavorites(data.item.id)" class="mx-1 pointer" variant="primary">Learn this
                        card
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
    import {getSuggestions, addToFavorites} from "../gate";

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
                        {key: 'id', label: 'ID'},
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
            loadSuggestions() {
                this.setLoading(true)
                getSuggestions(this.suggestionsList.pageSize, this.suggestionsList.pageNumber - 1)
                    .then(res => {
                        this.suggestionsList.items = res.data.cards
                        this.suggestionsList.total = res.data.total
                    }).catch(e => this.$toasted.global.handleError(e))
                    .finally(() => this.setLoading(false))
            },
            addToFavorites(cardId) {
                this.setLoading(true)
                addToFavorites(cardId)
                    .then(res => {
                        this.$toasted.global.success(res)
                        this.loadSuggestions()
                    })
                    .catch(e => this.$toasted.global.handleError(e))
                    .finally(() => this.setLoading(false))
            }
        },
        created() {
            this.loadSuggestions()
        }
    };
</script>

<style scoped></style>
