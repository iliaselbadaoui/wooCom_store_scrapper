import pandas as pd

woo_template = {
    'ID': [],
    'Name': [],
    'Type': [],
    'SKU': [],
    'Short description': [],
    'Description': [],
    'Published': [],
    'Is featured?': [],
    'Visibility in catalog': [],
    'Date sale price starts': [],
    'Date sale price ends': [],
    'Tax status': [],
    'Tax class': [],
    'In stock?': [],
    'Stock': [],
    'Low stock amount': [],
    'Backorders allowed?': [],
    'Sold individually?': [],
    'Weight (unit)': [],
    'Length (unit)': [],
    'Width (unit)': [],
    'Height (unit)': [],
    'Allow customer reviews?': [],
    'Purchase Note': [],
    'Sale price': [],
    'Regular price': [],
    'Categories': [],
    'Tags': [],
    'Shipping class': [],
    'Images': [],
    'Download limit': [],
    'Download expiry days': [],
    'Parent': [],
    'Grouped products': [],
    'Upsells': [],
    'Cross-sells': [],
    'External URL': [],
    'Button text': [],
    'Position': [],
    'Attribute 1 name': [],
    'Attribute 1 value(s)': [],
    'Attribute 1 default': [],
    'Attribute 1 visible': [],
    'Attribute 1 global': [],
    'Download 1 name': [],
    'Download 1 URL': [],
}


def add_to_file(product, file):
    global woo_template
    file["Name"].append(product.get('name'))
    file["Description"].append(product.get('description'))
    file["Sale price"].append(product.get('price'))
    file["Images"].append(product.get('images'))



def get_file(file):
    max_length = max(len(arr) for arr in file.values())
    file = {key: file[key] + [''] * (max_length - len(file[key]))
            for key in
            file}
    return pd.DataFrame(file).to_csv(index=False).encode('utf-8')
