import 'ol/ol.css';
import { Control } from 'ol/control';
import { wcs_sideBarTemplate } from '../Template';
import { wcs_sideBar_styleHandler } from './styleHandler'
import { wcs_commandsPallet_styleHandler } from '../commands_pallet/styleHandler';
import { EntityType, lineTypeType, lineWeightType, styleStatus } from '../../entities/Entity';
import LineString from 'ol/geom/LineString';
import Circle from "ol/geom/Circle";
import { wcs_sideBarContentsType } from '../../entities/SiMap';
import { getLayerList } from './Layer_Properties';
import SiLayer from '../../entities/SiLayer';
import { CentriodType } from '../../entities/Labels';
import { getOuthoPhotoList } from './BaseImage_Properties';
import { Create_Object_Properties, Object_Properties } from './Object_Properties';
import { labelingEventsHandler } from './Labeling';
import { lineLabelingEventsHandler } from './LineLabeling';

class wcs_sidebar {
    constructor(siMap, element) {
        this.element = element
            // console.log(this.element)
        this.name = 'wcs_sidebar'
        this.siMap = siMap
        this.element.innerHTML = wcs_sideBar_styleHandler(this.siMap)
        this.init()
        this.handleEvents()
        this.handleSelect()
        this.selectedObjects = []
        this.selectedObjectsType = "all"
        this.panelOpen = true;
        // this.reShape()
    }
    init() {
        this.mainContent = this.element.getElementsByClassName('wcs_panel_content')[0]
        this.navBarContent = this.element.getElementsByClassName('wcs_navbar_content')[0];
        this.navbar = this.element.getElementsByClassName('wcs_navbar')[0];
        this.sideBarIcons = this.element.getElementsByClassName('wcs_navbar_icon');
        this.panel = this.element.getElementsByClassName('wcs_panel')[0];
        this.panelCloser = this.element.getElementsByClassName('wcs_closer_container')[0].getElementsByTagName('a')[0]
        this.panelDropDownElements = this.element.getElementsByClassName('wcs_panel_dropdown')
        this.objectsList = this.element.getElementsByClassName('wcs_panel_objectsList')[0]
        this.panelTitle = this.element.getElementsByClassName('wcs_panel_title')[0]
        this.panelLineType = this.element.getElementsByClassName('wcs_lineType')[0]
        this.panelLineWeight = this.element.getElementsByClassName('wcs_lineWeight')[0]
        this.colorSelector = this.element.getElementsByClassName('wcs_panel_objects_color_container')
        this.panelLayer = this.element.getElementsByClassName('wcs_panel_dropdown_layer')[0]
        this.panelLineTypeSelector = this.element.getElementsByClassName('wcs_panel_objects_lineType_container')
        this.panelLineTypeChecked = this.element.getElementsByClassName('wcs_checked_lineType')
        this.panelLineWeigthSelector = this.element.getElementsByClassName('wcs_panel_objects_lineWeigth_container')
        this.panelLineWeigthChecked = this.element.getElementsByClassName('wcs_checked_lineWeigth')
        this.panelLineLength = this.element.getElementsByClassName("wcs_panel_line_length")
        this.panelLineCoordinates = this.element.getElementsByClassName("wcs_panel_line_coordinate")
        this.panelCircleGeometry = this.element.getElementsByClassName("wcs_panel_circle_geometry")
            // layers 
        this.layersListContainer = this.element.getElementsByClassName("wcs_layerProperties_Container")[0]
        this.layersitemContainer = this.element.getElementsByClassName('wcs_layerProperties_Items')
        this.layersListColorSelector = this.element.getElementsByClassName("wcs_layerProperties_Items_color")
        this.layersVisibility = this.element.getElementsByClassName("wcs_layerProperties_Items_visiblity")
        this.layersFreeze = this.element.getElementsByClassName("wcs_layerProperties_Items_freeze")
        this.layersSnap = this.element.getElementsByClassName("wcs_layerProperties_Items_snap")
        this.layersSelector = this.element.getElementsByClassName("wcs_layerProperties_Items_title")
        this.layersColor = this.element.getElementsByClassName("wcs_layer_dropdown_color")[0]
        this.layersTitle = this.element.getElementsByClassName("wcs_layer_title")
        this.addLayer = this.element.getElementsByClassName('wcs_addLayer_container')[0]
        this.commandsPallet = this.element.parentElement.getElementsByClassName('wcs_commandsPallet_container')[0]
        this.wcsInputs = this.element.getElementsByClassName('wcs_panel_input')
        this.objectsLayer = this.element.getElementsByClassName('wcs_objectLayers')[0]
        this.objectsColors = this.element.getElementsByClassName('wcs_objectColors')[0]

        //labels
        this.labelCms = this.element.getElementsByClassName('wcs_object_label_cms')[0];
        this.labelBakhsh = this.element.getElementsByClassName('wcs_object_label_bakhsh')[0];
        this.labelNahiye = this.element.getElementsByClassName('wcs_object_label_nahiye')[0];
        this.labelAsli = this.element.getElementsByClassName('wcs_object_label_asli')[0];
        this.labelFari = this.element.getElementsByClassName('wcs_object_label_fari')[0];
        this.labelGhate = this.element.getElementsByClassName('wcs_object_label_ghate')[0];
        this.labelMafroozi = this.element.getElementsByClassName('wcs_object_label_mafroozi')[0];
        this.labelMabarName = this.element.getElementsByClassName('wcs_object_label_mabar')[0];
        this.labelMabarArz = this.element.getElementsByClassName('wcs_object_label_mabarArz')[0];

        //images
        this.imagesListContainer = this.element.getElementsByClassName("wcs_imagesProperties_Container")[0]
        this.addBaseLayer = this.element.getElementsByClassName("wcs_baseLayer_Items_add")
        this.removeBaseLayer = this.element.getElementsByClassName("wcs_baseLayer_Items_remove")
        this.metadataBaseLayer = this.element.getElementsByClassName("wcs_baseLayer_Items_metadata")
    }
    handleEvents() {
        // console.log(this.sideBarIcons)
        // console.log('handle event')
        if (this.frontLineLabelElm) {
            this.frontLineLabelElm.addEventListener('change', e => {
                this.selectedObjects[0].setFrontLabelString(e.target.value)
            }, false)
        }
        if (this.backLineLabelElm) {
            this.backLineLabelElm.addEventListener('change', e => {
                this.selectedObjects[0].setBackLabelString(e.target.value)
            }, false)
        }
        for (let index = 0; index < this.addBaseLayer.length; index++) {
            const element = this.addBaseLayer[index];
            element.addEventListener('click', e => {
                let index = element.getAttribute('layerId')
                this.siMap.activeBaseLayerIndex = parseFloat(index);
                this.siMap.setBaseLayer(this.siMap.baseLayers[index].source)
                this.reShape()

            })
        }
        for (let index = 0; index < this.addBaseLayer.length; index++) {
            const element = this.addBaseLayer[index];
            element.addEventListener('click', e => {
                let index = element.getAttribute('layerId')
                this.siMap.activeBaseLayerIndex = parseFloat(index);
                this.siMap.setBaseLayer(this.siMap.baseLayers[index].source)
                this.reShape()

            })
        }
        for (let index = 0; index < this.removeBaseLayer.length; index++) {
            const element = this.removeBaseLayer[index];
            element.addEventListener('click', e => {
                this.siMap.activeBaseLayerIndex = undefined;
                this.siMap.removeBaseLayer()
                this.reShape()
            })
        }
        for (let index = 0; index < this.metadataBaseLayer.length; index++) {
            const element = this.metadataBaseLayer[index];
            element.addEventListener('click', e => {

                this.reShape()
            })
        }
        if (this.labelMabarArzEslahi) {
            this.labelMabarArzEslahi.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].arzEslahi = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelMabarArz) {
            this.labelMabarArz.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].arz = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelMabarName) {
            this.labelMabarName.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].text = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelCms) {
            this.labelCms.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].sabtCode = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelBakhsh) {
            this.labelBakhsh.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].bakhsh = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelNahiye) {
            this.labelNahiye.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].nahiye = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelAsli) {
            this.labelAsli.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].asli = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelFari) {
            this.labelFari.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].fari = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelGhate) {
            this.labelGhate.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].ghate = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        if (this.labelMafroozi) {
            this.labelMafroozi.addEventListener('change', e => {
                if (e.target.value === '' || e.target.value === undefined || e.target.value === null) return
                this.selectedObjects[0].mafroozi = e.target.value
                this.selectedObjects[0].createCode()
            }, false)
        }
        // this.panel.addEventListener('pointermove', e => {
        //     if (this.panelOpen) {
        //         this.siMap.mapBlur();
        //         this.siMap.siCommand.deActive()
        //     }
        // })
        for (let index = 0; index < this.wcsInputs.length; index++) {
            const element = this.wcsInputs[index];
            element.addEventListener('focus', e => {
                this.siMap.siCommand.deActive()
                this.siMap.mapBlur()
            }, false)
        }
        if (this.sideBarIcons) {
            for (let index = 0; index < this.sideBarIcons.length; index++) {
                let element = this.sideBarIcons[index].parentElement;
                // console.log(element)
                element.addEventListener('click', e => {
                    this.siMap.setWcsSideBarContent(element.getAttribute('contentName'))
                    this.reShape()
                        // switch (this.siMap.appStyle.activeSideBarContent.name) {
                        //     case wcs_sideBarContentsType.labeling:
                        //         this.siMap.container.getElementsByClassName("wcs_app_sidebar")[0].style.width = '498px'
                        //         break;
                        //     default:
                        //         this.siMap.container.getElementsByClassName("wcs_app_sidebar")[0].style.width = '358px'
                        //         break;
                        // }

                })
            }
        }
        for (let index = 0; index < this.layersVisibility.length; index++) {
            // console.log(this.layersVisibility)
            const element = this.layersVisibility[index];
            element.addEventListener('click', e => {
                // console.log(e)
                let siLayer = this.siMap.layers.find(l => l.id === element.getAttribute('layerId'))
                    // console.log(siLayer)
                if (siLayer) {
                    if (siLayer.visible) {
                        siLayer.hide()
                        element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_layer_hidden.svg"
                    } else {
                        siLayer.show()
                        element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_layer_visible.svg"
                    }
                    this.reShape()
                }
            })
        }
        for (let index = 0; index < this.layersFreeze.length; index++) {
            // console.log(this.layersVisibility)
            const element = this.layersFreeze[index];
            element.addEventListener('click', e => {
                // console.log(e)
                let siLayer = this.siMap.layers.find(l => l.id === element.getAttribute('layerId'))
                    // console.log(siLayer)
                if (siLayer) {
                    if (siLayer.frozen) {
                        siLayer.unFreeze()
                        element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_layer_unfreeze.svg"
                    } else {
                        siLayer.freeze()
                        element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_layer_freeze.svg"
                    }
                }
                this.reShape()
            })
        }
        for (let index = 0; index < this.layersSnap.length; index++) {
            // console.log(this.layersVisibility)
            const element = this.layersSnap[index];
            element.addEventListener('click', e => {
                // console.log(e)
                let siLayer = this.siMap.layers.find(l => l.id === element.getAttribute('layerId'))
                    // console.log(siLayer)
                if (siLayer) {
                    if (!siLayer.shouldNotSnap) {
                        siLayer.removeSnaps()
                        element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_layer_snapoff.svg"
                    } else {
                        siLayer.addSnaps()
                        element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_layer_snapon.svg"
                    }
                }
                this.reShape()
            })
        }
        // console.log(this.panelCloser)
        this.panelCloser.addEventListener('click', e => {
            // console.log(e)
            // console.log(this.element.getElementsByClassName('wcs_sidebar_container')[0])

            this.element.parentElement.className = 'wcs_app_sidebar_close'
            this.panelOpen = false;
            this.panel.className = 'wcs_panel_close'
            this.siMap.map.getControls().forEach(control => {
                if (control.name === 'commandsPallet') this.commandsPallet = control.element
            })
            this.wcs_modal = this.siMap.getSiControl('wcs_modal')
                // console.log(this.wcs_modal)
                // if (this.wcs_modal) this.wcs_modal.element.className = "wcs_modal_container_close"
            this.commandsPallet.className = "wcs_commandsPallet_container_close"
                // this.navbar.style.background = getComputedStyle(document.body).getPropertyValue('--wcs--primary-color')
            for (let index = 0; index < this.sideBarIcons.length; index++) {
                let element = this.sideBarIcons[index].parentElement
                    // console.log(element)
                element.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--wcs--secoundray-color')
            }
            // console.log(this.siMap.cadTarget)
            this.siMap.map.updateSize()
        })
        for (let index = 0; index < this.panelDropDownElements.length; index++) {
            // console.log(index)
            let element = this.panelDropDownElements[index];
            let icon = element.getElementsByTagName('div')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0]
                // if(!icon) return
                // console.log(element.getElementsByClassName('wcs_panel_dropdown_content'))
            element.addEventListener('click', e => {
                    this.closeAllDropDowns(element)
                    let closeElm = element.getElementsByClassName('wcs_panel_dropdown_content')[0]
                    let openElm = element.getElementsByClassName("wcs_panel_dropdown_content_open")[0]
                    if (openElm) {
                        openElm.className = "wcs_panel_dropdown_content"
                        icon.src = "./webCad_Icons/arrow-bottom-light.svg"
                        return
                    }
                    if (closeElm) {
                        closeElm.className = "wcs_panel_dropdown_content_open"
                        icon.src = "./webCad_Icons/arrow-top-light.svg"
                    }
                }, false)
                /// update object list 
            if (this.objectsList) {
                this.objectsList.addEventListener('click', e => {
                    this.setObjectPropertiesPanel()
                })
            }
            for (let index = 0; index < this.panelLineCoordinates.length; index++) {
                const element = this.panelLineCoordinates[index];
                element.addEventListener('change', e => {
                    let line = this.selectedObjects[0]
                    if (line) {
                        line.modifyStart()
                        line.setGeometry(new LineString([
                            [parseFloat(this.panelLineCoordinates[0].value), parseFloat(this.panelLineCoordinates[1].value)],
                            [parseFloat(this.panelLineCoordinates[2].value), parseFloat(this.panelLineCoordinates[3].value)]
                        ]))
                        line.modifyEnd()
                        line.setModifyPoint()
                        this.element.getElementsByClassName('wcs_panel_line_length')[0].innerHTML =
                            `${Math.round(line.getLength()*1000)/1000} m`;
                        this.element.getElementsByClassName('wcs_panel_line_Angle')[0].innerHTML =
                            `${line.getAngle()} deg`;
                    }
                }, false)

            }
        }
        for (let index = 0; index < this.colorSelector.length; index++) {

            let element = this.colorSelector[index];
            element.addEventListener('click', e => {
                if (this.siMap.appStyle.activeSideBarContent.name === wcs_sideBarContentsType.objectProperties) {
                    let byLayer = element.getAttribute('byLayer')
                    if (byLayer === 'byLayer') {
                        this.selectedObjects.forEach(entity => {
                            if (this.selectedObjectsType === "all" || this.selectedObjectsType === entity.entityType || (this.selectedObjectsType === EntityType.polyline && entity.entityType === EntityType.line)) {
                                entity.styleStatus.color = styleStatus.byLayer
                                entity.changeColor(entity.siLayer.styleProperties.color)
                                this.setColorStyle(entity, true)
                            }
                        })
                    } else {
                        this.selectedObjects.forEach(entity => {
                            // console.log(this.selectedObjectsType)
                            if (this.selectedObjectsType === "all" || this.selectedObjectsType === entity.entityType || (this.selectedObjectsType === EntityType.polyline && entity.entityType === EntityType.line)) {
                                entity.styleStatus.color = styleStatus.byEntity
                                entity.changeColor(element.getAttribute('elmColor'))
                                entity.colorIndex = parseFloat(element.getAttribute('colorIndex'))
                                this.setColorStyle(entity, true)
                            }
                        })
                    }
                }
                if (this.siMap.appStyle.activeSideBarContent.name === wcs_sideBarContentsType.layerProperties) {
                    // console.log('yes')
                    this.siMap.activeLayer.changeColor(element.getAttribute('elmColor'))
                    this.siMap.activeLayer.colorIndex = parseFloat(element.getAttribute('colorIndex'))
                    this.reShape()
                        // console.log()
                }
                if (this.siMap.appStyle.activeSideBarContent.name === wcs_sideBarContentsType.labeling) {
                    console.log('labeling')
                    console.log(this.siMap.appStyle)
                    this.siMap.appStyle.panel.style.width = '500px'
                }
                // this.handleSelect()
            }, false)
        }
        if (this.panelLayer) {
            this.panelLayer.addEventListener('click', e => {
                let str = ''
                this.siMap.layers.forEach(siLayer => {
                    str += `<div class="wcs_clickable wcs_panel_objects_layer_container">
                  <div class="wcs_object_layer_selector" layerName="${siLayer.name}">${siLayer.title}</div>     
              </div>`
                })
                if (this.panelLayer.getElementsByClassName('wcs_panel_dropdown_content_open')[0]) {
                    this.panelLayer.getElementsByClassName('wcs_panel_dropdown_content_open')[0].innerHTML = str
                }
                let layerSelector = this.element.getElementsByClassName('wcs_object_layer_selector')
                for (let index = 0; index < layerSelector.length; index++) {
                    const layerSelectorElm = layerSelector[index];
                    layerSelectorElm.addEventListener('click', e => {
                        this.selectedObjects.forEach(entity => {
                            entity.changeLayer(layerSelectorElm.getAttribute('layerName'))
                        })
                        this.panelLayer.getElementsByTagName('label')[0].innerHTML = layerSelectorElm.getAttribute('layerName')
                    }, false)
                }
            }, false)
        }
        // console.log(this.panelLineTypeSelector)
        for (let index = 0; index < this.panelLineTypeSelector.length; index++) {
            let element = this.panelLineTypeSelector[index];
            element.addEventListener('click', e => {
                for (let index = 0; index < this.panelLineTypeChecked.length; index++) {
                    const icon = this.panelLineTypeChecked[index];
                    icon.src = ''
                }
                this.panelLineType.getElementsByTagName('label')[1].innerHTML = element.getAttribute('elmlinetypename')
                if (this.siMap.appStyle.activeSideBarContent.name === wcs_sideBarContentsType.objectProperties) {
                    this.selectedObjects.forEach(entity => {
                        if (this.selectedObjectsType === "all" || this.selectedObjectsType === entity.entityType || (this.selectedObjectsType === EntityType.polyline && entity.entityType === EntityType.line)) {
                            entity.changeLineType(element.getAttribute('lineTypeIndex'))
                        }
                    })
                    element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_checked_light.svg"
                }
                if (this.siMap.appStyle.activeSideBarContent.name === wcs_sideBarContentsType.layerProperties) {
                    this.siMap.activeLayer.changeLineType(element.getAttribute('lineTypeIndex'))
                    this.reShape()
                }
                // console.log(element.getAttribute('elmlinetypename'))
            }, false)
        }
        for (let index = 0; index < this.panelLineWeigthSelector.length; index++) {
            let element = this.panelLineWeigthSelector[index];
            element.addEventListener('click', e => {
                for (let index = 0; index < this.panelLineWeigthChecked.length; index++) {
                    const icon = this.panelLineWeigthChecked[index];
                    icon.src = ''
                }
                this.panelLineWeight.getElementsByTagName('label')[1].innerHTML = element.getAttribute('elmLineWeigthName')
                if (this.siMap.appStyle.activeSideBarContent.name === wcs_sideBarContentsType.objectProperties) {
                    this.selectedObjects.forEach(entity => {
                        if (this.selectedObjectsType === "all" || this.selectedObjectsType === entity.entityType || (this.selectedObjectsType === EntityType.polyline && entity.entityType === EntityType.line)) {
                            entity.changeLineWidth(element.getAttribute('lineWeigthIndex'))
                        }
                    })
                    element.getElementsByTagName('img')[0].src = "./webCad_Icons/wcs_checked_light.svg"
                }
                if (this.siMap.appStyle.activeSideBarContent.name === wcs_sideBarContentsType.layerProperties) {
                    this.siMap.activeLayer.changeLineWidth(element.getAttribute('lineWeigthIndex'))
                    this.reShape()
                }
                // console.log(element.getAttribute('elmlinetypename'))
            }, false)
        }
        for (let index = 0; index < this.panelCircleGeometry.length; index++) {
            const element = this.panelCircleGeometry[index];
            element.addEventListener('change', e => {
                let circle = this.selectedObjects[0];
                circle.modifyStart()
                circle.setGeometry(new Circle([parseFloat(this.element.getElementsByClassName('wcs_panel_circle_x')[0].value),
                        parseFloat(this.element.getElementsByClassName('wcs_panel_circle_y')[0].value)
                    ],
                    parseFloat(this.element.getElementsByClassName('wcs_panel_circle_radius')[0].value)
                ))
                circle.modifyEnd()
                circle.setModifyPoint()
                this.element.getElementsByClassName('wcs_panel_circle_area')[0].innerHTML = `${Math.round(circle.getArea()*1000000)/1000000} m2`;
            }, false)
        }
        //layers
        for (let index = 0; index < this.layersSelector.length; index++) {
            // console.log(this.layersVisibility)
            const element = this.layersSelector[index];
            element.addEventListener('click', e => {
                let siLayer = this.siMap.layers.find(l => l.id === element.getAttribute('layerId'))
                if (siLayer) this.siMap.activeLayer = siLayer
                for (let index = 0; index < this.layersitemContainer.length; index++) {
                    const element = this.layersitemContainer[index];
                    element.style.background = 'none'
                }
                // element.parentElement.style.background = getComputedStyle(document.body).getPropertyValue('--wcs--hover-color')
                this.reShape()
            })
        }
        for (let index = 0; index < this.layersTitle.length; index++) {
            const element = this.layersTitle[index];
            element.addEventListener('change', e => {
                let hit = false;
                this.siMap.layers.forEach(layer => {
                    console.log(layer.name)
                    if (layer.name == e.target.value) hit = true
                    if (layer.title == e.target.value) hit = true
                })
                if (!hit) {
                    this.siMap.activeLayer.title = e.target.value;
                    this.reShape()
                }
            }, false)
        }
        if (this.addLayer) {
            this.addLayer.addEventListener('click', e => {
                let count = this.siMap.layers.length;
                // console.log(e)
                var a = new SiLayer({
                        siMap: this.siMap,
                        name: `${count}`,
                        shouldMapExtentToThis: false,
                    })
                    // console.log(a)
                this.reShape()
            })
        }
        for (let index = 0; index < this.layersSelector.length; index++) {
            const element = this.layersSelector[index];
            element.addEventListener('mousemove', e => {
                // console.log(element.getElementsByTagName('label')[0].clientWidth)
                if (element.getElementsByTagName('label')[0].clientWidth > 140) {
                    element.parentElement.getElementsByTagName('span')[0].style.display = 'block'
                } else {
                    element.parentElement.getElementsByTagName('span')[0].style.display = 'none'
                }
            }, false)
        }
        // console.log(this.layersVisibility)

    }
    closeAllDropDowns(targetedElement) {
        for (let index = 0; index < this.panelDropDownElements.length; index++) {
            var allElm = this.panelDropDownElements[index];
            // console.log(allElm)
            if (targetedElement != allElm) {
                var allIcon = allElm.getElementsByTagName('div')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0]
                let allOpenElm = allElm.getElementsByClassName("wcs_panel_dropdown_content_open")[0]
                if (allOpenElm) allOpenElm.className = "wcs_panel_dropdown_content"
                allIcon.src = "./webCad_Icons/arrow-bottom-light.svg"
            }
        }
    }
    setObjectPropertiesPanel() {
        // console.log(this.objectsList)
        let objects = this.siMap.seprateSelectionSetByType()
        let all = 0;
        let str = ``
        if (objects.line.length > 0) {
            str += `<a class="wcs_clickable wcs_panel_objectType" objectType="${EntityType.line}">Line (${objects.line.length})</a>`
            all += objects.line.length
        }
        if (objects.pline.length > 0) {
            str += `<a class="wcs_clickable wcs_panel_objectType" objectType="${EntityType.polyline}">Pline (${objects.pline.length})</a>`
            all += objects.pline.length
        }
        if (objects.polygon.length > 0) {
            str += `<a class="wcs_clickable wcs_panel_objectType" objectType="${EntityType.polygon}">Polygon (${objects.polygon.length})</a>`
            all += objects.line.length
        }
        if (objects.circle.length > 0) {
            str += `<a class="wcs_clickable wcs_panel_objectType" objectType="${EntityType.circle}">Circle (${objects.circle.length})</a>`
            all += objects.circle.length
        }
        if (objects.text.length > 0) {
            str += `<a class="wcs_clickable wcs_panel_objectType" objectType="${EntityType.text}">Text (${objects.text.length})</a>`
            all += objects.line.length
        }
        if (objects.node.length > 0) {
            str += `<a class="wcs_clickable wcs_panel_objectType" objectType="${EntityType.node}">Point (${objects.node.length})</a>`
            all += objects.node.length
        }
        str += `<a class="wcs_clickable wcs_panel_objectType" objectType="all">All (${all})</a>`
            // console.log(this.objectsList.getElementsByClassName('wcs_panel_dropdown_content'))
        let content = this.objectsList.getElementsByClassName('wcs_panel_dropdown_content_open')
        if (content[0]) {
            content[0].innerHTML = str
            let objectTypeSelector = content[0].getElementsByTagName('a')
            for (let index = 0; index < objectTypeSelector.length; index++) {
                var element = objectTypeSelector[index];
                element.addEventListener('click', e => {
                    this.selectedObjectsType = e.target.getAttribute('objectType')
                }, false)
            }
        }
    }
    setColorStyle(entity, display = true) {
        for (let index = 0; index < this.colorSelector.length; index++) {
            var element = this.colorSelector[index];
            element.getElementsByTagName('div')[0].firstChild.src = ''
            if (!entity) {
                this.element.getElementsByClassName('wcs_panel_colorSelector_div')[0].style.background = 'none'
                this.element.getElementsByClassName('wcs_panel_colorSelector_label')[0].innerHTML = ``
            } else {
                if (!display) {
                    element.style.display = 'none'
                        // return
                } else {
                    element.style.display = 'flex'
                }
                var byLayer = element.getAttribute('byLayer')
                if (byLayer === 'byLayer') {
                    element.getElementsByTagName('div')[1].style.background = `${entity.siLayer.styleProperties.color}`
                    element.setAttribute('colorIndex', entity.siLayer.colorIndex)
                    if (entity.styleStatus.color === styleStatus.byLayer) {
                        element.getElementsByTagName('div')[0].firstChild.src = './webCad_Icons/wcs_checked_light.svg'
                    }
                }
                if (entity.styleStatus.color === styleStatus.byLayer) {
                    this.element.getElementsByClassName('wcs_panel_colorSelector_div')[0].style.background = `${entity.siLayer.styleProperties.color}`
                    this.element.getElementsByClassName('wcs_panel_colorSelector_label')[0].innerHTML = `By Layer`
                } else {
                    if (element.getAttribute('colorIndex') === `${entity.colorIndex}`) {
                        element.getElementsByTagName('div')[0].firstChild.src = './webCad_Icons/wcs_checked_light.svg'
                        this.element.getElementsByClassName('wcs_panel_colorSelector_div')[0].style.background = element.getAttribute('elmColor')
                        this.element.getElementsByClassName('wcs_panel_colorSelector_label')[0].innerHTML = element.getAttribute('elmColorName')
                    }
                }
            }

        }
    }
    handleSelect() {
        // console.log('first')
        if (this.siMap.appStyle.activeSideBarContent.name != wcs_sideBarContentsType.objectProperties) return
        this.closeAllDropDowns()
        this.mainContent.innerHTML = Object_Properties(this.siMap)
            // this.handleEvents()
        this.init()
        this.handleEvents()
            // this.setObjectPropertiesPanel()
        this.panelLineType.style.display = 'flex'
        this.panelLineWeight.style.display = 'flex'
        this.objectsLayer.style.display = 'flex'
        this.objectsColors.style.display = 'flex'
        let objects = this.siMap.siSelect.getAllSelectionSet();
        this.selectedObjects = objects.getArray()
        let len = objects.getLength()
        var elements = this.element.getElementsByClassName('wcs_object')
        for (let index = 0; index < elements.length; index++) {
            var element = elements[index];
            element.style.display = 'none'
        }
        // console.log(len)
        switch (len) {
            case 0:
                this.setColorStyle(objects.getArray()[0], false)
                this.objectsList.parentElement.style.display = 'none'
                this.panelTitle.firstElementChild.innerHTML = 'Objects Properties'
                    // console.log(this.panelLayer)
                this.panelLayer.getElementsByTagName('label')[0].innerHTML = ''
                this.panelLineType.getElementsByTagName('label')[1].innerHTML = ''
                this.panelLineWeight.getElementsByTagName('label')[1].innerHTML = ''
                break;
            case 1:
                this.objectsList.parentElement.style.display = 'none'
                this.setColorStyle(objects.getArray()[0], true)
                this.panelLayer.getElementsByTagName('label')[0].innerHTML = `${objects.getArray()[0].siLayer.title}`
                this.setLineType(objects.getArray()[0])
                this.setLineWeigth(objects.getArray()[0])
                this.setGeometryStyle(objects.getArray()[0])
                    // this.panelLineType.getElementsByTagName('label')[1].innerHTML = `${objects.getArray()[0].lineTypeIndex}`
                if (objects.getArray()[0].createObjectPropetiesElement && objects.getArray()[0].createObjectPropetiesEventsHandler) {
                    this.mainContent.innerHTML = Create_Object_Properties(this.siMap, objects.getArray()[0], this.mainContent)
                        // console.log(this.mainContent)
                    objects.getArray()[0].createObjectPropetiesEventsHandler(this.mainContent)
                    this.handleEvents()
                    break;
                } else {
                    switch (objects.getArray()[0].entityType) {
                        case EntityType.circle:
                            this.panelTitle.firstElementChild.innerHTML = 'Circle Properties'
                            var elements = this.element.getElementsByClassName('wcs_object_center')
                            for (let index = 0; index < elements.length; index++) {
                                var element = elements[index];
                                element.style.display = 'flex'
                            }
                            break;
                        case EntityType.line:
                            if (objects.getArray()[0].getGeometry().getCoordinates().length === 2) {
                                var elements = this.element.getElementsByClassName('wcs_object_line')
                                for (let index = 0; index < elements.length; index++) {
                                    var element = elements[index];
                                    element.style.display = 'flex'
                                }

                                this.panelTitle.firstElementChild.innerHTML = 'Line Properties'
                            } else {
                                var elements = this.element.getElementsByClassName('wcs_object_pline')
                                for (let index = 0; index < elements.length; index++) {
                                    var element = elements[index];
                                    element.style.display = 'flex'
                                    this.panelTitle.firstElementChild.innerHTML = 'PolyLine Properties'
                                }
                            }
                            break;
                        case EntityType.text:
                            var elements = this.element.getElementsByClassName('wcs_object_text')
                            for (let index = 0; index < elements.length; index++) {
                                var element = elements[index];
                                element.style.display = 'flex'
                            }
                            this.panelLineType.style.display = 'none'
                            this.panelLineWeight.style.display = 'none'
                            this.panelTitle.firstElementChild.innerHTML = 'Text Properties'
                            break;
                        case EntityType.node:
                            var elements = this.element.getElementsByClassName('wcs_object_point')
                            for (let index = 0; index < elements.length; index++) {
                                var element = elements[index];
                                element.style.display = 'flex'
                            }
                            this.panelLineType.style.display = 'none'
                            this.panelLineWeight.style.display = 'none'
                            this.panelTitle.firstElementChild.innerHTML = 'Point Properties'
                            break;
                        case EntityType.polygon:
                            this.panelTitle.firstElementChild.innerHTML = 'Polygon Properties'
                            break;
                        case EntityType.cadastralPoint:
                            this.mainContent.innerHTML = Create_Object_Properties(this.siMap, objects.getArray()[0])
                            break;
                        case EntityType.label:
                            if (objects.getArray()[0].name === 'sa_centriod') {
                                this.mainContent.innerHTML = Create_Object_Properties(this.siMap, objects.getArray()[0], this.mainContent)
                                    // console.log(this.mainContent)
                                objects.getArray()[0].createObjectPropetiesEventsHandler(this.mainContent)
                                this.handleEvents()
                                break;
                            }
                            this.panelTitle.firstElementChild.innerHTML = 'Label Properties'
                            this.panelLineType.style.display = 'none'
                            this.panelLineWeight.style.display = 'none'
                            this.objectsLayer.style.display = 'none'
                            this.objectsColors.style.display = 'none'
                            if (objects.getArray()[0].centriodType === CentriodType.id) {
                                var elements = this.element.getElementsByClassName('wcs_object_label')
                                for (let index = 0; index < elements.length; index++) {
                                    var element = elements[index];
                                    element.style.display = 'flex'
                                    this.panelTitle.firstElementChild.innerHTML = 'Centriod Properties'
                                }
                                var label = objects.getArray()[0]
                                this.element.getElementsByClassName('wcs_object_label_cms')[0].value = label.sabtCode
                                this.element.getElementsByClassName('wcs_object_label_bakhsh')[0].value = label.bakhsh
                                this.element.getElementsByClassName('wcs_object_label_nahiye')[0].value = label.nahiye
                                this.element.getElementsByClassName('wcs_object_label_ghate')[0].value = label.ghate
                                this.element.getElementsByClassName('wcs_object_label_mafroozi')[0].value = label.mafroozi
                                this.element.getElementsByClassName('wcs_object_label_tasbit')[0].value = `${label.tasbit ? 'تثبیت شده' : 'تثبیت نشده'}`
                                this.element.getElementsByClassName('wcs_object_label_fari')[0].value = label.fari
                                this.element.getElementsByClassName('wcs_object_label_asli')[0].value = label.asli
                            }
                            if (objects.getArray()[0].centriodType === CentriodType.name) {
                                var elements = this.element.getElementsByClassName('wcs_object_mabar')
                                for (let index = 0; index < elements.length; index++) {
                                    var element = elements[index];
                                    element.style.display = 'flex'
                                    this.panelTitle.firstElementChild.innerHTML = 'Centriod Properties'
                                }
                                var label = objects.getArray()[0]
                                this.element.getElementsByClassName('wcs_object_label_mabar')[0].value = label.text
                                this.element.getElementsByClassName('wcs_object_label_mabarArz')[0].value = label.arz
                                this.element.getElementsByClassName('wcs_object_label_mabarArzEslahi')[0].value = label.arzEslahi

                            }
                            break;
                        default:

                            // this.mainContent.innerHTML = Create_Object_Properties(this.siMap, objects.getArray()[0], this.mainContent)
                            break;
                    }
                }
                this.objectsList.children[0].children[0].innerHTML = `All (${objects.getLength()})`
                break;
            default:
                this.setColorStyle()
                this.objectsList.parentElement.style.display = 'flex'
                this.objectsList.children[0].children[0].innerHTML = `All (${objects.getLength()})`
                this.panelTitle.firstElementChild.innerHTML = 'Objects Properties'
                this.panelLineType.getElementsByTagName('label')[1].innerHTML = ''
                this.panelLayer.getElementsByTagName('label')[0].innerHTML = ''
                break;
        }
    }
    setLineType(entity) {
        if (entity.entityType === EntityType.text) return
            // console.log(entity.lineTypeIndex)
        let icons = this.panelLineType.getElementsByClassName('wcs_panel_dropdown_content')[0].getElementsByTagName('img')
        this.panelLineType.getElementsByTagName('label')[1].innerHTML = `${getLineTypeName(entity.lineTypeIndex)}`
        for (let index = 0; index < icons.length; index++) {
            const element = icons[index];
            element.src = ''
            if (entity.lineTypeIndex === element.parentElement.parentElement.getAttribute('lineTypeIndex')) {
                element.src = './webCad_Icons/wcs_checked_light.svg'
            }
        }
    }
    setGeometryStyle(entity) {
        switch (entity.entityType) {
            case EntityType.line:
                var coordinates = entity.getGeometry().getCoordinates()
                    // console.log(coordinates.length)
                if (coordinates.length != 2) return
                else {
                    // console.log(this.element.getElementsByClassName('wcs_panel_line_sx')[0])
                    this.element.getElementsByClassName('wcs_panel_line_sx')[0].value = Math.round(coordinates[0][0] * 1000) / 1000;
                    this.element.getElementsByClassName('wcs_panel_line_sy')[0].value = Math.round(coordinates[0][1] * 1000) / 1000;
                    this.element.getElementsByClassName('wcs_panel_line_ex')[0].value = Math.round(coordinates[1][0] * 1000) / 1000;
                    this.element.getElementsByClassName('wcs_panel_line_ey')[0].value = Math.round(coordinates[1][1] * 1000) / 1000;
                    this.element.getElementsByClassName('wcs_panel_line_length')[0].innerHTML =
                        `${Math.round(entity.getLength()*1000)/1000} m`;
                    this.element.getElementsByClassName('wcs_panel_line_Angle')[0].innerHTML =
                        `${entity.getAngle()} deg`;
                }
                break;
            case EntityType.circle:
                var center = entity.getGeometry().getCenter();
                var radius = entity.getGeometry().getRadius();
                this.element.getElementsByClassName('wcs_panel_circle_x')[0].value = Math.round(center[0] * 1000) / 1000;
                this.element.getElementsByClassName('wcs_panel_circle_y')[0].value = Math.round(center[1] * 1000) / 1000;
                this.element.getElementsByClassName('wcs_panel_circle_radius')[0].value = Math.round(radius * 1000) / 1000;
                this.element.getElementsByClassName('wcs_panel_circle_area')[0].innerHTML = `${Math.round(entity.getArea()*1000000)/1000000} m2`;
            default:
                break;
        }
    }
    setLineWeigth(entity) {
        if (entity.entityType === EntityType.text) return
        let icons = this.panelLineWeigthChecked
        this.panelLineWeight.getElementsByTagName('label')[1].innerHTML = `${getLineWeightName(entity.lineWeightIndex)}`
        for (let index = 0; index < icons.length; index++) {
            const element = icons[index];
            element.src = ''
            if (entity.lineTypeIndex === element.parentElement.parentElement.getAttribute('lineTypeIndex')) {
                element.src = './webCad_Icons/wcs_checked_light.svg'
            }
        }
    }
    reShape() {
        this.element.removeChild(this.element.firstChild)
        this.element.innerHTML = wcs_sideBar_styleHandler(this.siMap)
        this.element.parentElement.className = 'wcs_app_sidebar'
        this.siMap.container.getElementsByClassName("wcs_app_sidebar")[0].style.width = '358px'
            // if (this.commandsPallet) this.commandsPallet.className = 'wcs_commandsPallet_container'
        this.siMap.appStyle.pallet.className = 'wcs_commandsPallet_container'
        if (this.wcs_modal) this.wcs_modal.element.className = 'wcs_modal_container'
        this.init()
        if (this.layersListContainer) this.layersListContainer.innerHTML = getLayerList(this.siMap)
        if (this.imagesListContainer) this.imagesListContainer.innerHTML = getOuthoPhotoList(this.siMap)
        this.handleEvents()
        this.handleSelect()
        switch (this.siMap.appStyle.activeSideBarContent.name) {
            case wcs_sideBarContentsType.labeling:
                this.siMap.container.getElementsByClassName("wcs_app_sidebar")[0].style.width = '498px'
                labelingEventsHandler(this.siMap, this.element)

                break;
            case wcs_sideBarContentsType.linelabeling:
                this.siMap.container.getElementsByClassName("wcs_app_sidebar")[0].style.width = '498px'
                lineLabelingEventsHandler(this.siMap, this.element)
                break;
            default:
                this.siMap.container.getElementsByClassName("wcs_app_sidebar")[0].style.width = '358px'
                break;
        }
        this.panelOpen = true;
    }
}
export default wcs_sidebar
export const getColorFromIndex = (index) => {
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
    let colorObj = cadMainColor.find(c => c.index === index)
    if (colorObj) {
        return {
            name: colorObj.name,
            color: colorObj.color
        }
    } else {
        return {
            name: 'White',
            color: 'rgb(255,255,255)'
        }
    }
}
export const getLineWeigthNameFromIndex = (index) => {
    switch (index) {
        case lineWeightType.default:
            return 'Default'
        case lineWeightType.w0d5:
            return '0.5 mm'
        case lineWeightType.w1d0:
            return '1 mm'
        case lineWeightType.w1d5:
            return '1.5 mm'
        case lineWeightType.w2d0:
            return '2 mm'
        default:
            return 'Default'
    }
}
export const getLineTypeNameFromIndex = (index) => {
    switch (index) {
        case lineTypeType.countinus:
            return 'Countinus'
        case lineTypeType.dashed:
            return 'Dashed'
        default:
            return 'Countinus'
    }
}
const getLineTypeName = (index) => {
    switch (index) {
        case lineTypeType.countinus:
            return 'Countinus'
        case lineTypeType.dashed:
            return 'Dashed'
        case lineTypeType.byLayer:
            return 'By Layer'
        default:
            break;
    }
}
const getLineWeightName = (index) => {
    switch (index) {
        case lineWeightType.default:
            return 'Default'
        case lineWeightType.w0d5:
            return '0.5 mm'
        case lineWeightType.w1d0:
            return '1 mm'
        case lineWeightType.w1d5:
            return '1.5 mm'
        case lineWeightType.w2d0:
            return '2 mm'
        case lineWeightType.byLayer:
            return 'By Layer'
        default:
            break;
    }
}