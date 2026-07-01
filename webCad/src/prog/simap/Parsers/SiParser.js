import { fileDxfParser } from "./dxfParser";

export class SiParser{
    constructor(siMap){
        this.siMap = siMap;
    }
    setFile(file,name){
        this.file = file;
        this.fileFormat = this.getFileFormat(name);
        switch (this.fileFormat) {
            case fileFormatType.dxf:        
                return fileDxfParser(file);
            default:
                break;
        }
    }
    getFileFormat(name){
        let splitName = name.split('.');
        return splitName[splitName.length-1];
    }
}
const  fileFormatType = {
    dxf:'dxf'
}
