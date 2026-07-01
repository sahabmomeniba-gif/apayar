import TileSource from "ol/source/Tile";
import { Fill, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import SiPoint from "./SiPoint";
import SiPolyLine from "./SiPolyline";
import Text from 'ol/style/Text'
import Entity, { EntityType, lineTypeType, ModifyType } from "./Entity";
import Point from "ol/geom/Point";
import { Feature } from "ol";
import { toStringHDMS } from "ol/coordinate";
import { epictype, samtListType } from "../initparams";
export class SiPointLabels extends Entity {
    constructor(x, y, options) {
        super(options);
        this.coordinates = [x, y]
            // console.log(this.coordinates)
        let geometry = new Point(this.coordinates)
        this.setGeometry(geometry)
        this.siLayer.addEntity(this);
        this.entityType = EntityType.label
        this.IsCentriod = false
        this.size = options.size ? options.size : 20
        this.font = `${this.size}px Calibri,sans-serif`;
        this.area = options.area
        this.labelRadius = options.labelRadius ? options.labelRadius : 1;

        if (this.area) {
            this.minZoom = 20
            if (this.area > 100000) this.minZoom = 15
            if (this.area > 50000 && this.area < 1000000) this.minZoom = 17
        } else {
            this.minZoom = 20;
        }
        this.visible = false;

        this.text = options.text ? options.text : '';
        this.rotation = options.rotation;
        this.LabelColor = options.color ? options.color : 'rgba(255,255,255,1)'
            // this.setStyle(this.hideStyle)       
            // this.getStyle().setText(this.textStyle)
        this.siLayer.siMap.labelCollection.push(this)
        this.showStyle = undefined;
        this.hideStyle = undefined;
        // this.render()
        // this.siLayer.siMap.dragCollection.push(this)
    }
    getLabelStyle(type) {
        if (type === 'show') return new Style({
            // image:new CircleStyle({
            //     radius:5,
            //     fill: new Fill({
            //         color:'rgba(255,255,255,1)'
            //     }),
            // }),
            text: new Text({
                text: this.text,
                fill: new Fill({
                    color: this.styleProperties.textColor,
                }),

                rotation: this.rotation,
                overflow: true,
                font: this.font,
                // offsetY:20
            })
        })
        if (type === 'hide') return new Style({
            image: new CircleStyle({
                radius: this.labelRadius,
                fill: new Fill({
                    color: this.styleProperties.color
                }),
            })
        })
    }
    setModifyPoint() {
        this.modifyFeature.forEach(feature => {
            this.siLayer.siMap.modify.removeFeature(feature)
        })
        this.modifyFeature = []
        this.coordinates = this.getGeometry().getCoordinates()
        let feature = new Feature({
            geometry: new Point(this.coordinates),
            modifyType: ModifyType.translatePoint,
            targetFeature: this
        })
        feature.setStyle(this.getModifyStyle(ModifyType.endPoint, 0))
        this.modifyFeature.push(feature)
        this.siLayer.siMap.modify.addFeature(feature);
    }
    show() {
        this.visible = true;
    }
    hide() {
        this.visible = false;
    }
    render() {

        if (this.visible) {
            if (!this.showStyle) {
                this.showStyle = this.getLabelStyle('show')
            }
            this.setStyle(this.showStyle)
        }
        if (!this.visible) {
            if (!this.hideStyle) {
                this.hideStyle = this.getLabelStyle('hide')
            }
            this.setStyle(this.hideStyle)
        }
    }
    getLabelProperties() {
        return {
            IsCentriod: this.IsCentriod,
            centriodType: this.centriodType,
            sabtCode: this.sabtCode,
            fari: this.fari,
            bakhsh: this.bakhsh,
            mafroozi: this.mafroozi,
            nahiye: this.nahiye,
            ghate: this.ghate,
            asli: this.asli,
            arz: this.arz,
            tasbit: this.tasbit,
            font: this.font,
            area: this.area,
            size: this.size,
            color: this.LabelColor,
            LabelColor: this.LabelColor,
            rotation: this.rotation,
            text: this.text
        }
    }
}

export const CentriodType = {
    id: 'id',
    name: 'name'
}
export class Centriod extends SiPointLabels {
    constructor(x, y, options) {
        super(x, y, options);
        this.name = 'centriod'
        this.IsCentriod = true;
        this.centriodType = options.centriodType ? options.centriodType : CentriodType.name
        this.sabtCode = options.sabtCode ? options.sabtCode : '';
        this.fari = options.fari ? options.fari : '';
        this.bakhsh = options.bakhsh ? options.bakhsh : '';
        this.mafroozi = options.mafroozi ? options.mafroozi : '';
        this.nahiye = options.nahiye ? options.nahiye : '';
        this.ghate = options.ghate ? options.ghate : '';
        this.asli = options.asli ? options.asli : '';
        this.arz = options.arz ? options.arz : '';
        this.arzEslahi = options.arzEslahi ? options.arzEslahi : '';
        this.tasbit = options.tasbit ? options.tasbit : false;

    }
    createCode() {
        this.createShowStyle()
        let tasbitStr = this.tasbit ? '*' : '';
        if (this.centriodType === CentriodType.id) {
            this.text = `${this.sabtCode}${this.bakhsh}${this.nahiye}${this.asli}F${this.fari}M${this.mafroozi}G${this.ghate}${tasbitStr}`
            this.showStyle.getText().setText(`${this.asli}-${this.fari}`)
                // console.log(this.text)
        } else {
            this.showStyle.getText().setText(this.text)
        }
        this.render()
    }
    reSize() {
        this.createShowStyle()
        this.font = `${this.size}px Calibri,sans-serif`;
        // console.log(this.font)
        this.showStyle.getText().setFont(this.font)
    }
    setAngle() {
        this.createShowStyle()
        this.showStyle.getText().setRotation(this.rotation)
    }
    createShowStyle() {
        if (!this.showStyle) {
            this.showStyle = new Style({
                // image:new CircleStyle({
                //     radius:5,
                //     fill: new Fill({
                //         color:'rgba(255,255,255,1)'
                //     }),
                // }),
                text: new Text({
                    text: this.text,
                    fill: new Fill({
                        color: this.styleProperties.textColor,
                    }),

                    rotation: this.rotation,
                    overflow: true,
                    font: this.font,
                    // offsetY:20
                })

            })
        }
    }
    render() {
        // console.log('render')
        if (this.visible) {
            this.createShowStyle()
            if (this.centriodType === CentriodType.id) {
                this.showStyle.getText().setText(`${this.asli}-${this.fari}`)
            }
            this.setStyle(this.showStyle)
        }
        if (!this.visible) {
            if (!this.hideStyle) {
                this.hideStyle = this.getLabelStyle('hide')
            }
            this.setStyle(this.hideStyle)
        }
    }
}

export class SA_Centriod extends SiPointLabels {
    constructor(x, y, options) {
        super(x, y, options);
        this.name = 'sa_centriod'
            // this.centriodType = options.centriodType ? options.centriodType : CentriodType.name
        this.IsCentriod = false;
        this.areaType = options.areaType ? options.areaType : ''
        this.samt = options.samt ? options.samt : ''
        this.ghate = options.ghate ? options.ghate : ''
        this.asli = options.asli ? options.asli : ''
        this.fari = options.fari ? options.fari : ''
        this.title = options.title ? options.title : ''
        this.rights = options.rights ? options.rights : ''
        this.isAparteman = options.isAparteman != undefined ? options.isAparteman : true;
        this.stringLabel = options.stringLabel ? options.stringLabel : '';
        this.coolerChannel = options.coolerChannel ? options.coolerChannel : 0;
        this.block = options.block ? options.block : '';
        this.sathNumber = options.sathNumber ? options.sathNumber : '';
        this.hasDocument = options.hasDocument != undefined ? options.hasDocument : false;
    }

    createCode() {
        this.createShowStyle()
        if (this.stringLabel === '') {
            this.text = `A${this.areaType.CODE ? this.areaType.CODE : ''}G${this.ghate}S${this.samt ? this.samt.code : ''}${this.hasDocument ? 'H' : ''}`
            this.showStyle.getText().setText(`${this.text}`)
                // console.log(this.text)
        } else {
            this.text = this.stringLabel
            this.showStyle.getText().setText(this.text)
        }
        this.render()
    }
    reSize() {
        this.createShowStyle()
        this.font = `${this.size}px Calibri,sans-serif`;
        // console.log(this.font)
        this.showStyle.getText().setFont(this.font)
    }
    setAngle() {
        this.createShowStyle()
        this.showStyle.getText().setRotation(this.rotation)
    }
    createObjectPropetiesEventsHandler(baseElement) {
        // console.log(baseElement)
        let textElm = baseElement.getElementsByClassName('wcs_panel_saLabel_text')[0]
        baseElement.getElementsByClassName('wcs_object_saLabel_hasDoc')[0].addEventListener('click', e => {
            if (this.hasDocument) {
                this.hasDocument = false;
                baseElement.getElementsByClassName('wcs_object_saLabel_hasDoc')[0].innerHTML = 'ترسیم نشود'
                baseElement.getElementsByClassName('wcs_object_saLabel_hasDoc')[0].style.backgroundColor = 'red'
                this.createCode()
                textElm.innerHTML = this.text
            } else {
                this.hasDocument = true
                baseElement.getElementsByClassName('wcs_object_saLabel_hasDoc')[0].innerHTML = 'ترسیم بشود'
                baseElement.getElementsByClassName('wcs_object_saLabel_hasDoc')[0].style.backgroundColor = 'green'
                this.createCode()
                textElm.innerHTML = this.text
            }
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_stringLabel')[0].addEventListener('change', e => {
            this.stringLabel = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_asli')[0].addEventListener('change', e => {
            this.asli = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_asli')[0].addEventListener('change', e => {
            this.asli = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_fari')[0].addEventListener('change', e => {
            this.fari = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_ghate')[0].addEventListener('change', e => {
            this.ghate = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_cooler')[0].addEventListener('change', e => {
            this.coolerChannel = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_block')[0].addEventListener('change', e => {
            this.block = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_sathNumber')[0].addEventListener('change', e => {
            this.sathNumber = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        baseElement.getElementsByClassName('wcs_object_saLabel_rights')[0].addEventListener('change', e => {
            this.rights = e.target.value
            this.createCode()
            textElm.innerHTML = this.text
        }, false)
        let userTypes = baseElement.getElementsByClassName('wcs_object_saLabel_userType')
        for (let index = 0; index < userTypes.length; index++) {
            const element = userTypes[index];
            element.addEventListener('click', e => {
                this.areaType = epictype["Export Worksheet"][element.getAttribute('userType')]
                    // console.log(this.areaType.TITLE)
                baseElement.getElementsByClassName('wcs_object_saLabel_userTypeLabel')[0].innerHTML = this.areaType.TITLE
                this.createCode()
                textElm.innerHTML = this.text
            }, false)
        }
        let samtElm = baseElement.getElementsByClassName('wcs_object_saLabel_samtSelector')
        for (let index = 0; index < samtElm.length; index++) {
            const element = samtElm[index];
            element.addEventListener('click', e => {
                this.samt = samtListType[element.getAttribute('samtKey')]
                baseElement.getElementsByClassName('wcs_object_saLabel_samtLabel')[0].innerHTML = this.samt.name
                this.createCode()
                textElm.innerHTML = this.text
            }, false)
        }
        baseElement.getElementsByClassName(' wcs_object_saLabel_searchBar')[0].addEventListener('click', e => {

        }, false)

    }

    createObjectPropetiesElement() {
        let str = ''
        str += `
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label >برچسب</label></div>
                    <div><label class="wcs_panel_saLabel_text">${this.text}</label></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>عبارت دلخواه</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_stringLabel" value=${this.stringLabel}></input></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>پلاک اصلی</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_asli" value=${this.asli}></input></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>پلاک فرعی</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_fari" value=${this.fari}></input></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>شماره قطعه</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_ghate" value=${this.ghate}></input></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>کسر کانال کولر</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_cooler" value=${this.coolerChannel}></input></div>
                </div> 
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>بلوک</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_block"
                    pattern ="^[0-9]*$"   
                    oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
                    value=${this.block}></input></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>شماره سطح</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_sathNumber"
                    pattern ="^[0-9]*$"   
                    oninput="javascript:var prevVal = ''; if (this.checkValidity()) prevVal = this.value;else this.value = prevVal;"
                     value=${this.sathNumber}></input></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>ترسیم قطعه در سند</label></div>
                    <div class="wcs_panel_input_container"><button style="background-color:${this.hasDocument ? 'green' : 'red'}"
                     class="wcs_btnCheckBox wcs_object_saLabel_hasDoc">${this.hasDocument ? 'ترسیم بشود' : 'ترسیم نشود'}</button></div>
                </div>
                <div class="wcs_panel_item wcs_object wcs_object_saLabel">
                    <div class="wcs_panel_item_title"><label>حقوق ارتفاقی</label></div>
                    <div class="wcs_panel_input_container"><input  class="wcs_panel_input wcs_object_saLabel_rights" value=${this.ghate}></input></div>
                </div>
                <div class="wcs_panel_item wcs_lineType">
                    <div class="wcs_panel_item_title"><label>نوع کاربری</label></div>
                        <div class="wcs_panel_dropdown wcs_panel_dropdown_lineType" >
                        <div class="wcs_panel_dropdown_btn ">
                            <label class="wcs_object_saLabel_userTypeLabel">${this.areaType.TITLE ? this.areaType.TITLE : ''}</label>
                            <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                        </div>  
                        <div  class="wcs_panel_dropdown_content" style="left: 100%">  
                        <input class="wcs_object_saLabel_searchBar" type="text" id="mySearch" onkeyup="myFunction()" placeholder="جست و جو ..." title="Type in a category">     
                        ${getUserType(this.siLayer.siMap)}   
                        </div>
                    </div>  
                </div>
                <div class="wcs_panel_item wcs_lineType">
                    <div class="wcs_panel_item_title"><label>سمت</label></div>
                    <div class="wcs_panel_dropdown wcs_panel_dropdown_lineType" >
                    <div class="wcs_panel_dropdown_btn">
                        <label class="wcs_object_saLabel_samtLabel">${this.samt ? this.samt.name : ''}</label>
                        <a><img src="./webCad_Icons/arrow-bottom-light.svg"></a>
                    </div>  
                    <div  class="wcs_panel_dropdown_content" style="left: 100%;">          
                    ${getSamt(this.siLayer.siMap)}  
                    </div>
                </div> 
                
            `
        return str
    }
    createShowStyle() {
        if (!this.showStyle) {
            this.showStyle = new Style({
                // image:new CircleStyle({
                //     radius:5,
                //     fill: new Fill({
                //         color:'rgba(255,255,255,1)'
                //     }),
                // }),
                text: new Text({
                    text: this.text,
                    fill: new Fill({
                        color: this.styleProperties.textColor,
                    }),

                    rotation: this.rotation,
                    overflow: true,
                    font: this.font,
                    // offsetY:20
                })

            })
        }
    }
    render() {
        // console.log('render')
        if (this.visible) {
            this.createShowStyle()
            if (this.centriodType === CentriodType.id) {
                this.showStyle.getText().setText(`${this.asli}-${this.fari}`)
            }
            this.setStyle(this.showStyle)
        }
        if (!this.visible) {
            if (!this.hideStyle) {
                this.hideStyle = this.getLabelStyle('hide')
            }
            this.setStyle(this.hideStyle)
        }
    }
}
const getSamt = (siMap) => {
    let str = ''
    let data = samtListType
    for (const key in data) {
        str += ` <div   class="wcs_object_saLabel_samt wcs_clickable">
                    <div samtKey="${key}"  class="wcs_object_saLabel_samtSelector"><label>${data[key].name}</label></div>          
                </div>
                `
    }
    return str
}
const getUserType = (siMap) => {
    let str = ''
    let data = epictype["Export Worksheet"]
    data.forEach((item, index) => {
        str += `
                 <div userType="${index}"  class="wcs_object_saLabel_userType wcs_clickable">
                    <div><label>${item.TITLE}</label></div>          
                </div>
                `
    })
    return str
}