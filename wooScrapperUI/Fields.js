import * as builder from './builder.js'
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

export default class Fields extends builder.Component
{
    constructor() {
        super();
        this.create()
    }

    create() {
        let storeLink = builder.textBox(null, 'Link to store /shop', 'text', 'input'),
            product = builder.textBox(null, 'Product selector', 'text', 'input'),
            title = builder.textBox(null, 'Title selector', 'text', 'input'),
            price = builder.textBox(null, 'Price selector', 'text', 'input'),
            nextPage = builder.textBox(null, 'Next page selector', 'text', 'input'),
            description = builder.textBox(null, 'Description selector', 'text', 'input'),
            images = builder.textBox(null, 'Product image selector', 'text', 'input'),
            scrape = builder.button(null, 'button', 'Start', null),
            number = 0,
            counter = builder.label("Label", '0 Products scrapped');

        storeLink.required = true
        product.required = true
        title.required = true
        price.required = true
        description.required = true
        images.required = true

        counter.style = 'display: none;'

        // storeLink.value = 'https://amundsensports.com/shop/'
        // product.value = '.no-featured-image-padding'
        // title.value = '.woocommerce-loop-product__title'
        // price.value = '.woocommerce-Price-amount'
        // description.value = '.description > div'
        // images.value = '.woocommerce-product-gallery__image'
        // nextPage.value = '.next'

        scrape.onclick = ()=>{
            const validator = new builder.Validator(this.component, ()=>{
                alert("All inputs are required")
            }, true)

            if (validator.validate())
            {
                let sock = io('http://127.0.0.1:21337'),
                    data = {
                        store: storeLink.value, title: title.value,
                        price: price.value, description: description.value,
                        images: images.value, product: product.value
                };

                scrape.textContent = 'WAIT...'
                scrape.disabled = true;
                counter.style = 'display: block;'

                if (nextPage.value !== '')
                    data.nextPage = nextPage.value
                sock.emit('start', data)
                sock.on('counter', (data)=>{
                    number++;
                    counter.textContent = number+" Products scrapped"
                })
                sock.on("products_csv", (file)=>{
                    const blob = new Blob([file], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = builder.anchor(null, 'anchor', url, 'Download')
                    const date = (new Date()).toLocaleDateString('us').split('/').join('-');
                    a.download = 'wooScrap_'+date+'.csv';
                    a.click()
                    URL.revokeObjectURL(url)
                    scrape.disabled = false;
                    scrape.textContent = 'Start'
                    counter.style = 'display: none;'
                    number = 0;
                })
            }

        }

        this.component = builder.block(null, 'Fields',
            [storeLink, product, title, price, description, images, nextPage, scrape, counter])
    }
}