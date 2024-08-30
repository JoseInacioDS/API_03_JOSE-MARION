
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const mysql_config = require('./inc/mysql_config');
const functions = require('./inc/functions');

const API_AVAILABILITY = true;
const AP_VERSION = '3.0.0';


const app = express();
app.listen(3000, ()=>{
    console.log("Server Open!");
})




app.use((req, res, next)=>{
    if(API_AVAILABILITY)
    {
        next();
    }
    else
    {
        res.json(functions.response('atenção', 'API está em manutenção, Sinto muito', 0,null))
    }
})


const connection = mysql.createConnection(mysql_config);

app.use(cors());

app.use(json());

app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) =>{
    res.json(functions.response('sucesso', 'API está rodando',0, null))
})

app.get('/tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks',(err, rows));
})

app.get('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    connection.query('SELECT * FROM tasks WHERE id=?',[id],(err,rows)=>{
        if(!err)
        {
            if(rows.lenght>0)
            {
                res.json(functions.response('Sucesso', 'Sucesso na pesquisa', rows.affectedRows(data)))

            }
            else
            {
                res.json(functions.response('Atenção', 'Não foi possível encontrar a task solicitada',0,null))
            }
        }
        else
        {
            res.json(functions.response('error', err.message,0,null))
        }
    })
})



app.delete('/tasks/:id/delete', (req,res) =>{
    const id = req.params.id;
    connection.query('DELETE FROM tasks WHERE id=?', [id], (err, rows)=>{
        if(!err)
        {
            if(rows.affectedRows > 0)
            {
                res.json(functions.response('Sucesso', 'Task deletada', rows.affectedRows, null))
            }
            else
            {
                res.json(functions.response('Atenção', 'Task não encontrada',0, null));
            }
        }
        else
        {
            res.json(functions.response('Erro', err.message,0,null));
        }
    })
})

app.put('/tasks/create', (req,res)=>{
    const post_data = req.body;

     if(post_data == undefined)
    {
        res.json(functions.response('Atenção', 'Sem dados de uma nova task',0,null));
        return;
    }

    const task = post_data.task;
    const status = post_data.status


    connection.query('INSERT INTO tasks(tasks, status, created_at.update_at) VALUES(?,?,NOW(),NOW())', [task, status], (err,rows)=>{
        if(!err)
        {
            res.json('Suesso', 'Task cadastrada com alegria no banco', rows.affectedRows,null)
        }
        else
        {
            res.json(functions.response('Erro', err.message, 0, null));
        }
    })
})







app.use((req,res)=>{
    res.json(functions.response('atenção', 'Rota não encontrada', 0, null))
})