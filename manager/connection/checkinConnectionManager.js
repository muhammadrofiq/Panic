
export async function Checkin(data,userData){
    bodyJson = {
        perusahaan: userData.perusahaan,
        username: userData.username,
        token: userData.token,
        id : parseInt(data)
    }
    try{
        let question = await fetch('https://assessment.transmedia.id/rest/assessment/index.php/aktifasi-user'
        , {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bodyJson),
        });

        let result = question.json();
        question = null

        return result
    }
    catch(error){
        throw error;
    }
}