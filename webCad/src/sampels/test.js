// mapSelect.interaction.on('selectend',e=>{
//   console.log(e)
//   if(!e.feature){
//       return
//   }
//   else{
//       this.siMap.mapParams.selectedFeature = null;
//       this.siMap.mapParams.modifyPoint = null;
//   }
// })
// mapHover.interaction.on('select',e=>{
//   if(!e.selected[0]){
//       return
//   }
//   else{
//       this.siMap.mapParams.onHoverFeature = e.selected[0];
//   }
// })
// // this.siMap.activeAllinteraction();
// // this.siMap.disableAllinteraction();
// // this.siMap.disableAllinteractionInBaseEvent('pointermove')
// // this.map.addInteraction(this.selectPointerMove)
// this.selectPointerMove.on('select',e=>{
//   if(!e.selected[0]){
//       return
//   }
//   let feature = e.selected[0];
//   // feature.getProperties().currentEvent = 'onHover'
// })
// let onTransformFeature;
// const TranformFeatures = new Transform({
//   filter:(feature,layer)=>{
//       onTransformFeature = feature
//       let onTransformLayer = this.siMap.layers.find(l => l.name == feature.get('layerName'));
//       if(onTransformLayer.type === 'text'){
//           return true
//       }
//       else{
//           return false
//       }
//   },
//   enableRotatedTransform: true,
//   addCondition: shiftKeyOnly,
//   hitTolerance: 2,
//   translateFeature: false,
//   scale: true,
//   rotate: true,
//   keepAspectRatio:  always,
//   keepRectangle: false,
//   translate: true,
//   stretch: false,
// })
// let rectWidth;
// let rectHeight;
// let initRotation;
// let onModifyLayer;
// const calcDistance = (p1,p2)=>{
//   return Math.sqrt(Math.pow((p1[1]-p2[1]),2)+Math.pow((p1[0]-p2[0]),2))
// }
// TranformFeatures.on(['rotatestart','scalestart','translatestart'],e=>{
//   let feature = e.feature;
//   onModifyLayer = this.siMap.layers.find(l => l.name == feature.get('layerName'));
//   let text = onModifyLayer.Texts.find(text => text.id == feature.get('textID'));         
//   initRotation = text.rotate 
// })
// TranformFeatures.on('rotating',e=>{
//           let feature = e.feature
          
//           if(onModifyLayer.type === 'text'){
//               let text = onModifyLayer.Texts.find(text => text.id == feature.get('textID'));
//               let rotate = initRotation -  e.angle
//               let imgLayer = text.imgLayer
//               imgLayer.getSource().setRotation(rotate)  
//               text.rotate = rotate

//           }
//           else{
//               return
//           }
//       })
//   TranformFeatures.on('scaling',e=>{
//       if(onModifyLayer.type === 'text'){
//               let feature = e.feature;   
//               let imageExtent = feature.getGeometry().getExtent()
//               let crood = feature.getGeometry().getCoordinates()[0];
//               let featureCenter = [(imageExtent[2]+imageExtent[0])/2,(imageExtent[3]+imageExtent[1])/2]
//               let p1;
//               let p2;
//               let p3;
//               crood.forEach(point => {
//                   if(point[0] === imageExtent[0]){
//                       p1 = point
//                   }
//                   if(point[1] === imageExtent[1]){
//                       p2 = point
//                   }
//                   if(point[0] === imageExtent[2]){
//                       p3 = point
//                   }
//               });
//               let pw = Math.max(calcDistance(p1,p2),calcDistance(p2,p3))
//               let ph = Math.min(calcDistance(p1,p2),calcDistance(p2,p3))             
//               let text = onModifyLayer.Texts.find(text => text.id == feature.get('textID'));
//               let imgLayer = text.imgLayer  
//               let imageScale = [pw/text.svgSize[0],ph/text.svgSize[1]]        
//               let staticSource = new GeoImage({
//                   url: imgLayer.getSource().getGeoImage().src,
//                   projection: 'EPSG:32639',
//                   imageExtent: imageExtent,
//                   imageCenter:  featureCenter,
//                   imageRotate: text.rotate,
//                   imageScale: imageScale,
//               });
//               imgLayer.setSource(staticSource)                 
//           }
//           else{
//               return
//           }


// })
// TranformFeatures.on('translating',e=>{
  
//       let feature = e.feature
  
//       let onModifyFeature = feature
//       let text = onModifyLayer.Texts.find(text => text.id == feature.get('textID'));
//       if(onModifyLayer.type === 'text'){              
//               let imgLayer = text.imgLayer
//               let featureExtent = onModifyFeature.get('geometry').getExtent()
//               let featureCenter = [featureExtent[0] + (featureExtent[2]-featureExtent[0])/2,featureExtent[1] + (featureExtent[3]-featureExtent[1])/2]
//               let staticSource = new GeoImage({
//                   url: imgLayer.getSource().getGeoImage().src,
//                   projection: 'EPSG:32639',
//                   imageExtent: imgLayer.getSource().getExtent(),
//                   imageCenter:  featureCenter,
//                   imageRotate: imgLayer.getSource().getRotation(),
//                   imageScale: imgLayer.getSource().getScale(),
//               });
//               text.center = featureCenter
//               imgLayer.setSource(staticSource)      
//           }
//           else{
//               return
//           }

// })
// // this.map.addInteraction(
// //     // DragFeatures,
// //     // TranformFeatures
// //     // sTranslate
// //     );
// }