<!-- Sign up -->
<script>
  import { Form, FormGroup, FormText, Input, Label, Button, Alert, Row, Col, Container } from 'sveltestrap';
  import { link, replace } from 'svelte-spa-router';
  const color = 'primary';
  import { db, auth } from './firebaseConfig';
  let email;
  let password;
  let username;
  let error;
  let errorMessage;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await userExists(username)) {
            error = true;
            errorMessage = 'That username already exists.'
            return;
        }
        auth.createUserWithEmailAndPassword(email, password).then(user => {
            const uid = user.user.uid;
            db.collection('users').doc(uid).set({
                username: username,
                email: email,
            }).then(() => {
                localStorage.setItem('user', uid);
                replace('/groups');
            });
        })
        .catch((firebaseError) => {
            error = true
            if (firebaseError.code === 'auth/weak-password') {
                errorMessage = 'Password is not strong enough.';
            } else if (firebaseError.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with that email already exists.';
            } else if (firebaseError.code === 'auth/invalid-email') {
                errorMessage = 'Email address is not valid.';
            }
        })
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

  const userExists = async (username) => {
      const response = await db.collection('users').where('username', '==', username).get();
      if (response.empty) {
          return false;
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
                <Button block size="lg" {color}>Sign up</Button>
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