import exp from "express"
import dot from "dotenv"
import mon from "mongoose"
import cors from "cors"
dot.config()
const app=exp()
app.use(exp.json())
app.use(cors())



const tschema=new mon.Schema({
    title:{
        type:String
    },
    description:String
});

const todocollection=mon.model('todo',tschema);

app.post('/todos',async(req,res)=>{

    const data={title:req.body.title, description:req.body.description}

    try{
        const entry=new todocollection(data);
        await entry.save();
        res.status(200).json(data)
        console.log("Added succesfully",data);
    }
    catch(err){
        res.status(400).json(data)
        console.log("failed to add",err);
    }
})

const middleware=(req,res,next)=>{
    console.log("Middleware");
    const user=true
    try{
        if(user){
            next();
        }else{
            console.log("not");
        }
    }catch(err){
        console.log("invalid user",err);
    }
}
app.get('/todos',middleware,async(req,res)=>{

    try{
        const data=await todocollection.find({}).exec();
        res.status(200).json(data)
        console.log("Get succesfully",data);
    }
    catch(err){
        res.status(400).json(data)
        console.log("failed to get",err);
    }
})
app.put('/todos/:id',async(req,res)=>{

    try{
        const entry=await todocollection.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json(entry)
        console.log("putsuccesfully",entry);
    }
    catch(err){
        res.status(400).json(err)
        console.log("failed to put",req.params.id);
    }
})
app.delete('/todos/:id',async(req,res)=>{

    try{
        await todocollection.findByIdAndDelete(req.params.id)
        res.status(200).json({message:`deleted ${req.params.id} successfully`})
        console.log("delete succesfully");
    }
    catch(err){
        res.status(400).json(err)
        console.log("failed to delete");
    }
})

const connect=async()=>{
    try{
        await mon.connect(process.env.MONGO)
    console.log("connected to mongoDb");
    }
    catch(err){
        console.log("not connected to mongoDB",err);
    }
}

app.listen(process.env.PORT,async()=>{
    await connect();
    console.log("Server is Running...");
})