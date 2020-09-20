<script>
    import { Row, Col } from 'sveltestrap';
    export let img = 'assets/chrisfoster.jpg';
    export let name = 'Chris Foster'
    export let role = 'CEO Foster Dynamix';
    export let reverse = false;
    export let text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, consectetur.';
</script>


<Row>
    <Col sm="{{ size: 12 }}" md="{{ size: 10, offset: 1 }}" lg="{{size: 6, offset: 3}}" xl="{{size: 8, offset: 2}}">
        <div class="testimonial {reverse ? 'reverse' : ''}">
            <div class="left">
                <img class="customer-img" src={img} alt="satisfied customer">
            </div>
            <div class="right">
                <p class="customer-info"><span class="testimonial-name">{ name }</span><br><em class="text-secondary">{ role }</em></p>
                <p class="user-quote">{ text }</p>
            </div>
        </div>
    </Col>
</Row>

<style>
    .testimonial {
        display: flex;
        align-items: center;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);
        padding: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .testimonial > * {
        padding: 1rem;
    }

    .testimonial-name {
        font-size: 1.25rem; 
    }

    .customer-img {
        height: 90px;
        border-radius: 50%;
    }
    
    .reverse {
        flex-direction: row-reverse;
    }
</style>