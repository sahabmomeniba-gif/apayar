import { Collection } from 'ol'
import { add } from 'ol/coordinate'
import { EntityType } from '../../entities/Entity'
import { CentriodType } from '../../entities/Labels'
import { epictype } from '../../initparams'
import './MenuStyle.css'
import MenuTemplate from './Template'

const CentriodProperties = (options)=>{
    let control = options.control
    let label = control.label
    // console.log('label',label)  
    const atrrTabelElementstr = atrrTabelElement(label)
    const size = label? label.size : 12;
    const angle = label? label.rotation : 0;
    const template = MenuTemplate(options)
    const defaultSelectStr = defaultSelect(label)
    template.innerHTML += 
    `
    <div class="FeatureProperties">
    <label class="labels">
                نوع برچسب
    </label>
    <select style="width:98% !important"  class="select centriod_select">
    <option class="select_option" ${defaultSelectStr.id}  value="id">پلاک ثبتی</option>
    <option class="select_option" ${defaultSelectStr.name}  value="name">معبر</option>
    </select> 
    ${atrrTabelElementstr}
        <label class="labels">
            مشخصات 
        </label>
        <table class="styled-table">
            <tbody>
                <tr>
                    <td>سایز فونت</td>
                    <td><input type="number" value=${size} class="input input-size"></td>
                </tr>
                <tr>
                    <td>زاویه</td>
                    <td><input type="number" value=${angle*180/Math.PI} class="input input-angle"></td>
                </tr>   
            </tbody>
        </table>
        <br/>
        <button class="saveBtn">تایید و ذخیره سازی</button>
    </div>
    `
    return template
}
const defaultSelect = (label)=>{
    if(!label) return {id:'',name:''}
    if(label.centriodType === CentriodType.id) return {id:'selected = "selected"',name:''}
    if(label.centriodType === CentriodType.name) return {name:'selected = "selected"',id:''}
}

const epicTypeLink = ()=>{
    let str =''
    for (let index = 0; index < epictype['Export Worksheet'].length; index++) {
        str+=`<a epicType=${index}>${epictype['Export Worksheet'][index].TITLE}</a>`
    }
    return str
}
const atrrTabelElement = (label)=>{
    if(!label) return 
    // console.log(label,214142)
    let type = label.centriodType
    let cms = label ? label.sabtCode : 0
    let fari = label ? label.fari :0;
    let bakhsh = label ? label.bakhsh :0;
    let mafroozi = label ? label.mafroozi:0;
    let nahiye = label ? label.nahiye:0;
    let ghate = label ? label.ghate:0;
    let asli = label ? label.asli:0;
    let name = label.text;
    let arz = label ? label.arz : '';
    let arzEslahi = label? label.arzEslahi : '';
    let tasbit =''
    let selectedTypeName = ''
    let selectedTypeId = ''
    // console.log(label)
    if(label){
        if(label.epicType){
            // console.log(label.epicType)
            selectedTypeName = label.epicType.TITLE
            selectedTypeId = label.epicType.CODE
        } 
    }
    if(label){
        if(label.tasbit) tasbit = 'checked'
        else tasbit = ''        
    }
    let str;

    // console.log(type,4124124)
    if(type === CentriodType.id) {
        str =  `
        <label class="labels">
            کاربری
        </label>
        <table class="styled-table">
            <tbody>
            <tr>
                <td>نوع کاربری</td>
                <td>
                    <div class="CmsType-dropdown">
                    <button  class="CmsType-dropbtn">انتخاب</button>
                    <div id="CmsType-myDropdown" class="CmsType-dropdown-content">
                        <input type="text" placeholder="جست و جو..." id="CmsType-myInput" class="CmsType-myInput" >
                        ${epicTypeLink()}
                        </div>
                    </div>
                </td> 
            </tr>
                <tr>
                    <td>نام</td>
                    <td>
                        <input type="text" maxlength="3" disabled="disabled"  value="${selectedTypeName}" class="input"/>
                    </td> 
                </tr>
                <tr>
                    <td>کد</td>
                    <td>
                        <input type="text" maxlength="3" disabled="disabled"  value="${selectedTypeId}" class="input"/>
                    </td> 
                </tr>
                
            </tbody>
        </table>
        <label class="labels">
                کد های ثبتی
        </label>
        
        <table class="styled-table">
            <tbody>
                <tr>
                    <td>کد واحد ثبتی </td>
                    <td>
                        <input type="text" maxlength="3"  value="${cms}" class="input input-sabtcode"/>
                    </td> 
                </tr>
                <tr>
                    <td>بخش</td>
                    <td>
                        <input type="text" maxlength="2"   value="${bakhsh}" class="input input-bakhshcode"/>
                    </td> 
                </tr>
                <tr>
                    <td>ناحیه</td>
                    <td>
                        <input type="text" maxlength="2"  value="${nahiye}" class="input input-nahiyecode"/>
                    </td> 
                </tr>
                <tr>
                    <td>پلاک اصلی</td>
                    <td>
                        <input type="text"  value="${asli}" class="input input-pelakasli"/>
                    </td> 
                </tr>
                <tr>
                    <td>پلاک فرعی</td>
                    <td>
                        <input type="text" value="${fari}" class="input input-pelakfari"/>
                    </td> 
                </tr>
                <tr>
                    <td>مفروز و مجزا شده از</td>
                    <td>
                        <input type="text" value="${mafroozi}" class="input input-mafroozi"/>
                    </td> 
                </tr>
                <tr>
                    <td>شماره قطعه</td>
                    <td>
                        <input type="text" value="${ghate}" class="input input-ghate"/>
                    </td> 
                </tr>
                <tr>
                    <td>تثبیت شده </td>
                    <td><input type="checkbox" disabled="disabled" ${tasbit}  class="input-tasbit"></td>
                </tr>
            </tbody>
        </table>
        `
    }
        if(type === CentriodType.name){
            str = 
            `
            <label class="labels">
                     نام 
            </label>
            <table class="styled-table">
                <tbody>
                    <tr>
                        <td>
                            <input type="text" value="${name}" class="input input-Centriod-name"/>
                        </td> 
                    </tr>
                </tbody>
            </table>
            <label class="labels">
                     عرض معبر 
            </label>
            <table class="styled-table">
                <tbody>
                    <tr>
                        <td>
                            <input type="text" value="${arz}" class="input input-Centriod-arz"/>
                        </td> 
                    </tr>
                </tbody>
            </table>
            <label class="labels">
                     عرض اصلاحی معبر 
            </label>
            <table class="styled-table">
                <tbody>
                    <tr>
                        <td>
                            <input type="text" value="${arzEslahi}" class="input input-Centriod-arzEslahi"/>
                        </td> 
                    </tr>
                </tbody>
            </table>
            `
        }
    // console.log(str)
    return str;
}

export default CentriodProperties