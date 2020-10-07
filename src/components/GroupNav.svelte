<style>
  .group-title {
    font-size: 1.25rem;
  }
</style>

<script>
  import {
    Row,
    Col,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    NavItem
  } from "sveltestrap";
  export let groupName;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const displayModal = () => {
    dispatch("showModal", true);
  };

  const displayMembers = () => {
    dispatch("showMembers", true);
  };

  let isOpen = false;
</script>

<Row>
  <Col
    class="d-flex justify-content-between align-items-center"
    sm="{{ size: 12 }}"
    md="{{ size: 8, offset: 2 }}"
    lg="{{ size: 6, offset: 3 }}"
  >
    <span class="group-title">{groupName}</span>
    <!-- <span class="d-none d-md-block text-link" on:click="{displayMembers}">
      Settings
    </span> -->
    <Button
      class="d-none d-md-block text-link"
      on:click="{displayMembers}"
      color="{'secondary'}"
      outline
    >
      Settings
    </Button>
    <span>
      <Button
        class="d-none d-md-block"
        outline
        color="{'success'}"
        on:click="{displayModal}"
      >
        Add member
      </Button>
    </span>
    <Dropdown
      class="d-sm-none btn-danger"
      {isOpen}
      toggle="{() => (isOpen = !isOpen)}"
      direction="left"
    >
      <DropdownToggle caret color="{'primary'}">Options</DropdownToggle>
      <DropdownMenu>
        <DropdownItem on:click="{displayModal}">Add member</DropdownItem>
        <DropdownItem on:click="{displayMembers}">Settings</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Col>
</Row>
