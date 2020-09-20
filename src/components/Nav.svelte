<style>
    .link-color {
        color: #0056b3;
    }
</style>

<script>
    import {link, push, pop, replace, location, querystring} from 'svelte-spa-router';
    import { Container, Nav, NavItem, NavLink, Button } from 'sveltestrap';
    import { user } from '../store';
    import { auth } from '../firebaseConfig';
    
    const handleClick = (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            user.set('');
            localStorage.setItem('user', '');
            console.log($user);
            replace('/');
        })
    }
</script>

<Container>
    <Nav class="py-3">
        <NavItem><NavLink href="#/">Home</NavLink></NavItem>
        {#if $user !== ''}
            <NavItem class="ml-auto"><Button on:click={handleClick} color={'link'}><span class="link-color">Sign out</span></Button></NavItem>
            <NavItem><NavLink href="#/groups">Groups</NavLink></NavItem>
        {:else}
            <NavItem class="ml-auto"><NavLink href="#/login">Sign in</NavLink></NavItem>
            <NavItem><NavLink href="#/signup">Sign up</NavLink></NavItem>
        {/if}
    </Nav>
</Container>
