const express  = require ('express');
const mysql = require ('mysql');
const { count } = require('console');
const app = express()

app.use(express.json())

const conectBD = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'portafolio'
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

  app.get('/', (req,res) =>{
    res.json({
        text:'App running'
    })
  })

  app.post('/inicio-sesion',(req,res) =>{
    console.log(req.body)

    const {user, password} = req.body
    const values = [user,password]
    const sql = 'select * from login where user = ? and password = ?'
    console.log('values', values)

    conectBD.query(sql,values,(err,result)=>{
      if(err){
        res.status(500).send(err)
      } else{
        if(result.length > 0){
          console.log(result)
          res.status(200).send({
            "idlogin": result[0].idlogin,
            "user": result[0].user
          })
        }else{
          res.status(400).send('Usuario no existe')
        }
      }
    })

  })

  app.get('/solicitud', (req,res) =>{
    const sql = 'SELECT * FROM solicitud'

    conectBD.query(sql, (error, result) =>{
        if(error) throw error
        if(result.length > 0){
            res.json(result)
        }else{
            res.send('Not reults')
        }
    })
})

app.get('/solicitud/:id', (req,res) =>{

    const id = req.params.id


    const sql = `SELECT * FROM solicitud WHERE idsolicitud = ${id}`

    conectBD.query(sql, (error, result) =>{
        if (error) throw error

        if(result.length > 0){
            res.json(result)
        }else{
            res.send('Not results')
        }
    })
})

app.post('/agregar', (req,res) =>{

    const sql = 'INSERT INTO solicitud SET ?'

    const solicitudObj = {
        idsolicitud: req.body.idsolicitud,
        nombre: req.body.nombre,
        correo: req.body.correo,
        celular: req.body.celular,
        tipoSolicitud: req.body.tipoSolicitud,
        comentario: req.body.comentario
    }

    conectBD.query(sql, solicitudObj, error =>{
        if(error) throw error

        res.send('Solicitud agregada con exito.')
    })

})

app.put('/actualizar/:id', (req,res) =>{

    const idsolicitud= req.params.id
    const{ nombre, correo, celular, tipoSolicitud, comentario } = req.body

    const sql = `UPDATE solicitud SET nombre = '${nombre}', 
    correo = '${correo}', celular= '${celular}', tipoSolicitud = '${tipoSolicitud}', 
    comentario = '${comentario}' WHERE idsolicitud = ${idsolicitud}`

    conectBD.query(sql, error =>{
        if(error) throw error
         res.send('Solicitud actualizada con exito')
    })
})


app.delete('/eliminar/:id', (req,res)=>{

    const idsolicitud =req.params.id
    const sql = `DELETE FROM solicitud where idsolicitud = ${idsolicitud}`

    conectBD.query(sql,err =>{
      if(err) throw err

      res.send('solicitud eliminada con éxito')
    })
})

app.listen(3001, console.log('Server running in port 3001'))
