<script>
    import { Col, Container, Row, Button, Card, CardBody } from 'sveltestrap';
</script>

<Row class="my-5 justify-content-center">
    <Col sm="12" md="6" lg="4">
        <div class="avatar">
            <img src="assets/info.svg" alt="trending" class="avatar-img">
        </div>
        <div class="text-center">
            <h4 class="my-3">Stay Informed</h4>
            <p class="text-center pad-text">With List Share's real time technology never fall behind on what's going on.</p>
        </div>
    </Col>
    <Col sm="12" md="6" lg="4">
        <div class="avatar">
            <img src="assets/award.svg" alt="trending" class="avatar-img">
        </div>
        <div class="text-center">
            <h4 class="my-3">Exceed Expectations</h4>
            <p class="pad-text">Simple and easy to use List share makes it easy to get ahead and stay ahead.</p>
        </div>
    </Col>
    <Col sm="12" md="6" lg="4">
        <div class="avatar">
            <img src="assets/trending-up.svg" alt="trending" class="avatar-img">
        </div>
        <div class="text-center">
            <h4 class="my-3">Streamline Productivity</h4>
            <p class="text-center pad-text">Create Lists for you, your team, or for that trip to the store. Everyone can be more productive with List share.</p>
        </div>
    </Col>
</Row>

<style>
    .avatar {
        background: rgb(43,187,173);
        background: linear-gradient(90deg, rgba(43,187,173,1) 28%, rgba(0,212,255,1) 100%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
    }
    
    .avatar-img {
        position: absolute;
        width: 40px;
        top: 30%;
        left: 30%;
    }
    
    .pad-text {
        padding: 0 2rem;
    }
</style>