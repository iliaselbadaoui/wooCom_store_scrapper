import requests as r
import time as t
from bs4 import BeautifulSoup
from wooFile import add_to_file, woo_template, get_file
import re
import socketio

def scrape_product_details(product_page_url, description_selector, image_selector):
    """Scrapes product details from the product's page."""
    response = r.get(product_page_url)
    product_soup = BeautifulSoup(response.text, 'html.parser')


    # Adjust the selector based on your site's structure to get the product description
    hrml_desc = product_soup.select_one(description_selector).decode()
    images = []
    image_elements = product_soup.select(image_selector)
    for img in image_elements:
        images.append(img.find('img')['src'])
    cs_images = ", ".join(images)
    return {"description": hrml_desc, "images": cs_images}


def scrape_page(req, sess, sio, sid):
    """Scrapes a page of products and looks for a link to the next page."""
    response = sess.get(req.get("store"))
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find product elements - adjust the selector based on your site's HTML structure
    product_elements = soup.select(req.get("product"))  # Adjust '.product' to the correct class or element
    for product in product_elements:
        # Adjust the selector as necessary
        name = product.select_one(req.get("title"))  # Adjust '.product-name' accordingly
        price = product.select_one(req.get("price")).text.strip()  # Adjust '.price' accordingly

        # Find the link to the product's individual page to get the description
        product_link = ''
        if name.select_one('a'):
            product_link = name.select_one('a')['href']
        elif product.select_one('a')['href']:
            product_link = product.select_one('a')['href']
        details = scrape_product_details(product_link, req.get("description"), req.get("images"))

        price = float(re.sub(r"[^\d\-+.]", "", price))

        prod = {"name": name.text.strip(), "price": price, "description": details.get("description"), "images": details.get("images")}

        add_to_file(prod, woo_template)
        sio.emit("counter", {"message": 1})

    # Look for the 'next page' link - adjust the selector as needed
    next_page_link = soup.select_one(req.get("nextPage"))  # Adjust '.next-page' to the correct class or element
    if next_page_link:
        req["store"] = next_page_link['href']
        t.sleep(5)  # Be respectful by waiting a bit before making the next request
        scrape_page(req, sess, sio, sid)

def woo(req, sio, sid):
    # Start scraping from the first page of the product listing
    session = r.Session()  # Using a session to persist cookies and headers across requests
    scrape_page(req, session, sio, sid)
    sio.emit("products_csv", get_file(woo_template))
    sio.disconnect(sid)
