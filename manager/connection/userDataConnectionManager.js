
export async function getUserData(data){
    console.log("get user data body" , data)
    try{
        let question = await fetch('http://10.0.2.2:3000/api/get-user'
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

export async function resetPassword(data){
    try{
        let question = await fetch('http://hc.transtv.co.id/rest/teams/index.php/admin-reset-password'
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

export async function insertUser(data){
    try{
        let question = await fetch('http://10.0.2.2:3000/api/insert-user'
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

export function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Request Timeout"))
        }, milliseconds)
        promise.then(resolve, reject)
    })
}