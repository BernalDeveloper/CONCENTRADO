import { poolConn } from "../db/db.js";
import { structOrders, Total, finalList } from "../services/JSON-Structure.js";
import { createPDF } from "../services/PDF.js";

export async function rutas(req, res){
    try{
        const id = req.params.id;
        const pool = await poolConn;
        const result = await pool.request().query('SELECT * FROM dbo.admRutas ORDER BY [IDRUTA] DESC;');
        const concentrados = result.recordset;
        res.render('concentrados', {rutas:concentrados, id:id, pedidos:null});
    }
    catch(err){
        console.error(err);
    }
}

export async function nueva_ruta(req, res){
    try{
        const id = req.params.id;
        const route = req.body.ruta;
        const pool = await poolConn;
        const result = await pool.request().input('ruta', route).query('INSERT INTO dbo.admRutas(NOMBRER) VALUES(@ruta)');
        if(result.rowsAffected[0]>0){
            console.log('Concentrado agregado correctamente.');
            req.flash(`success`, 'Concentrado agregado con éxito');
            res.redirect(`/home/${id}`);
        }
        else{
            console.log('Error de inserción');
            req.flash(`danger`, 'Error al crear el concentrado');
            res.redirect(`/home/${id}`);
        }
    }
    catch(err){
        console.error(err);
    }
}

export async function pdf(req, res) {
    try {
        const Route = req.params.idRuta;
        const Comp = req.params.Complete;
        const id = req.params.id;

        const query = `
        SELECT fol.[FOLIO], fol.[RAZONSOCIAL], fol.[POBLACION], rutas.[NOMBRER], mov.[CIDPRODUCTO], mov.[CUNIDADESCAPTURADAS], 
            mov.[COBSERVAMOV], prod.[CCODIGOPRODUCTO], prod.[CNOMBREPRODUCTO], doc.[CIDCLIENTEPROVEEDOR], cli.[CCODIGOCLIENTE],
            cli.[CDIASCREDITOCLIENTE], doc.[CTOTAL] FROM dbo.admFolios fol
        JOIN dbo.admMovimientos mov ON fol.IDDOCUMENTO = mov.CIDDOCUMENTO
        JOIN dbo.admProductos prod ON mov.CIDPRODUCTO = prod.CIDPRODUCTO
        JOIN dbo.admDocumentos doc ON fol.IDDOCUMENTO = doc.CIDDOCUMENTO
        JOIN dbo.admClientes cli ON doc.CIDCLIENTEPROVEEDOR = cli.CIDCLIENTEPROVEEDOR
        JOIN dbo.admRutas rutas ON fol.IDRUTA = rutas.IDRUTA
        WHERE fol.IDRUTA = @idRuta;`;

        const pool = await poolConn;
        const results = await pool.request().input('idRuta', Route).query(query);

        if(results.recordset.length > 0){

            const NameR = results.recordset[0].NOMBRER;
            const fecha = new Date();
            const letters = NameR.substring(0, 3);
            const year = fecha.getFullYear();
            const month = fecha.getMonth() + 1;
            const code = letters+year+month+"-"+Route;

            /*results.recordset.forEach(result => {
                // Logica para procesar cada fila de resultado
                console.log({
                    folio: result.FOLIO,
                    nombreRuta: result.NOMBRER,
                    producto: result.CNOMBREPRODUCTO,
                    cantidad: result.CUNIDADESCAPTURADAS,
                    codigoCliente: result.CCODIGOCLIENTE,
                    diasCredito: result.CDIASCREDITOCLIENTE,
                    montoTotal: result.CTOTAL
                });
            });*/

            const allOrders = structOrders(results);
            let Summation = Total(allOrders);
            const Products = finalList(allOrders);

            console.log(allOrders);
            console.log(Products);

            const pdf = createPDF(allOrders, Products, Summation, NameR, Route, Comp);

            if(Comp==1){
                res.setHeader('Content-Disposition', 'attachment; filename=' + code + 'M.pdf');
            }
            else{
                res.setHeader('Content-Disposition', 'attachment; filename=' + code + 'M(ST).pdf');
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdf);
        }
        else{
            console.log('Ningún valor relacionado');
            req.flash(`danger`, 'El concentrado aún no tiene pedidos');
            res.redirect(`/home/${id}`);
        }
    } catch(error){
        console.error('Error al generar el PDF:', error);
    }
}