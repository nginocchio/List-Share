<script>
    import { Col, Container, Row, Button } from 'sveltestrap';
    import { push } from 'svelte-spa-router';
    import Cases from './components/Cases.svelte';
    import Testimonial from './components/Testimonial.svelte';
</script>


<Container class="p-0" fluid={true}>
    <div class="gradient">
        <Row class="align-items-center">
            <Col class="text-left" sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3}} lg={{ size: 3, offset: 3}} >
                <h1 class="text-white">Always stay on the same page with ListShare</h1>       
                <p class="text-white">
                    Whether you are tracking your groceries, or completing tasks for your next sprint.
                    Always stay on track with ListShare. The collaboration tool for the 21st century.
                </p>
                <Button on:click="{ () => push('/signup') }" size="lg" color={"success"}>Sign up now!</Button>
            </Col>
            <Col class="d-flex mx-auto" sm={{ size: 8 }} md={{ size: 6 }} lg={{size: 3, offset: 1}}>
                <img class="d-none d-sm-block" height="450" src="assets/Calendar_SVG.svg" alt="Calendar">
            </Col>
        </Row>
    </div>
</Container>
<Container>
    <Cases />
    <h2 class="text-center mb-3">Testimonials</h2>
    <Testimonial
        img={'assets/JuliaAr.jpg'}
        name={'Julia Arencia'}
        role={'Chief Strategist Vroom'}
        text="With List Share our dev team was able to deploy ahead of schedule!"
    />
    <Testimonial
        img={'assets/SamuelWorley.jpg'}
        reverse={true}
        name={'Samuel Worley'}
        role={'Software Engineer'}
        text="List Share enabled me to take on more clients than I ever imagined."
    />
    <Testimonial
        img={'assets/chrisfoster.jpg'}
        text="I'll be on-boarding all employees with List Share. It exceeded all expectations."
    />
</Container>

<footer>
    <p>Copyright &copy; ListShare 2020</p>
    <img src="assets/facebook.svg" alt="facebook">
    <img src="assets/twitter.svg" alt="twitter">
</footer>

<style>
    .gradient {
        background: rgb(43,187,173);
        background: linear-gradient(90deg, rgba(43,187,173,1) 28%, rgba(0,212,255,1) 100%);
        padding: 10rem 0; 
    }

    footer {
        display: flex;
        justify-content: center;
        padding: 1rem;
        margin-top: 2rem;
		border-top: 1px solid rgba(255,62,0,0.1);
    }

    footer > * {
        margin: 0 1rem;
    }

</style>