<style></style>

<script>
    import { Row, Col, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'sveltestrap';
    export let groupName;
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    const displayModal = () => {
        dispatch('showModal', true);
    }

    let isOpen = false;
</script>

<Row>
    <Col class="d-flex justify-content-between align-items-center" sm="{{ size: 12 }}" md="{{ size: 8, offset: 2 }}" lg="{{ size: 6, offset: 3 }}">
        <b>{ groupName }</b>
        <!-- <span class="d-none d-md-block">Settings</span> -->
        <span><Button outline color={'success'} on:click="{ displayModal }">Add member</Button></span>
        <!-- <Dropdown class="d-sm-none" {isOpen} toggle="{ () => isOpen = !isOpen }">
            <DropdownToggle caret>Options</DropdownToggle>
            <DropdownMenu>
                <DropdownItem on:click="{ displayModal }">Add member</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
            </DropdownMenu>
        </Dropdown> -->
    </Col>
</Row>