const express = require('express')
const app = express()
const helmet = require('helmet')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const config = require('./config')
const Image = require('./models/Image')
const conn = mongoose.connect(`mongodb://${config.db.usr}:${config.db.pass}@${config.db.server}:${config.db.port}/${config.db.database}`)
//const conn = mongoose.createConnection('mongodb://usr:pass@server_address:server_port/collection')
const fileUpload = require('express-fileupload')

//for security
app.use(helmet())

//public
app.use(express.static(path.join(__dirname, config.view.publicPath)))

// for files
app.use(fileUpload())

//Handlebars setup
app.engine(config.view.viewExt, exphbs({
    extname: config.view.viewExt
}))

//View Engine Setup
app.set('views', path.join(__dirname, config.view.viewPath))
app.set('view engine', config.view.viewExt)

//Server
const server = require('http').Server(app)

app.get('/show', (req,res) => {
    res.render('index',{
        layout:false
    })
})

app.post('/upload', (req, res) => {
    //console.log(req)
    if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
    //console.log(req.files)
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.sampleFile;    
    
    if(!sampleFile.mimetype.includes('image'))
        res.json({status:'format error'})
    else{

        img = new Image({
            img: {
                data : sampleFile.data,
                name : sampleFile.name,
                mimetype : sampleFile.mimetype
            }
        })

        img.save( function(err,doc){
            if(err){
                throw err
            }else{
                console.log('saved on mongo')
                res.json(doc._id)
            }
        })
        
        //copy the image on a defined folder on a project
        /*
        sampleFile.mv('./storage/'+sampleFile.name, function(err) {
            if (err)
            return res.status(500).send(err);
        
            res.json({status:'ok'});
        });*/
    }    
})

app.get('/img/:id',function(req, res){
    //console.log(req.params)
    Image.findById({_id:req.params.id}, function(err, doc){
        if(err){
            console.log(err)
            res.json({data:'bad request'})
        }
        else{
            res.json(doc.img.data);
        }
        
    })
    
})

server.listen(config.port,()=>{
    console.log(`Server is now runing`)
})
