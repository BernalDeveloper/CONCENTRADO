export function structOrders(results){

    const allOrders={};

    results.recordset.forEach(result => {

        const id = result.FOLIO;

        if(!allOrders[id]){
            allOrders[id] = {
                nombre: result.RAZONSOCIAL,
                folio: result.FOLIO,
                codigo: result.CCODIGOCLIENTE,
                credito: result.CDIASCREDITOCLIENTE,
                total: result.CTOTAL,
                poblacion: result.POBLACION,
                productos: []
            }
        }

        allOrders[id].productos.push({
            cantidad: result.CUNIDADESCAPTURADAS,
            nombreproducto: result.CNOMBREPRODUCTO+(result.COBSERVAMOV ? result.COBSERVAMOV:"")
        });

    });

    return allOrders;
}

export function Total(allOrders){
    let summation = 0;
    Object.values(allOrders).forEach(order =>{
        summation = summation + order.total;
    });
    return summation;
}

export function finalList(allOrders){
    const Products = [];
    Object.values(allOrders).forEach(order => {
        order.productos.forEach(producto => {
            const nombre = producto.nombreproducto;
            let productExists = Products.find(p => p.nombre === nombre);
            if (!productExists) {
                Products.push({
                    cantidad: producto.cantidad,
                    nombre: producto.nombreproducto
                });
            } else {
                productExists.cantidad += producto.cantidad;
            }
        });
    });
    return Products
}