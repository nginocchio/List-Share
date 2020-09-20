<style>
    .list-title {
        text-align: center;
    }

</style>

<script>
    import { db } from './firebaseConfig';
    import { user } from './store';
    import { onMount } from 'svelte';
    import { Row, Col, Container, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, Spinner } from 'sveltestrap';
    import { location } from 'svelte-spa-router';
    import GroupNav from './components/GroupNav.svelte';
    import List from './components/List.svelte';

    export let params = {};
    const listRef = db.collection('groups').doc(params.id).collection('tasks');
    const groupRef = db.collection('groups').doc(params.id);
    let unsubscribe;
    let todos = [];
    let task = null;
    let toDelete = null;
    let showModal = false;
    let deleteModal = false;
    let email;
    let loading = true;
    let groupName;

    onMount(async () => {
        let group = await groupRef.get();
        if (!group.data().members.includes($user)) {
            replace('/groups');
        }
        groupName = group.data().name;
        unsubscribe = await listRef.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const listDoc = change.doc;
                let task = {...listDoc.data(), id: listDoc.id};
                console.log(task);
                if (change.type === 'added') {
                    todos = [...todos, {...listDoc.data(), id: listDoc.id}]
                } else if (change.type === 'modified') {
					todos = todos.filter(x => x.id !== listDoc.id);
					todos = todos.concat(task);
                } else if (change.type === 'removed') {
					todos = todos.filter(x => x.id !== listDoc.id);
                }
            })
            loading = false;
        })
        return (() => unsubscribe());
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task) return;
    }

    const addUser = async (e) => {
        e.preventDefault();
        if (!email) return;
        const groupDoc = groupRef.get();
        const members = groupDoc.data().members;

        let res = await db.collection('users').doc(email).get();
        if (!res.data()) {
            errorMessage = 'That user does not exist.'
        } else if (members.includes(res.id)) {
            errorMessage = 'That user is already a member of this group.'
        } else {
            groupRef.update({
                members: db.FieldValue.arrayUnion(res.id)
            });
        }
        email = null;
        showModal = false;
    }

    const handleDelete = (e) => {
        toDelete = e.detail;
        deleteModal = true;
    }

    const toggleDelete = () => {
        toDelete = {};
        deleteModal = false;
    }

    const deleteTodo = async (id) => {
        try {
            const res = await listRef.doc(id).delete()
        } catch (e) {
            console.log(e);
        }
        toggleDelete();
    }

    const handleMessage = async (e) => {
        const task = e.detail;
		const item = await listRef.doc(task.id);
		try {
            const res = await item.update({ complete: task.state });
		} catch(err) {
			console.log(err);
		}
    }

    const addTodo = async (e) => {
        e.preventDefault();
        if (!task) return;
        await listRef.doc().set({
            name: task,
            complete: false
        })
        task = null;
    }
</script>

<Container class="mt-5">
    {#if loading}
        <Row>
            <Col class="d-flex justify-content-center">
                <Spinner />
            </Col>
        </Row>
    {:else}
        {#if deleteModal}
            <Modal isOpen={ deleteModal } size={ 'sm' } toggle={ toggleDelete }>
                <ModalHeader>Delete "{ toDelete.name }"?</ModalHeader>
                <ModalBody>
                    <Button on:click="{ () => deleteTodo(toDelete.id) }" color={ 'danger' }>Delete todo</Button>
                    <Button on:click="{ toggleDelete }" color={ 'secondary' }>Close</Button>
                </ModalBody>
            </Modal>
        {/if}
        {#if showModal}
            <Modal isOpen={ showModal } size={ 'md' } toggle={ () => showModal = !showModal }>
                <ModalHeader>Add new member</ModalHeader>
                <ModalBody>
                    <Form on:submit={ addUser }>
                        <Input bind:value={ email } type="text" placeholder="Enter a email"></Input>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button on:click="{ addUser }" color={ 'primary' }>Submit</Button>
                    <Button on:click="{() => showModal = false }" color={ 'secondary' }>Close</Button>
                </ModalFooter>
            </Modal>
        {/if}
        <GroupNav { groupName } on:showModal="{() => showModal = true}" />
        <Row class="mt-3">
            <Col sm="{{ size: 12 }}" md="{{ size: 8, offset: 2 }}" lg="{{ size: 6, offset: 3 }}">
                <Form on:submit={ addTodo }>
                    <FormGroup>
                        <Input bind:value={task} type="text" placeholder="What needs to get done?"/>
                    </FormGroup>
                </Form>
            </Col>
        </Row>
        <Row>
            <Col class="mt-3" sm="12" md="{{ size: 6 }}" lg="{{ size: 4, offset: 2}}">
                <h4 class="list-title">Todo</h4>
                <List values="{ todos.filter(x => !x.complete) }" on:message={handleMessage} on:delete={handleDelete} />
            </Col>
            <Col class="mt-3" sm="12" md="{{ size: 6 }}" lg="{{ size: 4 }}">
                <h4 class="list-title text-secondary">Complete</h4>
                <List values="{ todos.filter(x => x.complete) }" on:message={handleMessage} on:delete={handleDelete} />
            </Col>
        </Row>
    {/if}
</Container>