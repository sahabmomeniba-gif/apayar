import { Overlay } from "ol";


export class SiMapPopup extends Overlay{
    constructor(siMap){
        
        super(
            {
                element:containerPopup(),
                // autoPan:{
                //     animation: {
                //       duration: 250,
                //     },
                //   },
                  offset:[15,15],
                //   positioning:'bottom-right'
            }
        );
        this.siMap = siMap;
        this.siMap.map.on('pointermove',e=>{
            this.setPosition(e.coordinate)
            
        })
        this.siMap.map.addOverlay(this)
            
    }
    removeEelement(){
        this.setPosition(undefined)
        this.element = containerPopup()
    }
}

const containerPopup = ()=>{
    let element = document.createElement('div');
    return element
}