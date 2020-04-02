import axios from 'axios'

export async function getDataFurnitureSaga(param, next) {
    return new Promise(async (resolve) => {    
       
        const newLink = 'http://www.mocky.io/v2/5c9105cb330000112b649af8'


        axios.get(newLink).then((res)=>{    
            param.furniture = res.data;
            resolve(param)
        }).catch((err)=>{
            param.error = err.toString();
            resolve(param);
        })
        
    });
    
}



