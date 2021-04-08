const sqlActivity = require('../../SQL_ACTIVITY/crud')

async function addShop(data){
    const shops = await getShop(data)
    var shopFound = false
    if(shops !== null)
    {
    for(let value of Object.values(shops))
    {
        if(data.shopName === value)
        {
               shopFound=true 
               break
        }
    }
    }
    if(shopFound)
    {
        return {message:data.shopName + ' Shop already exist',statusCode:404}
    }

    var count = Object.entries(shops).length
   
    if(count>=5)
    {
        return {message:'No of Shops Limit Exceeded',statusCode:404}
    }

    var collectionName='Shop/Shops'
    collectionName = collectionName+'/'+data.uid
    var result =await addData(data.shopName,collectionName)

    var keyArray = result.key
    keyArray =keyArray[keyArray.length -1 ]

      result ={[keyArray]:data.shopName }

    return result
}

async function getShop(data){
    var collectionName='Shop/Shops'
    collectionName = collectionName+'/'+data.uid
    const result = await getData(collectionName)
    if(result == null)
    {
        return {message:'No data found',statusCode:404}
    }
    return result
}

async function addVendor(data){
    const shops = await getShop(data)

    var shopFound = false
    for(let value of Object.values(shops))
    {
        if(data.shopName === value)
        {
               shopFound=true 
               break
        }
    }

    if(!shopFound)
    {
        return {message:data.shopName + ' Shop not found',statusCode:404}
    }

    const vendors = await getVendor(data)
    var vendorFound = false
    for(let value of Object.values(vendors))
    {
        if(data.vendorName === value)
        {
            vendorFound=true 
               break
        }
    }

    if(vendorFound)
    {
        return {message:data.vendorName + ' Vendor already Exist',statusCode:404}
    }
    var count = Object.entries(vendors).length
   
    if(count>=5)
    {
        return {message:'No of Vendors Limit Exceeded',statusCode:404}
    }


    var collectionName='Shop/Vendors'
    collectionName = collectionName+'/'+data.uid+'/'+data.shopName
    var result =await addData(data.vendorName,collectionName)

    var keyArray = result.key
    keyArray =keyArray[keyArray.length -1 ]

      result ={[keyArray]:data.vendorName }
        
    
    return result
}

async function getVendor(data){
    var collectionName='Shop/Vendors'
    collectionName = collectionName+'/'+data.uid+'/'+data.shopName
    const result = await getData(collectionName)
    if(result == null)
    {
        return {message:'No data found',statusCode:404}
    }
    return result
}
async function addData(data,collectionName){
   const result = await sqlActivity.insertData(data,collectionName).then((response)=>{
        return response
    }).catch((error)=>{
        return {message : error.message}
    })

    return result
}

async function deleteShop(data){
    const shops = await getShop(data)
    var Foundkey=''
    for(let key in shops)
    {   
           if(shops[key]===data.shopName)
           {   
               Foundkey = key
               break
           } 
    }

    if(Foundkey.length ===0)
    {
        return {message:'No shop Found',statusCode:404}
    }
    var collectionName='Shop/Shops'
    collectionName = collectionName+'/'+data.uid+'/'+Foundkey
    const result = await deleteData(collectionName)

    var collectionName1='Shop/Vendors'
    collectionName1 = collectionName1+'/'+data.uid+'/'+data.shopName
    const result1 = await deleteData(collectionName1)

    var collectionName2='Shop/Products'
    collectionName2 = collectionName2+'/'+data.uid+'/'+data.shopName
    const result2 = await deleteData(collectionName2)
    
    var finalResult ={[Foundkey]:data.shopName}
    return finalResult
}

async function deleteVendor(data){
    const vendors = await getVendor(data)
    var Foundkey=''
    for(let key in vendors)
    {   
           if(vendors[key]===data.vendorName)
           {   
               Foundkey = key
               break
           } 
    }

    if(Foundkey.length ===0)
    {
        return {message:'No Vendor Found',statusCode:404}
    }
    var collectionName='Shop/Vendors'
    collectionName = collectionName+'/'+data.uid+'/'+data.shopName+'/'+Foundkey
    const result = await deleteData(collectionName)

    var collectionName2='Shop/Products'
    collectionName2 = collectionName2+'/'+data.uid+'/'+data.shopName+'/'+data.vendorName
    const result2 = await deleteData(collectionName2)

    var finalResult ={[Foundkey]:data.vendorName}
    return finalResult
    
}


async function addProduct(data){
    const shops = await getShop(data)

    var shopFound = false
    for(let value of Object.values(shops))
    {
        if(data.shopName === value)
        {
               shopFound=true 
               break
        }
    }

    if(!shopFound)
    {
        return {message:data.shopName + ' Shop not found',statusCode:404}
    }

    const vendors = await getVendor(data)
    var vendorFound = false
    for(let value of Object.values(vendors))
    {
        if(data.vendorName === value)
        {
            vendorFound=true 
               break
        }
    }

    if(!vendorFound)
    {
        return {message:data.vendorName + ' Vendor not Found',statusCode:404}
    }

    const products = await getProduct(data);
    var productFound = false
    for(let value of Object.values(products))
    {
        if(data.productName === value)
        {
            productFound=true 
               break
        }
    }

    if(productFound)
    {
        return {message:data.productName + ' Product already Exist',statusCode:404}
    }
    var count = Object.entries(products).length
   
    if(count>=5)
    {
        return {message:'No of Products Limit Exceeded',statusCode:404}
    }


    var collectionName='Shop/Products'
    collectionName = collectionName+'/'+data.uid+'/'+data.shopName+'/'+data.vendorName
    var result =await addData(data.productName,collectionName)

    var keyArray = result.key
    keyArray =keyArray[keyArray.length -1 ]

    result ={[keyArray]:data.productName }
    
    return result
}


async function deleteProduct(data){
    const products = await getProduct(data)
    var Foundkey=''
    for(let key in products)
    {   
           if(products[key]===data.productName)
           {   
               Foundkey = key
               break
           } 
    }

    if(Foundkey.length ===0)
    {
        return {message:'No Product Found',statusCode:404}
    }
    var collectionName='Shop/Products'
    collectionName = collectionName+'/'+data.uid+'/'+data.shopName+'/'+data.vendorName+'/'+Foundkey
    const result = await deleteData(collectionName)

    var finalResult ={[Foundkey]:data.productName}
    return finalResult
}


async function deleteData(collectionName){
   const result = await sqlActivity.deleteData(collectionName).then((response)=>{
        return response
    }).catch((error)=>{
        return {message : error.message}
    })

    return result
}


async function getProduct(data){
    var collectionName='Shop/Products'
    collectionName = collectionName+'/'+data.uid+'/'+data.shopName+'/'+data.vendorName
    const result = await getData(collectionName)
    if(result == null)
    {
        return {message:'No data found',statusCode:404}
    }
    return result
}

async function getData(collectionName){
    const result = await sqlActivity.fetchData(collectionName).then((response)=>{
       return response
    }).catch((error)=>{
        return {message : error.message}
    })

    return result
}

module.exports= {
addShop,getShop,addVendor,getVendor,deleteShop,deleteVendor,addProduct,getProduct,
deleteProduct
}



