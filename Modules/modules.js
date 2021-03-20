
async function getActiveModuleData(response)
{  
    var data=[]  
        for(let [key,value] of Object.entries(response))
        {
           if(value.active.toUpperCase()=='YES')
              data.push(value.module_name)     
        }  
    return data   
}

async function validateData(data){
    return data==null ? true:false
}
async function validateBody(data){
    return data==null || data.trim()==""?true:false
}


module.exports={
    getActiveModuleData,validateData,validateBody
}