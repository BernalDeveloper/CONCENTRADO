import sql from 'mssql';
import keys from './keys.js';

const dbCMP = {
    user: keys.dbUser,
    password: keys.dbPassword,
    server: keys.dbServer,
    database: keys.bddcmp,
    options:{
      encrypt:false,
      trustServerCertificate:false,
      instanceName:keys.instanceName
    }
}

const poolConn = new sql.ConnectionPool(dbCMP)
    .connect().then(pool => {
        console.log('Conexion exitosa...');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
});

export {poolConn}