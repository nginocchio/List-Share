<style>
    .list-wrapper {
        padding: 0;
        margin: 0;
    }

    .task {
        display: flex;
        list-style-type: none;
        padding: 0.25rem;
        margin-top: 0.25rem;
        border: 1px solid #aaa;
        border-radius: 4px;
        background-color: #EBEBEB;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }
</style>

<script>
    export let values;
    import { longpress } from '../longpress';
    import { createEventDispatcher } from 'svelte';
    import { send, receive } from '../crossfade';
    import { flip } from 'svelte/animate';
    const dispatch = createEventDispatcher();
    const duration = 500;
    let showModal = false;

    const handleClick = (id, done) => {
        dispatch('message', {
            id: id,
            state: done
        })
    }

    const handleDelete = (id, name) => {
        dispatch('delete', {
            id,
            name
        })
    }
</script>

<ul class="todo list-wrapper">
    {#each values as value (value.id)}
        <li class="task"
            in:receive|local="{{key: value.id}}"
            out:send|local="{{key: value.id}}"
            animate:flip={{duration: 200}}
            use:longpress={duration}
            on:longpress="{ () => handleDelete(value.id, value.name) }">
            {value.name}
            {#if !value.complete }
                <input on:change={() => handleClick(value.id, true)} type="checkbox">
            {:else}
                <input on:change={() => handleClick(value.id, false)} checked type="checkbox">
            {/if} 
        </li>
    {/each}
</ul>