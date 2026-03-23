import CryptoJS from 'crypto-js';

function getFingerprint() {
    const data = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        screenResolution: screen.width + 'x' + screen.height,
        availableScreenResolution: screen.availWidth + 'x' + screen.availHeight,
        timezoneOffset: new Date().getTimezoneOffset(),
        plugins: getPlugins(),
    };

    const hash = CryptoJS.MD5(JSON.stringify(data)).toString();
    return hash;
}

function getPlugins() {
    const pluginList = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
        pluginList.push(navigator.plugins[i].name);
    }
    return pluginList;
}

export default getFingerprint;
