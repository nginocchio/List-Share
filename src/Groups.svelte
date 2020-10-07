<style>
  .group-card {
    position: relative;
    display: block;
    min-height: 100px;
    margin: 1rem 0;
    text-align: center;
    cursor: pointer;
    color: white;
    border-radius: 4px;
    font-weight: 600;
  }

  .link-text {
    color: white;
  }

  .link-text:hover {
    text-decoration: underline;
  }

  .group-title {
    position: absolute;
    top: 0;
    left: 5%;
  }

  .add {
    position: absolute;
    top: 35%;
    left: 45%;
    height: 40px;
  }

  .more {
    position: absolute;
    top: 8%;
    right: 10%;
    z-index: 10;
    cursor: pointer;
  }
</style>

<script>
  import { onMount } from "svelte";
  import { db } from "./firebaseConfig";
  import firebase from "firebase/app";
  import { user } from "./store";
  import { longpress } from "./longpress";
  import {
    Container,
    Row,
    Col,
    Spinner,
    Modal,
    ModalFooter,
    ModalBody,
    ModalHeader,
    Button,
    Form,
    Input
  } from "sveltestrap";
  import { link, push } from "svelte-spa-router";
  let groupsRef = db
    .collection("groups")
    .where("members", "array-contains", $user);
  let colors = ["#5d00ed", "#B71C1C", "#0D47A1", "#006064", "#1B5E20"];

  let toDelete = null;
  let groupList = [];
  let loading = true;
  let showModal = false;
  let deleteModal = false;
  let groupName;

  onMount(async () => {
    const observer = groupsRef.onSnapshot(docSnapshot => {
      docSnapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if (change.type === "added") {
          groupList = [...groupList, { id: doc.id, name: doc.data().name }];
        } else if (change.type === "removed") {
          groupList = groupList.filter(x => x.id !== doc.id);
        }
      });
      loading = false;
    });
    return () => observer();
  });

  const addGroup = async e => {
    e.preventDefault();
    if (!groupName) return;

    let data = {
      members: [$user],
      name: groupName,
      owner: $user
    };

    let res = await db
      .collection("groups")
      .doc()
      .set(data);
    groupName = null;
    showModal = false;
  };

  const showDeleteModal = (id, name) => {
    toDelete = { name, id };
    deleteModal = true;
  };

  const toggleDelete = () => {
    toDelete = {};
    deleteModal = false;
  };

  const handleDelete = async () => {
    let canDelete = false;
    groupList.forEach(val => {
      if (toDelete.id == val.id) {
        canDelete = true;
      }
    });
    if (canDelete) {
      const docRef = await db.collection("groups").doc(toDelete.id);
      await docRef.delete();
    }
    toggleDelete();
  };
</script>

<Container>
  {#if loading}
    <Col
      class="d-flex justify-content-center"
      sm="12"
      md="{{ size: 4, offset: 4 }}"
    >
      <Spinner color="{'info'}" />
    </Col>
  {:else}
    {#if deleteModal}
      <Modal
        isOpen="{deleteModal}"
        size="sm"
        toggle="{() => (deleteModal = !deleteModal)}"
      >
        <ModalHeader>Remove '{toDelete.name}'?</ModalHeader>
        <ModalFooter>
          <Button color="{'danger'}" on:click="{handleDelete}">
            Delete group
          </Button>
          <Button color="{'secondary'}" on:click="{toggleDelete}">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    {/if}
    {#if showModal}
      <Modal
        isOpen="{showModal}"
        size="{'md'}"
        toggle="{() => (showModal = !showModal)}"
      >
        <ModalHeader>Create new group</ModalHeader>
        <ModalBody>
          <Form on:submit="{addGroup}">
            <Input
              bind:value="{groupName}"
              type="text"
              placeholder="Group name"
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button on:click="{addGroup}" color="{'primary'}">Submit</Button>
          <Button on:click="{() => (showModal = false)}" color="{'secondary'}">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    {/if}
    <Row class="justify-content-center">
      {#each groupList as g, i}
        <Col sm="12" md="{{ size: 4 }}" lg="{{ size: 3 }}">
          <img
            class="more"
            src="assets/more-horizontal.svg"
            alt="more menu"
            width="40"
            on:click="{() => showDeleteModal(g.id, g.name)}"
          />
          <a
            class="group-card"
            href="/list/{g.id}"
            style="background-color: {colors[i % colors.length]};"
            use:link
          >
            <span class="group-title">{g.name}</span>
          </a>
        </Col>
      {/each}
      <Col sm="12" md="{{ size: 4 }}" lg="{{ size: 3 }}">
        <div
          on:click="{() => (showModal = true)}"
          class="group-card link-text"
          style="background-color: #880E4F;"
        >
          <span class="group-title">Create new group</span>
          <img class="add" src="assets/plus.svg" alt="add icon" />
        </div>
      </Col>
    </Row>
  {/if}
</Container>
