async function fetchdata(){
    try{
        const response = await fetch('http://localhost:3000/todos');

    if(!response.ok){
        throw new Error('Network response was not ok');
    }

    const data=await response.json();
    console.log("succes at fetching ",data);

    let todol=document.getElementById('todolist');
    todol.innerHTML='';

    data.forEach(item =>{
        let listitem = document.createElement('li');
        listitem.textContent=`${item.title} : ${item.description}`;
        todol.appendChild(listitem);

        let editbutton=document.createElement('button');
        editbutton.textContent='Edit';
        editbutton.id="btne";
        editbutton.onclick=function(){
            clickedit(item);
        }
        listitem.appendChild(editbutton);

        let deletebutton=document.createElement('button');
        deletebutton.textContent='Delete';
        deletebutton.id="btnd";
        deletebutton.onclick=function(){
            clickdelete(item._id);
        }
        listitem.appendChild(deletebutton);
    })
}
catch(err){
    console.log('failed while fetching data',err);
}
}
fetchdata();

async function createtodo() {
    try{
        let ti=document.getElementById("title");
        let des=document.getElementById("description");
        let data = {title:ti.value, description:des.value};
     const response= await fetch('http://localhost:3000/todos',{
        method:"POST",
        headers:{
            'content-Type':'application/json'
        },
        body:JSON.stringify(data)
    });
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    const res=await response.json();
    console.log("added todo",res);

    ti.value='';
    des.value='';
    fetchdata();
    }
    catch(err){
        console.log('failed adding todo',err);
    }
}

async function clickedit(item){
    try{
        const id=item._id;
        console.log(id);
        const savebutton=document.getElementById("btn");
        savebutton.textContent="Update";

        const tbutton=document.getElementById('title');
        tbutton.value=item.title;
        const dbutton=document.getElementById('description');
        dbutton.value=item.description;

        savebutton.onclick=async()=>{
            try{
                let ti=tbutton.value;
                let des=dbutton.value;
                const data={title:ti,description:des};
                const response= await fetch(`http://localhost:3000/todos/${id}`,{
                    method:"PUT",
                    headers:{
                        'content-Type':'application/json'
                    },
                    body:JSON.stringify(data)
                });
                if(!response.ok){
                    throw new Error('Network response was not ok');
                }
                const res=await response.json();
                console.log("updated todo",res);
                savebutton.textContent="Save";
            
                ti.value='';
                des.value='';
                fetchdata();
            }
            catch(err){
                console.log('update failed',err);
            }
        }
    }
    catch(err){
        console.log('unable to update',err);
    }
}
async function clickdelete(id){
    try{
        const response= await fetch(`http://localhost:3000/todos/${id}`,{
            method:"DELETE",
          })

    if (!response.ok){
        throw new Error('Network response was not ok');
    }

    console.log("Deleted",id);
    fetchdata();
    
}catch(err){
    console.log('delete failed',err);
}
}