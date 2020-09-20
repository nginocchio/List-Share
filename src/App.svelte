<script>
	import Router from 'svelte-spa-router';
	import routes from './routes';
	import Nav from './components/Nav.svelte';
	import { user } from './store';
	import { auth } from './firebaseConfig';

    auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
			localStorage.setItem("user", firebaseUser.uid);
			user.set(firebaseUser.uid);
        } else {
			// localStorage.removeItem("user");
			// user.set('');
        }
    })
</script>

<svelte:head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</svelte:head>

<main>
	<Nav />
	<Router {routes}/>
</main>

<style>
</style>