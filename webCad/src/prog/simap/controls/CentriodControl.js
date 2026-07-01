import 'ol/ol.css';
import {Control} from 'ol/control';

import baseElement from './BaseElement';
import FeatureProperties from './Menu/FeatureProperties';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Fill, RegularShape, Stroke, Style } from 'ol/style';
import LineString from 'ol/geom/LineString';
import { EntityType } from '../entities/Entity';
import Polygon from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import { epictype, Mm2Px } from '../initparams';
import CentriodProperties from './Menu/CentriodProperties';
import { CentriodType } from '../entities/Labels';
import { multipleExist } from '../helpers/MultiParamsArrayCheck';

class CentriodControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    super({
      element: baseElement(),
    });
      this.siMap = options.siMap
      const element = CentriodProperties({
        title:'برچسب ثبتی',
        control:this
      })
      this.element.appendChild(element)
      this.element.style.visibility = 'hidden'
      this.open = false;
      this.controlEvents()
      if(options.shouldHide !=undefined){
        this.shouldHide = options.shouldHide
      }
      else{
        this.shouldHide = false
      }
    }
    controlEvents(){
      // console.log(this.siMap.siSelect.currentLabel)
      this.label = this.siMap.siSelect.currentLabel
      // if(!this.label) return
      
      let exitControl = this.element.getElementsByClassName('exit')[0]
      exitControl.addEventListener('click',e=>{
        this.handleOpen()
        if(this.label.selected){
          this.label.selected = false
          this.siMap.clearModify()
        }
        this.siMap.siCommand.reActive()
      },
      false)
      let openCmsType = this.element.getElementsByClassName('CmsType-dropbtn')[0]
      // console.log(openCmsType)
      if(openCmsType){
        openCmsType.addEventListener('click',e=>{
          // console.log('click 2')
          let elm = document.getElementsByClassName("CmsType-dropdown-content")[0]
          console.log(getStyle(elm,'visibility'))
          if(getStyle(elm,'visibility') ==='hidden'){
            document.getElementsByClassName("CmsType-dropdown-content")[0].style.visibility = 'visible'
            return
          }
          if(getStyle(elm,'visibility')==='visible'){
            document.getElementsByClassName("CmsType-dropdown-content")[0].style.visibility = 'hidden'
            return
          }
        },
        false)
      }
      let CmsTypeInput = this.element.getElementsByClassName('CmsType-myInput')[0]
      // console.log(openCmsType)
      if(CmsTypeInput){
        CmsTypeInput.addEventListener('keyup',e=>{
          var input, filter, ul, li, a, i,div,txtValue;
          input = document.getElementsByClassName("CmsType-myInput")[0]
          filter = input.value.toUpperCase();
          div = document.getElementsByClassName("CmsType-dropdown-content")[0]
          a = div.getElementsByTagName("a");
          for (i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              a[i].style.display = "";
            } else {
              a[i].style.display = "none";
            }
          }
        },
        false)
      }
      let CmsTypeSelected = this.element.getElementsByClassName("CmsType-dropdown-content")[0]
      if(CmsTypeSelected){
        let aTag = CmsTypeSelected.getElementsByTagName("a")
        for (let i = 0; i < aTag.length; i++) {
          let element = aTag[i]
          element.addEventListener('click',e=>{
            // console.log(e.target.getAttribute('epicType'))
            document.getElementsByClassName("CmsType-dropdown-content")[0].style.visibility = 'hidden'
            this.epicType = epictype['Export Worksheet'][e.target.getAttribute('epicType')]
            this.label.epicType = this.epicType 
            this.handleSelection()
          },false)
        }
      }
      
      let CmsTypemyInput = this.element.getElementsByClassName("CmsType-myInput")[0]
      if(CmsTypemyInput){
        CmsTypemyInput.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        },false)
      } 
      let saveBtn = this.element.getElementsByClassName('saveBtn')[0]
      saveBtn.addEventListener('click',e=>{
        this.handleOpen()
        if (this.label) this.label.render()
        // this.label.render()
        if(this.label.selected){
          
          this.label.selected = false
          this.siMap.siSelect.currentLabel = undefined;
          this.siMap.clearModify()
          this.siMap.siCommand.reActive()
        }
      },
      false)
      let centriod_select = this.element.getElementsByClassName('centriod_select')[0]
      centriod_select.addEventListener('change',this.changeType.bind(this),false)
      let input_sabtcode = this.element.getElementsByClassName('input-sabtcode')[0]
      if(input_sabtcode){
        input_sabtcode.addEventListener('change',e=>{
          this.changeCms(e.target.value)
        },false) 
        input_sabtcode.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
      }
      let input_bakhshcode = this.element.getElementsByClassName('input-bakhshcode')[0]
      if(input_bakhshcode){
        input_bakhshcode.addEventListener('change',e=>{
          this.changeBakhsh(e.target.value)
        },false) 
        input_bakhshcode.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
      }
      
      let  input_nahiyecode = this.element.getElementsByClassName('input-nahiyecode')[0]
      if(input_nahiyecode ){
        input_nahiyecode.addEventListener('change',e=>{
          this.changeNahiye(e.target.value)
        },false) 
        input_nahiyecode.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
      }
      let  input_pelakasli = this.element.getElementsByClassName('input-pelakasli')[0]
      if(input_pelakasli){
        input_pelakasli.addEventListener('change',e=>{
          this.changeAsli(e.target.value)
        },false) 
        input_pelakasli.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
      }
      
      let  input_pelakfari = this.element.getElementsByClassName('input-pelakfari')[0]
      if(input_pelakfari){
        input_pelakfari.addEventListener('change',e=>{
          this.changeFari(e.target.value)
        },false) 
        input_pelakfari.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
      }
      
      let  input_mafroozi = this.element.getElementsByClassName('input-mafroozi')[0]
      if(input_mafroozi){
        input_mafroozi.addEventListener('change',e=>{
          this.changeMafroozi(e.target.value)
        },false) 
        input_mafroozi.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
      }
      
      let input_ghate = this.element.getElementsByClassName('input-ghate')[0]
      if(input_ghate){
        input_ghate.addEventListener('change',e=>{
          this.changeGhate(e.target.value)
        },false) 
        input_ghate.addEventListener('focus',e=>{
          this.siMap.siCommand.deActive()
        })
      }
     let input_tasbit = this.element.getElementsByClassName('input-tasbit')[0]
     if(input_tasbit){
      input_tasbit.addEventListener('change',e=>{
        this.changeTasbit()
      },false) 
     }
     let input_Centriod_name = this.element.getElementsByClassName('input-Centriod-name')[0]
     if(input_Centriod_name){
      input_Centriod_name.addEventListener('change',e=>{
        this.changeText(e.target.value)
      },false) 
      input_Centriod_name.addEventListener('focus',e=>{
        this.siMap.siCommand.deActive()
      })
     }
     let input_Centriod_arz = this.element.getElementsByClassName('input-Centriod-arz')[0]
     if(input_Centriod_arz){
      input_Centriod_arz.addEventListener('change',e=>{
        this.changeArz(e.target.value)
      },false) 
      input_Centriod_arz.addEventListener('focus',e=>{
        this.siMap.siCommand.deActive()
      })
     }
     let input_Centriod_arzEslahi = this.element.getElementsByClassName('input-Centriod-arzEslahi')[0]
     if(input_Centriod_arzEslahi){
      input_Centriod_arzEslahi.addEventListener('change',e=>{
        this.changeArzEslahi(e.target.value)
      },false) 
      input_Centriod_arzEslahi.addEventListener('focus',e=>{
        this.siMap.siCommand.deActive()
      })
     }
     
    //  let input_size = this.element.getElementsByClassName('input-size')[0]
    //  if(input_size){
    //   input_size.addEventListener('change',e=>{
    //     this.changeSize(e.target.value)
    //   },false) 
    //   input_size.addEventListener('focus',e=>{
    //     this.siMap.siCommand.deActive()
    //   })
    //  }
    //  let input_angle = this.element.getElementsByClassName('input-angle')[0]
    //  if(input_angle){
    //   input_angle.addEventListener('change',e=>{
    //     this.changeAngle(e.target.value*Math.PI/180)
    //   },false) 
    //  }
    //  input_angle.addEventListener('focus',e=>{
    //   this.siMap.siCommand.deActive()
    // })
    }
    changeArzEslahi(value){
      this.label.arzEslahi = value
    }
    changeArz(value){
      this.label.arz = value
    }
    changeAngle(value){
      // console.log(value)
      this.label.rotation = value
      this.label.setAngle()
    }
    changeSize(value){
      // console.log(value)
      this.label.size = value
      this.label.reSize()
    }
    changeText(value){
      this.label.text = value
      this.label.createCode()
    }
    changeTasbit(){
      if(this.label.tasbit){
        this.label.tasbit = false
      }
      else{
        this.label.tasbit = true
      }
      this.label.createCode()
    }
    changeGhate(value){
      // console.log(value,'ghate change')
      this.label.ghate = value;
      this.label.createCode()
    }
    changeMafroozi(value){
      this.label.mafroozi = value;
      this.label.createCode()
    }
    changeFari(value){
      this.label.fari = value;
      this.label.createCode()
    }
    changeAsli(value){
      this.label.asli = value;
      this.label.createCode()
    }
    changeNahiye(value){
      this.label.nahiye = value;
      this.label.createCode()
    }
    changeCms(value){
      this.label.sabtCode = value;
      this.label.createCode()
      // console.log(this.label)
    }
    changeBakhsh(value){
      this.label.bakhsh = value;
      this.label.createCode()
    }
    changeType(){
      if(this.label.centriodType === CentriodType.id){
        this.label.centriodType = CentriodType.name
        if(this.label.showStyle) this.label.showStyle.getText().setText(this.label.text)       
        this.handleSelection()
        return
      } 
      if(this.label.centriodType === CentriodType.name){
        this.label.centriodType = CentriodType.id
        // console.log(this.label.centriodType)
        // let codes = {
        //   tasbit:multipleExist(this.label.text,['*']),
        //   cms: this.label.text.substr(0, 3), 
        //   bakhsh: this.label.text.substr(3, 2),
        //   nahieh: this.label.text.substr(5, 2),
        //   asli: this.label.text.substr(7, this.label.text.indexOf('F') - 7),
        //   fare: this.label.text.substr(this.label.text.indexOf('F') + 1, this.label.text.indexOf('M') - this.label.text.indexOf('F') - 1),
        //   mafruzi: this.label.text.substr(this.label.text.indexOf('M') + 1, this.label.text.indexOf('G') - this.label.text.indexOf('M') - 1),
        //   ghate: this.label.text.substr(this.label.text.indexOf('G') + 1, (this.label.text.includes('A')) ? this.label.text.indexOf('A') - this.label.text.indexOf('G') - 1 : this.label.text.length - this.label.text.indexOf('G')).replace('*', ''),
        //       }
        // console.log(codes)
        if(this.label.showStyle) this.label.showStyle.getText().setText(`${this.label.asli}-${this.label.fari}`) 
        this.handleSelection()
        return
      } 
    }
    show(){
      // console.log(this.element)
      if(!this.open){
        if(this.shouldHide == true){
          return
        }
        this.element.style.visibility = ''
        this.open = true
      }
    }
    hide(){
      if(this.open){
        this.element.style.visibility = 'hidden'
        if(document.getElementsByClassName("CmsType-dropdown-content")[0]){
          document.getElementsByClassName("CmsType-dropdown-content")[0].style.visibility = 'hidden'
        }
        this.open = false
      }
    }
    handleOpen(){
      // console.log('closed')
      if(this.open){
        // this.label.deSelect()
        this.hide()
        // this.siMap.clearModify()
        // this.label.select = false
        // this.siMap.siSelect.label = undefined;
      }
      else{
        this.show()
      }
    }
    handleRotateNorth() {
      this.getMap().getView().setRotation(0);
    }
    handleSelection(){
      this.siMap.siCommand.reActive()
      this.label = this.siMap.siSelect.currentLabel
      const element = CentriodProperties({
          title:'برچسب ثبتی',
          control:this
        })   
      this.element.removeChild(this.element.lastChild)
      this.element.appendChild(element)
      this.controlEvents()
    }
    getCurrentSelection(){
      return this.currentSelection
    }   
  }

  function getStyle(el, styleProp) {
    var value, defaultView = (el.ownerDocument || document).defaultView;
    // W3C standard way:
    if (defaultView && defaultView.getComputedStyle) {
      // sanitize property name to css notation
      // (hypen separated words eg. font-Size)
      styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
      return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    } else if (el.currentStyle) { // IE
      // sanitize property name to camelCase
      styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
        return letter.toUpperCase();
      });
      value = el.currentStyle[styleProp];
      // convert other units to pixels on IE
      if (/^\d+(em|pt|%|ex)?$/i.test(value)) { 
        return (function(value) {
          var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
          el.runtimeStyle.left = el.currentStyle.left;
          el.style.left = value || 0;
          value = el.style.pixelLeft + "px";
          el.style.left = oldLeft;
          el.runtimeStyle.left = oldRsLeft;
          return value;
        })(value);
      }
      return value;
    }
  }  

export default CentriodControl