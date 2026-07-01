import { LineType } from "dxf-writer"
import { lineTypeType, lineWeightType } from "../../entities/Entity"

export const Object_Properties = (siMap) => {
    let htmlStr = ''
    htmlStr += `
            <div class="wcs_panel_item">
                <div class="wcs_panel_item_title"><label>Objects</label></div>
                <div class="wcs_panel_dropdown wcs_panel_objectsList">
                    <div class="wcs_panel_dropdown_btn">
                        <label></label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div  class="wcs_panel_dropdown_content"></div>
                    </div>
                </div>  
            <div class="wcs_panel_item wcs_objectLayers">
                <div class="wcs_panel_item_title"><label>Layer</label></div>
                <div class="wcs_panel_dropdown wcs_panel_dropdown_layer">
                    <div class="wcs_text_rtl wcs_panel_dropdown_btn">
                        <label></label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div class="wcs_panel_dropdown_content">
                    </div>
                </div>
            </div>  
            
            <div class="wcs_panel_item wcs_objectColors">
                <div class="wcs_panel_item_title"><label>Color</label></div>
                <div class="wcs_panel_dropdown">
                    <div class="wcs_panel_dropdown_btn">
                        <div class="wcs_panel_colorSelector_div"></div>
                        <label class="wcs_panel_colorSelector_label"></label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div class="wcs_panel_dropdown_content">
                        ${getColors()}
                    </div>
                    </div>
            </div>  
            <div class="wcs_panel_item wcs_lineType">
                <div class="wcs_panel_item_title"><label>Line Type</label></div>
                <div class="wcs_panel_dropdown wcs_panel_dropdown_lineType" >
                    <div class="wcs_panel_dropdown_btn">
                        <label></label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div  class="wcs_panel_dropdown_content">
                        ${getLineType()}
                    </div>
                </div>
            </div>  
            <div class="wcs_panel_item wcs_lineWeight">
                <div class="wcs_panel_item_title"><label>Line Weight</label></div>
                <div class="wcs_panel_dropdown">
                    <div class="wcs_panel_dropdown_btn">
                        <label></label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div  class="wcs_panel_dropdown_content">
                        ${getLineWeight()}
                    </div>
                    </div>
            </div>  
            <div class="wcs_panel_item wcs_object wcs_object_center">
                <div class="wcs_panel_item_title"><label>Center X</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_panel_circle_x wcs_panel_circle_geometry" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_center">
                <div class="wcs_panel_item_title"><label>Center Y</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_panel_circle_y wcs_panel_circle_geometry" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_center">
                <div class="wcs_panel_item_title"><label>Radius</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_panel_circle_radius wcs_panel_circle_geometry" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_center">
                <div class="wcs_panel_item_title"><label >Area</label></div>
                <div><label class="wcs_panel_circle_area"></label></div>
            </div>
            
            <div class="wcs_panel_item wcs_object wcs_object_line">
                <div class="wcs_panel_item_title"><label>startX</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_panel_line_coordinate wcs_panel_line_sx" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_line">
                <div class="wcs_panel_item_title"><label>startY</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_panel_line_coordinate wcs_panel_line_sy" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_line">
                <div class="wcs_panel_item_title"><label>endX</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_panel_line_coordinate wcs_panel_line_ex" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_line">
                <div class="wcs_panel_item_title"><label>endY</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_panel_line_coordinate wcs_panel_line_ey" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_line">
                <div class="wcs_panel_item_title"><label>Length</label></div>
                <div><label class="wcs_panel_line_length"></label></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_line">
                <div class="wcs_panel_item_title"><label>Angle</label></div>
                <div><label class="wcs_panel_line_Angle"></label></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_pline">
                <div class="wcs_panel_item_title"><label>Length</label></div>
                <div><label class="wcs_panel_pline_length"></label></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_point">
                <div class="wcs_panel_item_title"><label>X</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_point">
                <div class="wcs_panel_item_title"><label>Y</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_text">
                <div class="wcs_panel_item_title"><label>Content</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_text">
                <div class="wcs_panel_item_title"><label>Rotation</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input" type="number"></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_text">
                <div class="wcs_panel_item_title"><label>Text Heigth</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input" type="number"></input></div>
            </div>


            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>کد واحد ثبتی</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_cms"
                maxlength="3"
                ${siMap.defaultCentriodCode.cms != '' ? 'disabled = "disabled"' : ''}
                ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>بخش</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_bakhsh" maxlength="2"
                oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
                ${siMap.defaultCentriodCode.bakhsh != '' ? 'disabled = "disabled"' : ''}
                ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>ناحیه</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_nahiye" maxlength="2"
                oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
                ${siMap.defaultCentriodCode.nahieh != '' ? 'disabled = "disabled"' : ''}
                ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>پلاک اصلی</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_asli" >
                ${siMap.defaultCentriodCode.asli != '' ? 'disabled = "disabled"' : ''}
                </input></div>
                
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>پلاک فرعی</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_fari" ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>مفروز و مجزا شده از</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_mafroozi" >
                ${siMap.defaultCentriodCode.mafruzi != '' ? 'disabled = "disabled"' : ''}
                </input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>شماره قطعه</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_ghate" ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_label">
                <div class="wcs_panel_item_title"><label>وضعیت تثبیت</label></div>
                <div class="wcs_panel_input_container"><input disabled="disabled" class="wcs_panel_input wcs_object_label_tasbit" ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_mabar">
                <div class="wcs_panel_item_title"><label>نام معبر</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_mabar" ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_mabar">
                <div class="wcs_panel_item_title"><label>عرض معبر</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_mabarArz" ></input></div>
            </div>
            <div class="wcs_panel_item wcs_object wcs_object_mabar">
                <div class="wcs_panel_item_title"><label>عرض اصلاح شده معبر</label></div>
                <div class="wcs_panel_input_container"><input class="wcs_panel_input wcs_object_label_mabarArzEslahi" ></input></div>
            </div>
            </div>
    `
    return htmlStr
}
export const Create_Object_Properties = (siMap, entity) => {
    let htmlStr = ''
    htmlStr += `   
                ${entity.createObjectPropetiesElement()}
    `
    return htmlStr
}
const getLineWeight = (siMap) => {
    let str = ''
    let cadMainLineWeigth = [{
            name: 'By Layer',
            index: lineWeightType.byLayer
        },
        {
            name: 'Default',
            index: lineWeightType.default
        },
        {
            name: '0.5 mm',
            index: lineWeightType.w0d5
        },
        {
            name: '1 mm',
            index: lineWeightType.w1d0
        },

        {
            name: '1.5 mm',
            index: lineWeightType.w1d5
        },

        {
            name: '2 mm',
            index: lineWeightType.w2d0
        },

    ]
    cadMainLineWeigth.forEach(item => {
        str += ` <div  elmLineWeigthName="${item.name}"  lineWeigthIndex="${item.index}" class="wcs_panel_objects_lineWeigth_container wcs_clickable">
                    <div><img class="wcs_checked_lineWeigth" src=""></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}
const getLineType = (siMap) => {
    let str = ''
    let cadMainLineType = [{
            name: 'By Layer',
            index: lineTypeType.byLayer
        },
        {
            name: 'Dashed',
            index: lineTypeType.dashed
        },
        {
            name: 'Countinues',
            index: lineTypeType.countinus
        }
    ]
    cadMainLineType.forEach(item => {
        var byLayer = ''
        if (item.name === 'By Layer') { byLayer = 'byLayer' }
        str += ` <div byLayer="${byLayer}" elmLineTypeName="${item.name}"  lineTypeIndex="${item.index}" class="wcs_panel_objects_lineType_container wcs_clickable">
                    <div><img class="wcs_checked_lineType" src=""></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}

const getColors = (siMap) => {
    let str = ''
    let cadMainColor = [{
            index: 7,
            name: 'By Layer',
            color: 'white'
        },
        {
            index: 0,
            name: 'Black',
            color: 'rgba(15,15,15,1)'
        },
        {
            index: 1,
            name: 'Red',
            color: 'rgb(255,0,0)'
        },
        {
            index: 2,
            name: 'Yellow',
            color: 'rgb(255,255,0)'
        },
        {
            index: 3,
            name: 'Green',
            color: 'rgb(0,255,0)'
        },
        {
            index: 4,
            name: 'Cyan',
            color: 'rgb(0,255,255)'
        },
        {
            index: 5,
            name: 'Blue',
            color: 'rgb(0,0,255)'
        },
        {
            index: 6,
            name: 'Magenta',
            color: 'rgb(255,0,255)'
        },
        {
            index: 7,
            name: 'White',
            color: 'rgb(255,255,255)'
        },
    ]
    cadMainColor.forEach(item => {
        var byLayer = ''
        if (item.name === 'By Layer') { byLayer = 'byLayer' }
        str += ` <div byLayer="${byLayer}" elmColorName="${item.name}" elmColor="${item.color}" colorIndex="${item.index}" class="wcs_panel_objects_color_container wcs_clickable">
                    <div><img src=""></div>
                    <div style="background-color:${item.color}"></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}


{
    /* <div class="wcs_objectProperties_name">Object Properties</div>
                    <div class="wcs_objectProperties_closer"><a><img src="./webCad_Icons/wcs-menucloser-light.svg"/></a></div> */
}

// <div class="wcs_panel_item_dropdown wcs_panel_item_content">
//     <label>salam</label>
//     <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
//     <div class="wcs_panel_dropdown_container">
//         <div class="wcs_panel_dropdown_content">
//             <a href="#">Link 1</a>
//             <a href="#">Link 2</a>
//             <a href="#">Link 3</a>
//         </div>
//     </div>

// </div>