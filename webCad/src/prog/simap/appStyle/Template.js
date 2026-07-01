import './style.css'
// import './bootstrap/css/bootstrap.css'

export const webcadTemplateC1 = () => {
    let c1 = document.createElement('div');
    c1.className = "webcadC1"
    return c1
}
export const webcadTemplateC2 = () => {
    let c2 = document.createElement('div');
    c2.className = "webcadC2"
    return c2
}
export const webcadTemplateC3 = () => {
    let c3 = document.createElement('div');
    c3.className = "webcadC3"
    return c3
}
export const webcadTemplateC4 = () => {
    let c4 = document.createElement('div');
    c4.className = "webcadC4"
    return c4
}
export const wcs_sideBarTemplate = () => {
    let c1 = document.createElement('div');
    c1.className = "wcs_sidebar_container"
    return c1
}

export const wcs_navBarTemplate = () => {
    let container = document.createElement('div');
    container.className = 'wcs_navbar_container'
    return container
}
export const wcs_commandsPalletTemplate = () => {
    let container = document.createElement('div');
    // container.className = 'wcs_commandsPallet_container'
    container.className = 'wcs_3'
    container.id = 'wcs_commandsPallet'
    return container
}
export const wcs_panelTemplate = () => {
    let container = document.createElement('div');
    // container.className = 'wcs_panel_container'
    container.className = 'wcs_2'
    return container
}
export const wcs_cadTemplate = () => {
    let container = document.createElement('div');
    // container.className = 'wcs_cad_container'
    container.className = 'wcs_4'
    return container
}
export const wcs_statusBarTemplate = () => {
    let container = document.createElement('div');
    // container.className = 'wcs_statusBar_container'
    container.className = 'wcs_5'
    return container
}

export const wcs_topMenuTemplate = () => {
    let container = document.createElement('div');
    // container.className = 'wcs_topMenuTemplate'
    container.className = 'wcs_1'
    return container
}