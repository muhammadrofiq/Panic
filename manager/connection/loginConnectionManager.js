
import ServerValue from './../../value/Server';
export async function getPerusahaanList(){
    // console.log("masuk get")
    try{
        let question = await fetch('https://assessment.transmedia.id/rest/assessment/index.php/data-perusahaan'
        , {
            method: 'GET'
        });

        let result = await question.json();
        // console.log("TCL: getPerusahaanList -> result", result)
        question = null
        return result
    }
    catch(error){
        // console.log("TCL: getPerusahaanList -> error", error)
        throw error;
    }
}


export async function loginAssessment(data){
    try{
        let question = await fetch('https://assessment.transmedia.id/rest/assessment/index.php/login'
        , {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
        });

        let result = question.json();
        question = null

        return result
    }
    catch(error){
        throw error;
    }
}


export async function loginAdminAssessment(data){
    console.log( "server :" , ServerValue.main, "| data :", data)
    try{
        let question = await fetch("http://10.0.2.2:3000" + "/api/login"
        , {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
        });

        let result = question.json();
        
        console.log("result :" , result + "|question :", question)
        question = null
        return result
    }
    catch(error){
        throw error;
    }
}
export async function registerAssessment(data){
    var payload = {
        username:data.username,
        perusahaan:data.company,
        password:data.password,
        email:data.email,
        fullname:data.fullname
    }
    // console.log( "this the payload untuk register : "+JSON.stringify(payload))
    try{
        let question = await fetch('https://assessment.transmedia.id/rest/assessment/index.php/registrasi-user'
        , {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
        });

        let result = question.json();
        question = null

        return result
    }
    catch(error){
        throw error;
    }
}
