import { poolConn } from "../db/db.js";

export async function pedidos(req, res){
    try{
        const idRuta = req.params.idRuta;
        const pool = await poolConn;
        const result = await pool.request().input('idruta', idRuta).query('SELECT * FROM dbo.admFolios WHERE IDRUTA = @idruta;');
        const pedidos = result.recordset;
        res.json(pedidos);
    }
    catch(err){
        console.error(err);
    }
}

export async function nuevo_pedido(req, res){
    try{
        const id = req.params.id;
        const {idRuta, folio, poblacion} = req.body;
        console.log(idRuta, folio, poblacion);
        const pool = await poolConn;
        const selectResult = await pool.request().input('folio', folio)
        .query("SELECT dbo.admDocumentos.[CIDDOCUMENTO], CASE WHEN dbo.admDocumentos.[CRAZONSOCIAL] = 'Público General' OR dbo.admDocumentos.[CRAZONSOCIAL] = 'Publico General' THEN dbo.admClientes.[CTEXTOEXTRA3] ELSE dbo.admDocumentos.[CRAZONSOCIAL] END AS [CRAZONSOCIAL] FROM dbo.admDocumentos INNER JOIN dbo.admClientes ON dbo.admDocumentos.[CIDCLIENTEPROVEEDOR] = dbo.admClientes.[CIDCLIENTEPROVEEDOR] WHERE [CFOLIO] = @folio AND [CSERIEDOCUMENTO] = 'PCIC1'");
        if(selectResult.recordset.length === 0){
            console.log('Folio no encontrado');
            req.flash(`danger`, 'Folio inválido');
            res.redirect(`/home/${id}`);
        }
        else{
            console.log(selectResult.recordset);
            const cliente = selectResult.recordset;
            const selectFolio = await pool.request().input('folio', folio).query('SELECT * FROM dbo.admFolios WHERE FOLIO = @folio');
            if(selectFolio.recordset.length > 0){
                console.log('Pedido registrado anteriormente');
                req.flash(`danger`, 'El pedido ya se encuentra en algun viaje');
                res.redirect(`/home/${id}`);
            }
            else{
                const insertResult = await pool.request().input('id', cliente[0].CIDDOCUMENTO)
                .input('nombre', cliente[0].CRAZONSOCIAL)
                .input('poblacion', poblacion)
                .input('folio', folio)
                .input('idruta', idRuta)
                .query('INSERT INTO dbo.admFolios(IDDOCUMENTO, RAZONSOCIAL, POBLACION, FOLIO, IDRUTA) VALUES(@id, @nombre, @poblacion, @folio, @idruta)');
                if(insertResult.rowsAffected[0]>0){
                    console.log('Pedido agregado correctamente.');
                    req.flash(`success`, 'Pedido agregado con éxito');
                    res.redirect(`/home/${id}`);
                }
                else{
                    console.log('Error de inserción');
                    req.flash(`danger`, 'Error al agregar el pedido');
                    res.redirect(`/home/${id}`);
                }
            }
        }
    }
    catch(err){
        console.error(err);
    }
}

export async function nombre(req, res){
    try{
        const id = req.params.id;
        const {idOrder, nombre} = req.body;
        const pool = await poolConn;
        const insertResult = await pool.request().input('idfolio', idOrder).input('nombre', nombre)
        .query('UPDATE dbo.admFolios SET RAZONSOCIAL = @nombre WHERE IDFOLIO = @idfolio');
        if(insertResult.rowsAffected[0]>0){
            console.log('Nombre editado exitosamente.');
            req.flash(`success`, 'Nombre editado exitosamente');
            res.redirect(`/home/${id}`);
        }
        else{
            console.log('Error de edición');
            req.flash(`danger`, 'Error de edición');
            res.redirect(`/home/${id}`);
        }
    }
    catch(err){
        console.error(err);
    }
}

export async function eliminar_pedido(req, res){
    try {
        const idFolio = req.params.idFolio;
        const pool = await poolConn;
        const result = await pool.request().input('idfolio', idFolio).query('DELETE FROM dbo.admFolios WHERE IDFOLIO = @idfolio;');
        if (result.rowsAffected[0]>0) {
            res.json({ success: true });
        }
        else{
            res.status(404).json({ success: false, message: 'No se encontró el pedido con ese ID' });
        }
    } catch (err) {
        console.error(err);
    }
}