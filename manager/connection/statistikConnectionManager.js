export async function getStatistikUserDataTahunan(){
    try{
        let question = await fetch('https://hc.transtv.co.id/images/xml/xml-TRANSTV/employee/employee-years.txt'
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