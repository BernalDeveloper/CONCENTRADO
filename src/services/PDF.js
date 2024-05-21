import {jsPDF} from "jspdf";
import 'jspdf-autotable';

export function createPDF(allOrders, Products, Summation, NameR, IdR, Comp){

    const doc = new jsPDF();
    const fecha = new Date();
    let y = 20;
    const letters = NameR.substring(0, 3);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();
    const hour = fecha.toLocaleTimeString("es-MX");
    const code = letters+year+month+"-"+IdR;

    doc.setFontSize(12);
    doc.text(code, 15, y);
    doc.setFontSize(14);
    doc.text("Embarque "+NameR, doc.internal.pageSize.getWidth()/2, y, {align: "center"});
    doc.setFontSize(10);
    doc.text("U.A: "+day+"/"+month+"/"+year+"-"+hour, 155, y);
    y+=15;
    
    Object.values(allOrders).forEach(order => {
        doc.setFontSize(11);
        doc.text(order.poblacion, doc.internal.pageSize.getWidth()/2, y, {align: "center"});
        doc.setFontSize(8);
        doc.text("DIAS CREDITO: "+order.credito, 155, y);
        y += 5;

        const products = order.productos.map(producto => [
            producto.cantidad.toString(), 
            producto.nombreproducto
        ]);

        if(Comp==1){
            doc.autoTable({
                startY: y,
                styles:{
                    fontSize: 8
                },
                head: [[order.folio, order.nombre+"\n"+order.codigo, 'Total: '+order.total, 'OBSERVACIONES']],
                body: products
            });
        }
        else{
            doc.autoTable({
                startY: y,
                styles:{
                    fontSize: 8
                },
                head: [[order.folio, order.nombre+"\n"+order.codigo, 'OBSERVACIONES']],
                body: products
            });
        }
        y = 10;
        y += doc.lastAutoTable.finalY;
    });

    var myObj = {
        style: "currency",
        currency: "MXN"
    }

    if(Comp==1){
        doc.setFontSize(11);
        doc.text("Sumatoria: "+Summation.toLocaleString("es-MX", myObj), 15, y);
    }

    const listProducts = Products.map(producto => [
        producto.cantidad.toString(), 
        producto.nombre
    ]);

    doc.setFontSize(11);
    doc.text("LISTADO DE PRODUCTOS", doc.internal.pageSize.getWidth()/2, y, {align: "center"});
    y += 5;
    doc.autoTable({
        startY: y,
        styles:{
        fontSize: 8
        },
        head:[['Cantidad', 'Producto']],
        body: listProducts,
    });

    const pdfBuffer = doc.output();

    return pdfBuffer;
}