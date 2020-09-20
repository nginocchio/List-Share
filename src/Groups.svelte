<style>
    .group-card {
        display: block;
        padding: 3rem 2rem;
        background-color: lightgreen;
        margin: 1rem 0;
        text-align: center;
        cursor: pointer;
    }

    .link-text {
        color: #0056b3
    }

    .link-text:hover {
        text-decoration: underline;
    }
</style>

<script>
    import { onMount } from 'svelte';
    import { db } from './firebaseConfig';
    import { user } from './store';
    import { Container, Row, Col, Spinner, Modal, ModalFooter, ModalBody, ModalHeader, Button, Form, Input } from 'sveltestrap';
    import { link, push } from 'svelte-spa-router';
    let groupsRef = db.collection('groups').where('members', 'array-contains', $user);
    // TODO generate random/choose color for group box

    let groupList = [];
    let loading = true;
    let showModal = false;
    let groupName;

    onMount(async () => {
        const observer = groupsRef.onSnapshot(docSnapshot => {
            docSnapshot.docChanges().forEach(change => {
                const doc = change.doc;
                if (change.type === 'added') {
                    groupList = [...groupList, { id: doc.id, name: doc.data().name }];
                }
            })
            loading = false;
        })
        return(() => observer());
    })

    const addGroup = async (e) => {
        e.preventDefault();
        if (!groupName) return;

        let data = {
            members: [$user],
            name: groupName
        }

        let res = await db.collection('groups').doc().set(data);
        groupName = null;
        showModal = false;
    }

</script>

<Container>
    {#if loading}
        <Col class="d-flex justify-content-center" sm="12" md="{{ size: 4, offset: 4 }}">
            <Spinner color={ 'info' } />
        </Col>
    {:else}
        {#if showModal}
            <Modal isOpen={ showModal } size={ 'md' } toggle={ () => showModal = !showModal }>
                <ModalHeader>Create new group</ModalHeader>
                <ModalBody>
                    <Form on:submit={ addGroup }>
                        <Input bind:value={ groupName } type="text" placeholder="Group name"></Input>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button on:click="{ addGroup }" color={ 'primary' }>Submit</Button>
                    <Button on:click="{() => showModal = false }" color={ 'secondary' }>Close</Button>
                </ModalFooter>
            </Modal>
        {/if}
        <Row class="justify-content-center">
            {#each groupList as g}
                <Col sm="12" md="{{ size:  4 }}" lg="{{ size: 3 }}">
                    <a class="group-card" href="/list/{g.id}" use:link>
                        <div>
                            {g.name}
                        </div>
                    </a>
                </Col>
            {/each}
            <Col sm="12" md="{{ size:  4 }}" lg="{{ size: 3 }}">
                <div on:click="{() => showModal = true}" class="group-card link-text">
                    Create new group
                </div>
            </Col>
        </Row>
    {/if}
</Container>
