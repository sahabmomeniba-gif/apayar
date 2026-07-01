import SaLabel from "../../entities/Cadastal/SeperationApratemanLabel"
import { saLineLabelType } from "../../entities/Cadastal/SeperationApratemanLine"
import { lineTypeType, lineWeightType } from "../../entities/Entity"
import SiMap, { getCadColor } from "../../entities/SiMap"
import SiText from "../../entities/SiStaticText"
import { epictype, oraUseCodes, saLineTypeList, samtListType, useCodes } from "../../initparams"
import { getColorFromIndex, getLineTypeNameFromIndex, getLineWeigthNameFromIndex } from "./wcs_sidebar"
export const LineLabeling = (siMap, line) => {

    let useCaseListStr = ''
    let directionListStr = ''
    let directionName = ''
    saLineTypeList.forEach((item, index) => {
        useCaseListStr += `
            <li><a saLineTypeId="${item.id}" saLineTypeId="${item.id}">${item.name}</a></li>
        `
    })
    let labeTypeElmClass = (line) => {
        if (line) {
            console.log(line.labelType)
            if (line.labelType === saLineLabelType.onLine) {
                return `
                        <div labelType="${saLineLabelType.onLine}" class="wcs_lineLabeling_labelType_active wcs_bg_btn_blue wcs_actionButton">روی خط</div>
                        <div labelType="${saLineLabelType.onSide}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">کنار خط</div>
                        <div labelType="${saLineLabelType.noLabel}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">عدم نمایش</div>
                `
            }
            if (line.labelType === saLineLabelType.onSide) {
                return `
                        <div labelType="${saLineLabelType.onLine}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">روی خط</div>
                        <div labelType="${saLineLabelType.onSide}" class="wcs_lineLabeling_labelType_active wcs_bg_btn_blue wcs_actionButton">کنار خط</div>
                        <div labelType="${saLineLabelType.noLabel}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">عدم نمایش</div>
                `
            }
            if (line.labelType === saLineLabelType.noLabel) {
                return `
                        <div labelType="${saLineLabelType.onLine}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">روی خط</div>
                        <div labelType="${saLineLabelType.onSide}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">کنار خط</div>
                        <div labelType="${saLineLabelType.noLabel}" class="wcs_lineLabeling_labelType_active wcs_bg_btn_blue wcs_actionButton">عدم نمایش</div>
                `
            }
        } else {
            return `
                        <div labelType="${saLineLabelType.onLine}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">روی خط</div>
                        <div labelType="${saLineLabelType.onSide}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">کنار خط</div>
                        <div labelType="${saLineLabelType.noLabel}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">عدم نمایش</div>
            `
        }
    }
    let lineIsApartemanElmClass = (line) => {
        if (line) {
            // console.log(line.labelType)
            if (line.isAparteman) {
                return `
                        <div isAparteman="${'true'}" class="wcs_lineLabeling_labelType_active wcs_bg_btn_blue wcs_actionButton">آپارتمان</div>
                        <div isAparteman="${'false'}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">سایر لایه ها</div>
                `
            } else {
                return `
                        <div isAparteman="${'true'}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">آپارتمان</div>
                        <div isAparteman="${'false'}" class="wcs_lineLabeling_labelType_active wcs_bg_btn_blue wcs_actionButton">سایر لایه ها</div>
                `
            }
        } else {
            return `
                        <div isAparteman="${'true'}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">آپارتمان</div>
                        <div isAparteman="${'false'}" class="wcs_lineLabeling_labelType_disable wcs_actionButton">سایر لایه ها</div>
            `
        }
    }
    var htmlStr = ''
    htmlStr += `
        <div class="wcs_labeling_Container">
            <div class="wcs_labeling_mainLabel">
                <div class="wcs_labeling_mainLabel_label">

                </div>
                <div class="wcs_labeling_mainLabel_command">
                    <a class="wcs_labeling_mainLabel_command_btn wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue">ترسیم خط</a>
                </div>
            </div>
            <div class="wcs_labeling_Container_Main">
                <div class="wcs_lineLabeling_Container_content">
                    
                    <div class="wcs_labeling_useCaseContainer">
                        <div class="wcs_labeling_useCase_title">
                            <div class="wcs_labeling_useCase_title_name">:نوع خط</div>
                            <div><div class="wcs_labeling_useCase_title_content">
                                ${line ? line.saLineType.name : ''}
                            </div>
                            </div>
                        </div>
                        <div class="wcs_labeling_useCase_searchBarContainer">
                            <input type="text" class="wcs_labeling_useCaseSearchbar"  placeholder="جست و جو نوع خط ..." >
                        </div>
                        <div class="wcs_labeling_useCase_list">
                            <div class="wcs_labeling_useCase_fullList">
                                <ul class="wcs_labeling_useCase_List">
                                    ${useCaseListStr}
                                </ul>
                            </div>
                            <div class="wcs_lineLabeling_useCase_options">
                                <div saLineTypeId="${saLineTypeList.find(i=>i.name === 'دیواریست').id}">دیواریست</div>
                                <div saLineTypeId="${saLineTypeList.find(i=>i.name === 'درب و دیوار است').id}">درب و دیوار است</div>
                                <div saLineTypeId="${saLineTypeList.find(i=>i.name === 'دیواریست مشترک').id}">دیواریست مشترک</div>
                                <div saLineTypeId="${saLineTypeList.find(i=>i.name === 'خط فرضی است').id}">خط فرضی است</div>
                                <div saLineTypeId="${saLineTypeList.find(i=>i.name === 'دیوار و پنجره است').id}">دیوار و پنجره است</div>
                            </div>
                        </div>
                    </div>               
                </div>
                
            </div>
            <div class="wcs_lineLabeling_footer" style="display:none">
                <div class="wcs_lineLabeling_labelTypeContainer">
                    <div class="wcs_lineLabeling_labelTypeContainer_title">نوع خط</div>
                    <div class="wcs_lineLabeling_lineIsApartemanContainer">
                        ${lineIsApartemanElmClass(line)}
                    </div>
                    
                </div>
            </div>
            <div class="wcs_lineLabeling_footer" style="display:none">
                <div class="wcs_lineLabeling_labelTypeContainer">
                    <div class="wcs_lineLabeling_labelTypeContainer_title">محل قرارگیری برچسب</div>
                    <div class="wcs_lineLabeling_labelTypeContainer_options">
                        ${labeTypeElmClass(line)}
                    </div>
                    
                </div>
            </div>
            </div>
        </div>
       
    `
    return htmlStr
}
export const lineLabelingEventsHandler = (siMap, baseElement, line) => {
    if (!line) {
        siMap.storage.currentSaLineType = {}
    } else {
        line.updateToSiMapStorage()
    }
    baseElement.getElementsByClassName('wcs_labeling_useCaseSearchbar')[0].addEventListener('keyup', e => {
        // console.log(e)
        var input, filter, ul, li, a, i;
        input = baseElement.getElementsByClassName('wcs_labeling_useCaseSearchbar')[0]
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
            let saLineType = saLineTypeList.find(i => i.id === parseFloat(element.getAttribute('saLineTypeId')))
            siMap.storage.currentSaLineType.saLineType = saLineType;
            baseElement.getElementsByClassName('wcs_labeling_useCase_title_content')[0].innerHTML = saLineType.name
            if (line) {
                line.updateFromSiMapStorage()
            }
        }, false)
    }
    let optionsList = baseElement.getElementsByClassName('wcs_lineLabeling_useCase_options')[0].getElementsByTagName('div');
    for (let index = 0; index < optionsList.length; index++) {
        const element = optionsList[index];
        element.addEventListener('click', e => {
            let saLineType = saLineTypeList.find(i => i.id === parseFloat(element.getAttribute('saLineTypeId')))
            siMap.storage.currentSaLineType.saLineType = saLineType;
            baseElement.getElementsByClassName('wcs_labeling_useCase_title_content')[0].innerHTML = saLineType.name
            if (line) {
                line.updateFromSiMapStorage()
            }
        })
    }
    baseElement.getElementsByClassName('wcs_labeling_mainLabel_command')[0].addEventListener('click', e => {
            siMap.siCommand.execCommand('saline')
        }, false)
        // let useCaseOptions = baseElement.getElementsByClassName('wcs_labeling_useCase_options')[0].getElementsByTagName('div')
        // for (let index = 0; index < useCaseOptions.length; index++) {
        //     const element = useCaseOptions[index];
        //     element.addEventListener('click', e => {
        //         let saLabel = oraUseCodes.A266FF2A662E84b639DA.find(salabel => salabel.Code === element.getAttribute('saLabelIndex'))
        //         siMap.storage.currentSaLabel.useCase = saLabel.Code;
        //         baseElement.getElementsByClassName('wcs_labeling_mainLabel_command_btn')[0].className = "wcs_labeling_mainLabel_command_btn wcs_actionButton wcs_shadow_button wcs_animate wcs_bg_btn_blue"
        //         baseElement.getElementsByClassName('wcs_labeling_useCase_title_content')[0].innerHTML = saLabel.Name
        //         updateSaLabelText(baseElement, siMap.storage.currentSaLabel)
        //     }, false)
        // }
    let labelTypeOptionList = baseElement.getElementsByClassName('wcs_lineLabeling_labelTypeContainer_options')[0].getElementsByTagName('div')
    for (let index = 0; index < labelTypeOptionList.length; index++) {
        const element = labelTypeOptionList[index];

        element.addEventListener('click', e => {
            for (let index = 0; index < labelTypeOptionList.length; index++) {
                const element = labelTypeOptionList[index];
                element.className = 'wcs_lineLabeling_labelType_disable wcs_actionButton'
            }
            element.className = 'wcs_lineLabeling_labelType_active wcs_bg_btn_blue wcs_actionButton'
            siMap.storage.currentSaLineType.labelType = element.getAttribute('labelType')
            if (line) {
                line.updateFromSiMapStorage()
            }
        }, false)
    }
    let labelTypeIsApartemanList = baseElement.getElementsByClassName('wcs_lineLabeling_lineIsApartemanContainer')[0].getElementsByTagName('div')
    for (let index = 0; index < labelTypeIsApartemanList.length; index++) {
        const element = labelTypeIsApartemanList[index];

        element.addEventListener('click', e => {
            for (let index = 0; index < labelTypeIsApartemanList.length; index++) {
                const element = labelTypeIsApartemanList[index];
                element.className = 'wcs_lineLabeling_labelType_disable wcs_actionButton'
            }
            element.className = 'wcs_lineLabeling_labelType_active wcs_bg_btn_blue wcs_actionButton'
                // console.log(element.getAttribute('isAparteman'))
            siMap.storage.currentSaLineType.isAparteman = element.getAttribute('isAparteman') === 'true' ? true : false
            if (line) {
                console.log(line)
                line.updateFromSiMapStorage()
            }
        }, false)
    }

}