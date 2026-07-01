export const webCad_isNumber = (string)=>{
    var number = parseFloat(string);
    // console.log(number)
    if(number === 0) return true
    if(!number) return false;
    else return true;
}