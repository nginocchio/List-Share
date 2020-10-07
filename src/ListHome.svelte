<style>
  .list-title {
    text-align: center;
  }
  .group {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .group-member {
    border: 1px solid #ddd;
    margin-top: -1px; /* Prevent double borders */
    background-color: #f6f6f6;
    padding: 12px;
    text-decoration: none;
    font-size: 18px;
    color: black;
    display: block;
    position: relative;
  }
  .group-member:hover {
    background-color: #eee;
  }
  .delete-member {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 0%;
    padding: 12px 16px;
    transform: translate(0%, -50%);
  }

  .delete-member:hover {
    background: #bbb;
  }

  .no-select {
    -webkit-user-select: none;
  }
</style>

<script>
  import firebase from "firebase/app";
  import { db } from "./firebaseConfig";
  import { user } from "./store";
  import { onMount } from "svelte";
  import AutoComplete from "simple-svelte-autocomplete";
  import {
    Row,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ButtonGroup,
    Spinner,
    Alert
  } from "sveltestrap";
  import { location } from "svelte-spa-router";
  import GroupNav from "./components/GroupNav.svelte";
  import List from "./components/List.svelte";

  export let params = {};
  const listRef = db
    .collection("groups")
    .doc(params.id)
    .collection("tasks");
  const groupRef = db.collection("groups").doc(params.id);
  let unsubscribe;
  let todos = [];
  let memberList = [];
  let owner = false;
  let task = null;
  let toDelete = null;
  let showModal = false;
  let showMembers = false;
  let deleteModal = false;
  let fetchingMembers = false;
  let email;
  let loading = true;
  let groupName;
  let errorMessage;
  let listLen = 10;
  let successMessage;

  onMount(async () => {
    let group = await groupRef.get();
    if (!group.data().members.includes($user)) {
      replace("/groups");
    }
    owner = group.data().owner === $user;
    groupName = group.data().name;
    unsubscribe = await listRef.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const listDoc = change.doc;
        let task = { ...listDoc.data(), id: listDoc.id };
        if (change.type === "added") {
          todos = [{ ...listDoc.data(), id: listDoc.id }, ...todos];
        } else if (change.type === "modified") {
          todos = todos.filter(x => x.id !== listDoc.id);
          todos.unshift(task);
        } else if (change.type === "removed") {
          todos = todos.filter(x => x.id !== listDoc.id);
        }
      });
      loading = false;
    });
    return () => unsubscribe();
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!task) return;
  };

  const addUser = async e => {
    e.preventDefault();
    if (!email) return;
    const groupDoc = await groupRef.get();
    const members = groupDoc.data().members;

    let res = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    let userId;
    res.forEach(user => {
      // should only be one
      userId = user.id;
    });
    if (!userId) {
      errorMessage = "That user does not exist.";
    } else if (members.includes(userId)) {
      errorMessage = "That user is already a member of this group.";
    } else {
      groupRef.update({
        members: firebase.firestore.FieldValue.arrayUnion(userId)
      });
      email = null;
      showModal = false;
    }
  };

  const handleDelete = e => {
    toDelete = e.detail;
    deleteModal = true;
  };

  const toggleDelete = () => {
    toDelete = {};
    deleteModal = false;
  };

  const deleteTodo = async id => {
    try {
      const res = await listRef.doc(id).delete();
    } catch (e) {
      console.log(e);
    }
    toggleDelete();
  };

  const handleMessage = async e => {
    const task = e.detail;
    const item = await listRef.doc(task.id);
    try {
      const res = await item.update({ complete: task.state });
    } catch (err) {
      console.log(err);
    }
  };

  const addTodo = async e => {
    e.preventDefault();
    if (!task) return;
    await listRef.doc().set({
      name: task,
      complete: false
    });
    task = null;
  };

  const handleNewUser = async () => {
    let res = await db.collection("users").get();
    return res.data();
  };

  const showMore = () => {
    listLen += 10;
  };

  const toggleMemberList = async () => {
    memberList = [];
    showMembers = true;
    fetchingMembers = true;
    let res = await groupRef.get();
    const ids = res.data().members;
    const groupRes = await db.collection("users").get();
    groupRes.forEach(doc => {
      let u = doc.data();
      if (ids.includes(doc.id) && doc.id !== $user) {
        memberList.push({ email: u.email, username: u.username, id: doc.id });
      }
    });
    fetchingMembers = false;
  };

  const deleteMember = async id => {
    groupRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(id)
    });
    memberList = memberList.filter(x => x.id !== id);
    successMessage = `User was removed from your group.`;
  };

  const closeMemberView = () => {
    showMembers = !showMembers;
    successMessage = null;
  };
</script>

<Container class="my-3">
  {#if loading}
    <Row>
      <Col class="d-flex justify-content-center">
        <Spinner />
      </Col>
    </Row>
  {:else}
    {#if deleteModal}
      <Modal isOpen="{deleteModal}" size="{'sm'}" toggle="{toggleDelete}">
        <ModalHeader>Delete "{toDelete.name}"?</ModalHeader>
        <ModalBody>
          <div class="no-select">
            <Button
              on:click="{() => deleteTodo(toDelete.id)}"
              color="{'danger'}"
            >
              Delete todo
            </Button>
            <Button on:click="{toggleDelete}" color="{'secondary'}">
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    {/if}
    {#if showModal}
      <Modal
        isOpen="{showModal}"
        size="{'md'}"
        toggle="{() => (showModal = !showModal)}"
      >
        <ModalHeader>Add new member</ModalHeader>
        <ModalBody>
          {#if errorMessage}
            <Alert color="{'danger'}">{errorMessage}</Alert>
          {/if}
          <Form on:submit="{addUser}">
            <Input
              bind:value="{email}"
              type="text"
              placeholder="Enter an email"
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button on:click="{addUser}" color="{'primary'}">Submit</Button>
          <Button on:click="{() => (showModal = false)}" color="{'secondary'}">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    {/if}
    {#if showMembers}
      <Modal isOpen="{showMembers}" size="md" toggle="{closeMemberView}">
        <ModalHeader>Group Members</ModalHeader>
        <ModalBody>
          {#if successMessage}
            <Alert color="{'success'}">{successMessage}</Alert>
          {/if}
          <ul class="group">
            {#if fetchingMembers}
              <Spinner />
            {:else if memberList.length > 0}
              {#each memberList as member}
                <li class="group-member">
                  {member.email}
                  {#if owner}
                    <button
                      on:click="{() => deleteMember(member.id)}"
                      class="delete-member"
                    >
                      X
                    </button>
                  {/if}
                </li>
              {/each}
            {:else}There are no other members in this group.{/if}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button on:click="{closeMemberView}" color="{'secondary'}">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    {/if}
    <GroupNav
      {groupName}
      on:showModal="{() => (showModal = true)}"
      on:showMembers="{toggleMemberList}"
    />
    <Row class="mt-3">
      <Col
        sm="{{ size: 12 }}"
        md="{{ size: 8, offset: 2 }}"
        lg="{{ size: 6, offset: 3 }}"
      >
        <Form on:submit="{addTodo}">
          <FormGroup>
            <Input
              bind:value="{task}"
              type="text"
              placeholder="What needs to get done?"
            />
          </FormGroup>
        </Form>
      </Col>
    </Row>
    <Row>
      <Col
        class="mt-3"
        sm="12"
        md="{{ size: 6 }}"
        lg="{{ size: 4, offset: 2 }}"
      >
        <h4 class="list-title">Todo</h4>
        <List
          values="{todos.filter(x => !x.complete)}"
          on:message="{handleMessage}"
          on:delete="{handleDelete}"
        />
      </Col>
      <Col class="mt-3" sm="12" md="{{ size: 6 }}" lg="{{ size: 4 }}">
        <h4 class="list-title text-secondary">Complete</h4>
        <List
          values="{todos.filter(x => x.complete).slice(0, listLen)}"
          on:message="{handleMessage}"
          on:delete="{handleDelete}"
          on:edit="{() => console.log('toggle delete menu')}"
        />
      </Col>
    </Row>
    <Row>
      <Col class="mt-3">
        <div class="d-flex justify-content-center">
          {#if todos.filter(x => x.complete).length > listLen}
            <Button sz="md" color="{'light'}" on:click="{showMore}">
              Show more
            </Button>
          {/if}
        </div>
      </Col>
    </Row>
  {/if}
</Container>
