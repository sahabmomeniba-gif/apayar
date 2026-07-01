import { polarAngels } from '../../interactions/snap/PolarTracking'
import { snapTypes } from '../../interactions/snap/SnapTypes'
import './MenuStyle.css'
import MenuTemplate from './Template'

const SnapProperties = (options)=>{
    const control = options.control
    const template = MenuTemplate(options)
    const snapsCollection =  options.control.siMap.siSnap ?  options.control.siMap.siSnap.snapCollection : []
    // console.log(options.control)
    const snaps = getSnaps(snapsCollection,control)
    const polars = getPolars(snapsCollection,control)
    
    template.innerHTML += 
    `
    <div class="FeatureProperties">
        <label class="labels">
            Snaps
        </label>
        <table class="styled-table">
        <tbody>
            ${snaps}  
        </tbody>
        </table>
        <label class="labels">
            Polars
        </label>
        <table class="styled-table">
        <tbody>
            ${polars}  
            <tr>
                <td>Angles</td>
                <td>
                        <select  class="select polar-angle">
                            <option value="90">0,90,180,...</option>
                            <option value="45">0,45,90,...</option>
                            <option value="30">0,30,60,...</option>
                        </select>
                </td>
            </tr>
        </tbody>
        </table>
    </div>
    `
    return template
}


const getSnaps = (array,control)=>{
    let str = ''
    array.forEach((snap,index) => {
        // console.log(snap)
        if(snap.type != snapTypes.polar){
            
            if(snap.snapActive){
                str+=
                `
                <tr>
                        <td>${snap.name}</td>
                        <td>
                            <input type="checkbox" checked value="${snap.name}" class="snap-option">
                        </td>
                </tr>`
            }
            else{
                str+=
                `
                <tr>
                        <td>${snap.name}</td>
                        <td>
                            <input type="checkbox" value="${snap.name}" class="snap-option">
                        </td>
                </tr>`
            }
        }
        
    });
    // console.log(str)
    return str
}
const getPolars = (array,control)=>{
    let str = ''
    array.forEach((snap,index) => {
        // console.log(snap)
        if(snap.type === snapTypes.polar){
            if(snap.snapActive){
                str+=
                `
                <tr >
                        <td>active</td>
                        <td class="polarInput">
                            <input type="checkbox" checked value="${snap.name}"  class="snap-option">
                        </td>
                </tr>`
            }
            else{
                str+=
                `
                <tr>
                        <td>${snap.name}</td>
                        <td class="polarInput">
                            <input type="checkbox" value="${snap.name}" class="snap-option">
                        </td>
                </tr>`
            }
            var checked = snap.relativeMode ? 'checked' : ''
            // console.log(checked)
            if(snap.snapActive){
                
                str+=`
                    <tr>
                            <td >Relative to last line</td>
                            <td class="polarInput">
                                <input type="checkbox" ${checked} value="${snap.relativeMode}" class="polar-option">
                            </td>
                    </tr>`
            }
            else{
                str+=`
                    <tr>
                            <td >Relative to last line</td>
                            <td class="polarInput">
                                <input type="checkbox" disabled="disabled" ${checked} value="${snap.relativeMode}" class="polar-option">
                            </td>
                    </tr>`
            }
        }
        
    });
    // console.log(str)
    return str
}

export default SnapProperties