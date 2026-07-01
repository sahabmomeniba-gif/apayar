import './MenuStyle.css'

const MenuTemplate = (options)=>{
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '70%'
    
    let TopBox = document.createElement('div')
    TopBox.className  = 'TopBox'
    container.appendChild(TopBox)
    let titleContainer = document.createElement('div')
    titleContainer.className = 'title'
    let title = document.createElement('label')
    title.innerHTML = options.title
    title.style.fontFamily = 'sans-serif'
    TopBox.appendChild(titleContainer)
    titleContainer.appendChild(title)
    let exitContainer = document.createElement('div')
    exitContainer.className = 'exit'
    TopBox.appendChild(exitContainer)
    let exitBtn = document.createElement('button')
    exitBtn.className = 'close'
    exitBtn.innerHTML = '&times;'
    exitContainer.appendChild(exitBtn)
    return container
}

export default MenuTemplate