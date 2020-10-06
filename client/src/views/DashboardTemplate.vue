<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand class="" href="#">BOXY</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-3">
                    <b-nav-item>
                        <b-link class="text-white" to="session">Session</b-link>
                    </b-nav-item>
                    <b-nav-item>
                        <b-link class="text-white" to="cards">Cards</b-link>
                    </b-nav-item>
                    <b-nav-item>
                        <b-link class="text-white" to="suggest">Suggestions</b-link>
                    </b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown v-if="loaded" right>
                        <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <em>{{User.name}}</em>
                        </template>
                        <b-dropdown-item>
                            <b-link class="text-muted w-100" to="profile">Profile</b-link>
                        </b-dropdown-item>
                        <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div class="container-fluid" v-if="loaded">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import {getToken, removeUserData} from '../store/userLocalStorage'
    import { mapActions, mapMutations, mapGetters } from 'vuex'

    export default {

        name: "DashboardTemplate",
        data(){
            return {
                loaded : false
            }
        },
        methods: {
            ...mapActions({
                init: "init"
            }),
            ...mapMutations({
                showLoading: "setLoading"
            }),
            signOut() {
                this.$toasted.show("Are you sure you want to exit?", {
                    action: {
                        text: 'Exit',
                        onClick: (e, toastObject) => {
                            toastObject.goAway(0);
                            removeUserData()
                            window.location.replace("/auth");
                        }
                    },
                })
            }
        },
        created() {
            this.showLoading(true)
            if (!getToken()) {
                removeUserData();
                window.location.replace("/auth");
            }
            this.init(err => {
                if (err) {
                    this.$toasted.global.handleError(err)
                }
                this.showLoading(false)
                this.loaded = true
            })
        },
        computed:{
            ...mapGetters({
                User: "User"
            })
        }
    };
</script>

<style scoped></style>
