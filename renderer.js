const { ipcRenderer } = require('electron')

// Window controls
document.getElementById('minimize-btn').addEventListener('click', () => {
    ipcRenderer.send('minimize')
})

document.getElementById('maximize-btn').addEventListener('click', () => {
    ipcRenderer.send('maximize')
})

document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('close')
})

// Browser functionality
const webview = document.getElementById('webview')
const urlBar = document.getElementById('url-bar')
const backBtn = document.getElementById('back-btn')
const forwardBtn = document.getElementById('forward-btn')
const refreshBtn = document.getElementById('refresh-btn')
const homeBtn = document.getElementById('home-btn')
const goBtn = document.getElementById('go-btn')
const statusText = document.getElementById('status-text')
const zoomLevel = document.getElementById('zoom-level')

let currentZoom = 1

// Navigation functions
function navigateTo(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
    }
    webview.src = url
}

function updateNavigationButtons() {
    backBtn.disabled = !webview.canGoBack()
    forwardBtn.disabled = !webview.canGoForward()
}

// Event listeners
goBtn.addEventListener('click', () => {
    navigateTo(urlBar.value)
})

urlBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        navigateTo(urlBar.value)
    }
})

backBtn.addEventListener('click', () => {
    webview.goBack()
})

forwardBtn.addEventListener('click', () => {
    webview.goForward()
})

refreshBtn.addEventListener('click', () => {
    webview.reload()
})

homeBtn.addEventListener('click', () => {
    webview.src = 'https://www.google.com'
})

// Webview events
webview.addEventListener('did-start-loading', () => {
    statusText.textContent = 'Loading...'
})

webview.addEventListener('did-stop-loading', () => {
    statusText.textContent = 'Done'
    updateNavigationButtons()
})

webview.addEventListener('did-navigate', (e) => {
    urlBar.value = e.url
    updateNavigationButtons()
})

webview.addEventListener('did-navigate-in-page', (e) => {
    urlBar.value = e.url
    updateNavigationButtons()
})

webview.addEventListener('page-title-updated', (e) => {
    document.title = e.title + ' - Nexus Browser'
})

webview.addEventListener('dom-ready', () => {
    // Inject custom CSS for all pages
    webview.insertCSS(`
        ::selection {
            background: var(--primary-color);
            color: white;
        }
    `)
})

// Zoom functionality
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        if (e.key === '+') {
            currentZoom += 0.1
            webview.setZoomFactor(currentZoom)
            zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`
            e.preventDefault()
        } else if (e.key === '-') {
            currentZoom -= 0.1
            if (currentZoom < 0.3) currentZoom = 0.3
            webview.setZoomFactor(currentZoom)
            zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`
            e.preventDefault()
        } else if (e.key === '0') {
            currentZoom = 1
            webview.setZoomFactor(currentZoom)
            zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`
            e.preventDefault()
        }
    }
})

// Initial setup
updateNavigationButtons()
