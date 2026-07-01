import SaLabel from "../../entities/Cadastal/SeperationApratemanLabel"
import { lineTypeType, lineWeightType } from "../../entities/Entity"
import SiMap, { getCadColor } from "../../entities/SiMap"
import SiText from "../../entities/SiStaticText"
import { epictype, oraUseCodes, samtListType, useCodes } from "../../initparams"
import { getColorFromIndex, getLineTypeNameFromIndex, getLineWeigthNameFromIndex } from "./wcs_sidebar"
export const Labeling = (siMap, label) => {
    if (!label) {
        siMap.storage.currentSaLabel = {}
    } else {
        label.updateToSiMapStorage()
    }
    const useCaseList = oraUseCodes.A266FF2A662E84b639DA
    const directionList = samtListType
        // console.log(oraUseCodes.A266FF2A662E84b639DA.length)
    if (label) {
        // var a = useCaseList.find(c => parseFloat(c.CODE) === parseFloat(label.useCase))
        // useCaseList.forEach()
    }
    let useCaseListStr = ''
    let directionListStr = ''
    let directionName = ''
    useCaseList.forEach((item, index) => {
        useCaseListStr += `
            <li><a  saLabelIndex="${index}">${item.Name}</a></li>
        `
    })
    for (const key in directionList) {
        if (directionList.hasOwnProperty.call(directionList, key)) {
            const element = directionList[key];
            if (!label) {
                directionListStr += `
                    <div samtKey="${key}">${element.name}</div>
                `
            } else {
                if (parseFloat(element.code) === parseFloat(label.samt)) {
                    directionName = element.name
                        // console.log(directionName)
                    directionListStr += `
                    <div samtKey="${key}" class="wcs_labeling_direction_options_selected">${element.name}</div>
                    `
                } else { directionListStr += `
                <div samtKey="${key}">${element.name}</div>
            ` }
            }
        }
    }
    const labelSaType = (label) => {
        // console.log(label)
        if (!label) {
            return `
            <div class="wcs_Labeling_TypeSelectorContainer_disable wcs_Labeling_labelType_aparteman_btn">آپارتمان</div>
            <div class="wcs_Labeling_TypeSelectorContainer_disable wcs_Labeling_labelType_others_btn">سایر لایه ها</div>`
        } else {
            if (label.isAparteman) {
                return `<div class="wcs_Labeling_TypeSelectorContainer_active wcs_Labeling_labelType_aparteman_btn">آپارتمان</div>
                        <div class="wcs_Labeling_TypeSelectorContainer_disable wcs_Labeling_labelType_others_btn">سایر لایه ها</div>`
            } else {
                return `<div class="wcs_Labeling_TypeSelectorContainer_disable wcs_Labeling_labelType_aparteman_btn">آپارتمان</div>
                <div class="wcs_Labeling_TypeSelectorContainer_active wcs_Labeling_labelType_others_btn">سایر لایه ها</div>`
            }
        }
    }
    const firstActionClass = (label) => {
        // console.log(siMap.storage)
        if (!label && !(siMap.storage.currentSaLabel.useCase || siMap.storage.currentSaLabel.stringLabel)) {
            return {
                title: 'الصاق برچسب',
                class: 'wcs_actionButton_disable  wcs_bg_btn_disabled'
            }
        }
        if (!label && (siMap.storage.currentSaLabel.useCase || siMap.storage.currentSaLabel.stringLabel)) {
            return {
                title: 'الصاق برچسب',
                class: 'wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue',
            }
        }
        if (label) {
            return {
                title: 'ویرایش برچسب',
                class: 'wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue',
            }
        }
    }
    const hasDocument = (label) => {
        if (!label) {
            return `
            <div class="wcs_Labeling_TypeSelectorContainer">
                           <div class="wcs_Labeling_TypeSelectorContainer wcs_labeling_hasDoc">بلی</div>
                           <div class="wcs_labeling_hasNotDoc">خیر</div>
            </div>
                        `
        } else {
            // console.log(label.hasDocument)
            if (label.hasDocument) {
                return `
                <div class="wcs_Labeling_TypeSelectorContainer">
                    <div class="wcs_Labeling_TypeSelectorContainer_active wcs_labeling_hasDoc">بلی</div>
                    <div class="wcs_labeling_hasNotDoc">خیر</div>
                </div>
                        `
            } else {
                return `
                    <div class="wcs_Labeling_TypeSelectorContainer">
                        <div class="wcs_labeling_hasDoc">بلی</div>
                        <div class="wcs_Labeling_TypeSelectorContainer_active wcs_labeling_hasNotDoc">خیر</div>
                    </div>
                `
            }
        }
    }
    var htmlStr = ''
    htmlStr += `
        <div class="wcs_labeling_Container">
            <div class="wcs_labeling_mainLabel">
                <div class="wcs_labeling_mainLabel_label">

                </div>
                <div class="wcs_labeling_mainLabel_command">
                    <a class="wcs_labeling_mainLabel_command_btn  ${firstActionClass(label).class}">${firstActionClass(label).title}</a>
                    <a class="wcs_labeling_mainLabel_command_btn wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue wcs_labeling_multi">کپی برچسب</a>
                    <a class="wcs_labeling_mainLabel_command_btn wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue">کپی برچسب با افزایش شماره قطعه</a>
                </div>
            </div>
            <div class="wcs_labeling_Container_Main">
                <div class="wcs_Labeling_Container_left">
                    
                    <div class="wcs_labeling_useCaseContainer">
                        <div class="wcs_labeling_useCase_title">
                            <div class="wcs_labeling_useCase_title_name">:نوع کاربری</div>
                            <div><div class="wcs_labeling_useCase_title_content">
                                ${label ? useCaseList.find(c=>parseFloat(c.Code) === parseFloat(label.useCase)).Name : ''}
                            </div>
                            </div>
                        </div>
                        <div class="wcs_labeling_useCase_searchBarContainer">
                            <input type="text" class="wcs_labeling_useCaseSearchbar wcs_labeling_searchBar"  placeholder="جست و جو نوع کاربری ..." >
                        </div>
                        <div class="wcs_labeling_useCase_list">
                            <div class="wcs_labeling_useCase_fullList">
                                <ul class="wcs_labeling_useCase_List">
                                    ${useCaseListStr}
                                </ul>
                            </div>
                            <div class="wcs_labeling_useCase_options">
                                <div  saLabelIndex="${34}">آپارتمان</div>
                                <div  saLabelIndex="${121}">داکت</div>
                                <div  saLabelIndex="${28}">مغازه</div>
                                <div  saLabelIndex="${1}">پارکینگ</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="wcs_labeling_directionContainer">
                        <div class="wcs_labeling_useCase_title">
                            <div class="wcs_labeling_useCase_title_name">:سمت</div>
                            <div><div class="wcs_labeling_useCase_title_content">${directionName}</div></div>
                        </div>
                        <div class="wcs_labeling_direction_options">
                                ${directionListStr}
                        </div>
                    </div>
                    
                </div>
                <div class="wcs_Labeling_Container_right">
                <div class="wcs_Labeling_inputItemContainer wcs_Labeling_input_mainLabel" >
                        <div>
                              برچسب 
                        </div>
                        <div>
                            <input ${label? 'style="background-color:#03a9f4;color:white"' : ''} value="${label ? label.text : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer">
                        <div>
                             عبارت دلخواه
                        </div>
                        <div>
                            <input class="wcs_Labeling_input_stringLabel" value="${label ? label.stringLabel : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer">
                        <div>
                             نوع قطعه
                        </div>
                        <div class="wcs_Labeling_TypeSelectorContainer">
                           ${labelSaType(label)}
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer ">
                        <div>
                            شماره قطعه
                        </div>
                        <div>
                            <input class="wcs_Labeling_input_ghate" value="${label ? label.ghate : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer ">
                        <div>
                            پلاک اصلی
                        </div >
                        <div>
                            <input class="wcs_Labeling_input_asli" value="${label ? label.asli : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer">
                        <div>
                            پلاک فرعی
                        </div>
                        <div>
                            <input class="wcs_Labeling_input_fari" value="${label ? label.fari : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer ">
                        <div>
                            کسر کانال کولر
                        </div>
                        <div>
                            <input class="wcs_Labeling_input_cooler" value="${label ? label.coolerChannel : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer">
                        <div>
                            شماره سطح
                        </div>
                        <div>
                            <input class="wcs_Labeling_input_sath" value="${label ? label.sathNumber : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer wcs_Labeling_input_block">
                        <div>
                             بلوک
                        </div>
                        <div>
                            <input class="wcs_Labeling_input_block" value="${label ? label.block : ''}"></input>
                        </div>
                    </div>
                    <div class="wcs_Labeling_inputItemContainer">
                        <div>
                              ترسیم قطعه در سند
                        </div>
                        ${hasDocument(label)}
                    </div>

                </div>
            </div>
            <div class="wcs_labeling_footer">
                <div class="wcs_labeling_GhateRightContainer">
                    <div class="wcs_labeling_GhateRight_title">حقوق ارتفاقی:</div>
                    <div class="wcs_labeling_GhateRight_input">
                        <textarea id="w3review" name="w3review" rows="4" cols="50">این پارکینگ از پارکینگ قطعه 2 حق عبور دارد</textarea>
                    </div>
                    <div class="wcs_labeling_GhateRight_generatorContainer">
                        <div class="wcs_labeling_GhateRight_generator_first">
                            <span>&nbspاین</span>
                            <div>پارکینگ</div>
                            <span>&nbsp</span>
                            <span>&nbspاز</span>
                            <div>پارکینگ</div>
                            <span>&nbsp</span>
                            <span>&nbspقطعه</span>
                            <input value="3"></input>
                            <span>&nbsp</span>
                            <span>.حق عبور دارد</span>
                            <div class="wcs_labeling_GhateRight_generator_first_button"><button>افزودن</button></div>
                        </div>
                        <div class="wcs_labeling_GhateRight_generator_first">
                            <div>پارکینگ</div>
                            <span>&nbsp</span>
                            <span>&nbspقطعه</span>
                            <span>&nbsp</span>
                            <input value="2"></input>
                            <span>&nbsp</span>
                            <span>&nbspاز این</span>
                            <div>پارکینگ</div>
                            <span>&nbsp</span>
                            <span>.حق عبور دارد</span>
                            <div class="wcs_labeling_GhateRight_generator_first_button"><button>افزودن</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
    `
    return htmlStr
}
export const Labeling2 = (siMap) => {
    let str = ''
    if (!siMap.baseLayers) return str
    for (let index = 0; index < siMap.baseLayers.length; index++) {
        const baseLayer = siMap.baseLayers[index];
        let activeColor;
        // console.log(index, siMap.activeBaseLayerIndex)
        if (index === siMap.activeBaseLayerIndex) {
            activeColor = getComputedStyle(document.body).getPropertyValue('--wcs--hover-color')
        } else {
            activeColor = 'none'
        }
        let metadataLink = `http://10.1.47.36:2000/#/dyTab/imageryProjects/imageryProjects.tab/${baseLayer.id}`
        let metadata = baseLayer.id ? `<div layerId="${index}" class="wcs_baseLayer_Items_metadata wcs_panelList_items_icons_container wcs_clickable">
        <a href=${metadataLink} target="_blank" class="wcs_layers_statusIcon">
        <img src="./webCad_Icons/wcs_metadata.svg"/>
        </a></div>` : ''
        str += ` 
                <div class="wcs_layerProperties_Items" style="background:${activeColor}">
                <span class="wcs_LayerItem_tooltip">${baseLayer.name}</span>
                <div  layerId="${index}" class="wcs_layerProperties_Items_title ">
                <label >${baseLayer.name}</label></div>
                ${metadata}
                <div layerId="${index}" class="wcs_baseLayer_Items_add wcs_panelList_items_icons_container wcs_clickable">
                    <a class="wcs_layers_statusIcon">
                        <img  src="./webCad_Icons/wcs_addBaseLayer.svg"/>
                    </a>
                </div>
                <div layerId="${index}" class="wcs_baseLayer_Items_remove wcs_panelList_items_icons_container wcs_clickable">
                    <a class="wcs_layers_statusIcon">
                    <img src="./webCad_Icons/wcs_removeBaseLayer.svg"/>
                    </a>
                </div>
                    
                </div>
        `
    }
    let finalstr = `
        <div class="wcs_layerProperties_list">
            ${str}
        </div>     
    `

    return finalstr
}
const getLineWeight = (siMap) => {
    let str = ''
    let cadMainLineWeigth = [{
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
        let checked = ''
        if (siMap.activeLayer) {
            if (siMap.activeLayer.lineTypeWeigth === item.index) checked = './webCad_icons/wcs_checked_light.svg'
        }
        str += ` <div  elmLineWeigthName="${item.name}"  lineWeigthIndex="${item.index}" class="wcs_panel_objects_lineWeigth_container wcs_clickable">
                    <div><img class="wcs_checked_lineWeigth" src=${checked}></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}
const getLineType = (siMap) => {
    let str = ''
    let cadMainLineType = [{
            name: 'Dashed',
            index: lineTypeType.dashed
        },
        {
            name: 'Countinues',
            index: lineTypeType.countinus
        }
    ]
    cadMainLineType.forEach(item => {
        let checked = ''
        if (siMap.activeLayer) {
            if (siMap.activeLayer.lineTypeIndex === item.index) checked = './webCad_icons/wcs_checked_light.svg'
        }
        var byLayer = ''
            // console.log(checked)
        if (item.name === 'By Layer') { byLayer = 'byLayer' }
        str += ` <div byLayer="${byLayer}" elmLineTypeName="${item.name}"  lineTypeIndex="${item.index}" class="wcs_panel_objects_lineType_container wcs_clickable">
                    <div><img class="wcs_checked_lineType" src=${checked}></div>
                    <div><label>${item.name}</label></div>          
                </div>
                `
    })
    return str
}
const getColors = (siMap) => {
    let str = ''
    let cadMainColor = [{
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
export const labelingEventsHandler = (siMap, baseElement, label) => {
    console.log(label)
    if (!label) {
        siMap.storage.currentSaLabel = {}
    } else {
        label.updateToSiMapStorage()
    }
    baseElement.getElementsByClassName('wcs_labeling_searchBar')[0].addEventListener('keyup', e => {
        // console.log(e)
        var input, filter, ul, li, a, i;
        input = baseElement.getElementsByClassName('wcs_labeling_searchBar')[0]
        filter = input.value.toUpperCase();
        ul = baseElement.getElementsByClassName('wcs_labeling_useCase_List')[0]
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];

            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    })
    let useCaseItems = baseElement.getElementsByClassName('wcs_labeling_useCase_List')[0].getElementsByTagName('a');
    for (let index = 0; index < useCaseItems.length; index++) {
        const element = useCaseItems[index];
        element.addEventListener('click', e => {
            // console.log(e)
            let saLabel = oraUseCodes.A266FF2A662E84b639DA[element.getAttribute('saLabelIndex')]
            siMap.storage.currentSaLabel.useCase = saLabel.Code;
            baseElement.getElementsByClassName('wcs_labeling_mainLabel_command_btn')[0].className = "wcs_labeling_mainLabel_command_btn wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue"
            baseElement.getElementsByClassName('wcs_labeling_useCase_title_content')[0].innerHTML = saLabel.Name
            updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
        }, false)
    }
    let useCaseOptions = baseElement.getElementsByClassName('wcs_labeling_useCase_options')[0].getElementsByTagName('div')
    for (let index = 0; index < useCaseOptions.length; index++) {
        const element = useCaseOptions[index];
        element.addEventListener('click', e => {
            let saLabel = oraUseCodes.A266FF2A662E84b639DA.find(salabel => salabel.Code === element.getAttribute('saLabelIndex'))
            siMap.storage.currentSaLabel.useCase = saLabel.Code;
            baseElement.getElementsByClassName('wcs_labeling_mainLabel_command_btn')[0].className = "wcs_labeling_mainLabel_command_btn wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue"
            baseElement.getElementsByClassName('wcs_labeling_useCase_title_content')[0].innerHTML = saLabel.Name
            updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
        }, false)
    }
    baseElement.getElementsByClassName('wcs_labeling_mainLabel_command_btn')[0].addEventListener('click', e => {
        if (label) {
            label.updateFromSiMapStorage()
        } else {
            // console.log(label)
            // siMap.siCommand.execCommand('escape')
            if (siMap.storage.currentSaLabel.useCase || siMap.storage.currentSaLabel.stringLabel) {
                siMap.siCommand.execCommand('addsingelsalabel')
            }
        }
    }, false)
    baseElement.getElementsByClassName('wcs_labeling_multi')[0].addEventListener('click', e => {
        console.log('multi2')
        siMap.siCommand.execCommand('addmultisalabel')
    }, false)
    baseElement.getElementsByClassName('wcs_labeling_mainLabel_command_btn')[2].addEventListener('click', e => {
        console.log('multi2')
            // siMap.siCommand.execCommand('escape')
        siMap.siCommand.execCommand('addmultisalabelghate')
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_input_stringLabel')[0].addEventListener('keyup', e => {

        siMap.storage.currentSaLabel.stringLabel = e.target.value;
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
        if (e.target.value != '') {
            baseElement.getElementsByClassName('wcs_labeling_mainLabel_command_btn')[0].className = "wcs_labeling_mainLabel_command_btn wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue"
        } else {
            if (!siMap.storage.currentSaLabel.useCase)
                baseElement.getElementsByClassName('wcs_labeling_mainLabel_command_btn')[0].className = 'wcs_labeling_mainLabel_command_btn wcs_actionButton_disable  wcs_bg_btn_disabled'
        }
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_labelType_aparteman_btn')[0].addEventListener('click', e => {
        siMap.storage.currentSaLabel.isAparteman = true;
        baseElement.getElementsByClassName('wcs_Labeling_labelType_aparteman_btn')[0].className = 'wcs_Labeling_TypeSelectorContainer_active wcs_Labeling_labelType_aparteman_btn'
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel);
        for (let index = 0; index < baseElement.getElementsByClassName('wcs_Labeling_labelType_others_btn').length; index++) {
            const element = baseElement.getElementsByClassName('wcs_Labeling_labelType_others_btn')[index];
            element.className = 'wcs_Labeling_TypeSelectorContainer_disable wcs_Labeling_labelType_others_btn'
        }
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_labelType_others_btn')[0].addEventListener('click', e => {
        siMap.storage.currentSaLabel.isAparteman = false;
        baseElement.getElementsByClassName('wcs_Labeling_labelType_others_btn')[0].className = 'wcs_Labeling_TypeSelectorContainer_active wcs_Labeling_labelType_others_btn'
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel);
        for (let index = 0; index < baseElement.getElementsByClassName('wcs_Labeling_labelType_others_btn').length; index++) {
            const element = baseElement.getElementsByClassName('wcs_Labeling_labelType_aparteman_btn')[index];
            element.className = 'wcs_Labeling_TypeSelectorContainer_disable wcs_Labeling_labelType_aparteman_btn'
        }
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_input_ghate')[0].addEventListener('keyup', e => {
        siMap.storage.currentSaLabel.ghate = e.target.value;
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_input_asli')[0].addEventListener('keyup', e => {
        siMap.storage.currentSaLabel.asli = e.target.value;
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_input_fari')[0].addEventListener('keyup', e => {
        siMap.storage.currentSaLabel.fari = e.target.value;
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_input_cooler')[0].addEventListener('keyup', e => {
        siMap.storage.currentSaLabel.coolerChannel = e.target.value;
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_input_sath')[0].addEventListener('keyup', e => {
        siMap.storage.currentSaLabel.sathNumber = e.target.value;
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
    }, false)
    baseElement.getElementsByClassName('wcs_Labeling_input_block')[0].addEventListener('keyup', e => {
        siMap.storage.currentSaLabel.block = e.target.value;
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
    }, false)
    baseElement.getElementsByClassName('wcs_labeling_hasDoc')[0].addEventListener('click', e => {
        siMap.storage.currentSaLabel.hasDocument = true;
        baseElement.getElementsByClassName('wcs_labeling_hasDoc')[0].className = 'wcs_Labeling_TypeSelectorContainer_active wcs_labeling_hasDoc'
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel);
        for (let index = 0; index < baseElement.getElementsByClassName('wcs_labeling_hasNotDoc').length; index++) {
            const element = baseElement.getElementsByClassName('wcs_labeling_hasNotDoc')[index];
            element.className = 'wcs_Labeling_TypeSelectorContainer_disable wcs_labeling_hasNotDoc'
        }
    }, false)
    baseElement.getElementsByClassName('wcs_labeling_hasNotDoc')[0].addEventListener('click', e => {
        siMap.storage.currentSaLabel.hasDocument = false;
        baseElement.getElementsByClassName('wcs_labeling_hasNotDoc')[0].className = 'wcs_Labeling_TypeSelectorContainer_active wcs_labeling_hasNotDoc'
        updateSaLabelText(baseElement, siMap.storage.currentSaLabel);
        for (let index = 0; index < baseElement.getElementsByClassName('wcs_labeling_hasNotDoc').length; index++) {
            const element = baseElement.getElementsByClassName('wcs_labeling_hasDoc')[index];
            element.className = 'wcs_Labeling_TypeSelectorContainer_disable wcs_labeling_hasDoc'
        }
    }, false)
    let samtOption = baseElement.getElementsByClassName('wcs_labeling_direction_options')[0].getElementsByTagName('div')
    for (let index = 0; index < samtOption.length; index++) {
        const element = samtOption[index];
        element.addEventListener('click', e => {
            // console.log(e)
            if (element.className != 'wcs_labeling_direction_options_selected') {
                for (let index = 0; index < samtOption.length; index++) {
                    const element = samtOption[index];
                    element.className = ''
                }

                element.className = 'wcs_labeling_direction_options_selected'
                    // console.log(element.getAttribute('samtKey'))
                siMap.storage.currentSaLabel.samt = samtListType[element.getAttribute('samtKey')].code
                baseElement.getElementsByClassName('wcs_labeling_useCase_title_content')[1].innerHTML = samtListType[element.getAttribute('samtKey')].name
                updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
            } else {
                console.log('s');
                for (let index = 0; index < samtOption.length; index++) {
                    const element = samtOption[index];
                    element.className = ''
                }
            }
        })
    }
}
const updateSaLabelText = (baseElement, obj) => {
    baseElement.getElementsByClassName('wcs_Labeling_input_mainLabel')[0].getElementsByTagName('input')[0].value = createSaLabelingCode(obj).label
    if (baseElement.getElementsByClassName('wcs_Labeling_input_mainLabel')[0].value != '') {

    }
}
export const createSaLabelingCode = (obj) => {
    let A = obj.useCase ? `A${obj.useCase}` : ''
    let G = obj.ghate ? `G${obj.ghate}` : ''
    let F = obj.fari ? `F${obj.fari}` : ''
    let P = obj.asli ? `P${obj.asli}` : ''
    let S = obj.samt ? `S${obj.samt}` : ''
    let V = obj.coolerChannel ? `V${obj.coolerChannel}` : ''
    let K = obj.block ? `K=${obj.block}=` : ''
    let Q = obj.sathNumber ? `Q${obj.sathNumber}` : ''
    let M = obj.rights ? `M=${obj.rights}=` : ''
    let H = obj.hasDocument ? 'H' : ''
    let stringLabel = obj.stringLabel ? obj.stringLabel : ''
    if (stringLabel === '') {
        obj.label = A + G + F + P + S + V + K + Q + M + H
        obj.text = A + G + F + P + S
    } else {
        obj.label = stringLabel
        obj.text = stringLabel
    }
    return obj
}