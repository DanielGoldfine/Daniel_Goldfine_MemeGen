'use strict';

function saveToLocalStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function LoadFromLocalStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val);
}