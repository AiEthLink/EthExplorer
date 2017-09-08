var myapp = angular.module('ethExplorer');
myapp.service('localStorage', function () {

    this.setLocalStorage = function (key, value) {
        window.localStorage.removeItem(key)
        window.localStorage[key] = value;
    }
    this.getLocalStorage = function (key, defaultValue) {
        return window.localStorage[key] || defaultValue;
    }
    this.setObjectLocalStorage = function (key, value) {
        window.localStorage.removeItem(key)
        window.localStorage[key] = JSON.stringify(value);
    }
    this.getObjectLocalStorage = function (key) {
        // console.log('getObjectLocalStorage' + window.localStorage[key])
        return JSON.parse(window.localStorage[key] || '{}');
    }
});