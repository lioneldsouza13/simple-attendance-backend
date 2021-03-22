
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

function validateData(data){
    return data==null ? true:false
}
function validateBody(data){
    return data==null || data.trim()==""?true:false
}

async function getKeyForModule(data,valueName){
    var keys=[]
    for(let [key,value] of Object.entries(data))
    {
            if(value.module_name==valueName)
            {
                keys.push(key)
            }
    }
    return keys
}

async function getAllModuleData(response)
{  
    var data=[]  
        for(let [key,value] of Object.entries(response))
        {
              data.push(value)     
        }  
    return data   
}



module.exports={
    getActiveModuleData,validateData,validateBody,getKeyForModule,getAllModuleData
}