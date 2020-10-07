import { wrap, replace } from 'svelte-spa-router';
import { user } from './store';
import { get } from 'svelte/store';
import { db } from './firebaseConfig';

import ListHome from './ListHome.svelte'
import Home from './Home.svelte';
import Login from './Login.svelte';
import Signup from './Signup.svelte';
// import Reset from './Reset.svelte';
import Groups from './Groups.svelte';
// import List from './List.svelte';
import NotFound from './NotFound.svelte';

const routes = {
    // Exact path
    '/': Home,

    '/login': wrap(
        Login,
        (detail) => {
            if (get(user) !== '') {
                // change to groups
                replace('/groups')
            } else {
                return true;
            }
        }
    ),

    '/signup': wrap(
        Signup,
        (detail) => {
            if (get(user) !== '') {
                // change to groups
                replace('/groups')
            } else {
                return true;
            }
        }

    ),

    '/groups': wrap(
        Groups,
        (detail) => {
            if (get(user) == '') {
                return replace('signin');
            } else {
                return true
            }
        }
    ),

    '/list/:id': wrap(
        ListHome,
        (detail) => {
            if (get(user) == '') {
                return false;
            } else {
                return true;
            }
        }
    ),

    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}

export default routes;