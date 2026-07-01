import parse, { DxfParser } from 'dxf-parser';

export  const fileDxfParser = async (fileText)=>{
    // console.log(fileText)
    const parser = new DxfParser();
    let dxf;
    try {
        dxf = parser.parseSync(fileText.result);
        // console.log(dxf.entities)
        
    }catch(err) {
        return console.error(err.stack);
    }
    // console.log(dxf.entities)
    // console.log('how? ')
    return dxf;
}