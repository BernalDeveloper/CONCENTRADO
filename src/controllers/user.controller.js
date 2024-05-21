import { poolConn } from "../db/db.js";

export async function user(req, res){
    try{
        const {username, password} = req.body;
        const pool = await poolConn;
        const result = await pool.request().input('username', username).input('password', password)
        .query('SELECT * FROM dbo.admUsers WHERE USERNAME = @username AND PASSWORD = @password');
        if(result.recordset.length === 0){
            console.log('usuario no encontrado');
        }
        else{
            const id = result.recordset[0].IDUSER;
            res.redirect(`/home/${id}`);
        }
    }
    catch(err){
        console.error(err);
    }
}