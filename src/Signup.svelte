<!-- Sign up -->
<script>
  import { Form, FormGroup, FormText, Input, Label, Button, Alert, Row, Col, Container } from 'sveltestrap';
  import { link } from 'svelte-spa-router';
  const color = 'primary';
  let email;
  let password;
  let username;
  let error;
  let errorMessage;

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        let res = await auth.signInWithEmailAndPassword(email, password);
        await db.collection('users').doc().set({
            username: username,
            email: email,
            id: res.uid
        });
        localStorage.setItem('user', user.uid);
        replace('/groups');
      } catch (e) {
          error = true
          if (e.code === 'auth/weak-password') {
              errorMessage = 'Password is not strong enough.';
          } else if (e.code === 'auth/email-already-in-use') {
              errorMessage = 'An account with that email already exists.';
          } else if (e.code === 'auth/invalid-email') {
              errorMessage = 'Email address is not valid.';
          }
      }
  }

  const validateEmail = (e) => {
       let textbox = e.target;
       if (textbox.value === '') {
            textbox.setCustomValidity('Required email address');
        } else if (textbox.validity.typeMismatch){
            textbox.setCustomValidity('please enter a valid email address');
        } else {
           textbox.setCustomValidity('');
        }
        return true;
  }

</script>

<Container>
    <Row>
        <Col sm="12" md={{ size: 6, offset: 3}} lg="{{ size: 4, offset: 4}}">
            <h1 class="text-center">Sign up</h1>
            <p class="text-secondary text-sm text-center">A collaboration tool for the 21st century.</p>
            <Form
                on:invalid={validateEmail}
                on:changed={validateEmail}
                on:input={validateEmail}
                on:submit={handleSubmit}
                method="POST"
            >
                {#if error}
                    <Alert color={"danger"}>
                        { errorMessage }
                    </Alert>
                {/if}
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input bind:value={email} type="email" name="email" placeholder="Enter email"></Input>
                </FormGroup> 
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input bind:value={username} type="text" name="username" placeholder="Enter username"></Input>
                </FormGroup> 
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input bind:value={password} type="password" name="password" placeholder="Enter password"></Input>
                </FormGroup>
                <Button block size="lg" {color}>Log in</Button>
                <p class="signup text-center text-secondary">Already have an account? <a href="/login" use:link>Sign in.</a></p>
            </Form>
        </Col>
    </Row>
</Container>

<style>
    .signup {
        margin-top: 1rem;
    }
    h1 {
        margin-top: 4rem;
    }
</style>