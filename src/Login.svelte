<!-- Login -->
<script>
    import { auth } from './firebaseConfig';
  import { Form, FormGroup, FormText, Input, Label, Button, Alert, Row, Col, Container } from 'sveltestrap';
  import { link, replace, push } from 'svelte-spa-router';
  const color = 'primary';
  let email;
  let password;
  let error;
  let errorMessage;

  const handleSubmit = (e) => {
      e.preventDefault();
      auth.signInWithEmailAndPassword(email, password).then(user => {
        localStorage.setItem('user', user.uid);
        replace('/groups');
      })
      .catch((e) => {
        error = true
        if (e.code == 'auth/wrong-password' || e.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email or password';
        } else if (e.code == 'auth/user-not-found') {
            errorMessage = 'User not found.';
        }
      })
    //   try {
    //     let res = await auth.signInWithEmailAndPassword(email, password);
    //     localStorage.setItem('user', res.uid);
    //     replace('/groups');
    //   } catch (e) {
    //       error = true
    //       if (e.code == 'auth/wrong-password' || e.code === 'auth/invalid-email') {
    //           errorMessage = 'Invalid email or password';
    //       } else if (e.code == 'auth/user-not-found') {
    //           errorMessage = 'User not found.';
    //       }
    //   }

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
        <Col sm="13" md={{ size: 6, offset: 3}} lg="{{ size: 4, offset: 4}}">
            <h1 class="text-center">Sign in</h1>
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
                    <Label for="password">Password</Label>
                    <Input bind:value={password} type="password" name="password" placeholder="Enter password"></Input>
                </FormGroup>
                <Button block size="lg" {color}>Log in</Button>
                <p class="signup text-center text-secondary">Don't have an account yet? <a href="/signup" use:link>Sign up.</a></p>
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