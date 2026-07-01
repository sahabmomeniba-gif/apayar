import '../style.css'


export const wcs_commandsPallet_styleHandler = (siMap)=>{
    // console.log(siMap.appStyle.activeSideBarContent.content)
    let base = ''
    base+= `
        <div class="wcs_commandsPallet_navbar"> 
            <nav>
                    ${getCommadsPallet(siMap)}
            </nav>
        </div>
        <div class="wcs_commandsPallet_content"> 
            <div class="wcs_commandPallet_content_item_container">${getCommandsPalletContent(siMap)}</div>
        </div>
    `
    return base
}

const getCommadsPallet= (siMap)=>{
    let str = ''
    siMap.appStyle.commandsPallet.forEach(pallet=>{
        if(pallet.name != siMap.appStyle.activePalletContent.name) str+=`<div navName="${pallet.name}" class="wcs_clickable">${pallet.title}</div>`
        else str+=`<div navName="${pallet.name}" class="wcs_clickable wcs_commandsPallet_navbar_selected">${pallet.title}</div>`
    })
    return str
}
const getCommandsPalletContent = (siMap)=>{
    let str=''
    siMap.appStyle.activePalletContent.content.forEach(content=>{
        str+=`
                    <div class="wcs_commandPallet_btn wcs_clickable" command="${content.command}">
                        <a ><img src="${content.icon}"/></a>         
                        <span class="wcs_commandsPallet_tooltip">${content.name}</span>
                    </div>
        `
    })
    return str
}