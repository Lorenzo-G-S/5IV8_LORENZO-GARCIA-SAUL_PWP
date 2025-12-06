const { parse } = require("path");

function createnewitem(event){{
    event.preventDefault();

    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const categoryid = parseInt(document.getElementById('categoryid').value);

    const newItem = {
        name: name,
        price: price,
        stock: stock,
        categoryid: categoryid
    };      

    
    
}