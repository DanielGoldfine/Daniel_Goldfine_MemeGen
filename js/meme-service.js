'use strict';

var gKeywords = {
    'funny': 1,
    'movies': 1,
    'leaders': 1,
    'crazy': 1,
    'animals': 1,
    'babies': 1,
    'cute': 1
}

var gImgs = [{
    id: makeId(4),
    url: '.meme-imgs/1.jpg',
    keywords: ['leaders', 'crazy']
},
{
    id: makeId(4),
    url: '.meme-imgs/2.jpg',
    keywords: ['animals', 'cute']
},
{
    id: makeId(4),
    url: '.meme-imgs/3.jpg',
    keywords: ['babie', 'animals', 'cute']
},
{
    id: makeId(4),
    url: '.meme-imgs/4.jpg',
    keywords: ['animals']
},
{
    id: makeId(4),
    url: '.meme-imgs/5.jpg',
    keywords: ['babies', 'crazy']
},
{
    id: makeId(4),
    url: '.meme-imgs/6.jpg',
    keywords: ['funny']
},
{
    id: makeId(4),
    url: '.meme-imgs/7.jpg',
    keywords: ['babies', 'crazy']
},
{
    id: makeId(4),
    url: '.meme-imgs/8.jpg',
    keywords: ['movies']
},
{
    id: makeId(4),
    url: '.meme-imgs/9.jpg',
    keywords: ['babies', 'crazy', 'funny']
},
{
    id: makeId(4),
    url: '.meme-imgs/10.jpg',
    keywords: ['leaders']
},
{
    id: makeId(4),
    url: '.meme-imgs/11.jpg',
    keywords: ['funny', 'crazy']
},
{
    id: makeId(4),
    url: '.meme-imgs/12.jpg',
    keywords: ['funny']
},
{
    id: makeId(4),
    url: '.meme-imgs/13.jpg',
    keywords: ['movies']
},
{
    id: makeId(4),
    url: '.meme-imgs/14.jpg',
    keywords: ['movies']
},
{
    id: makeId(4),
    url: '.meme-imgs/15.jpg',
    keywords: ['movies']
},
{
    id: makeId(4),
    url: '.meme-imgs/16.jpg',
    keywords: ['movies']
},
{
    id: makeId(4),
    url: '.meme-imgs/17.jpg',
    keywords: ['leaders', 'crazy']
},
{
    id: makeId(4),
    url: '.meme-imgs/18.jpg',
    keywords: ['movies']
}];

var gMeme;


//******************************************************************************************************************************* */

function init() {
    renderGallery();
}

function getImgs() {
    return gImgs
}

function getImgIdx(imgId) {
    const imgIdx = gImgs.findIndex(img => img.id === imgId)
    return imgIdx;
}

function getMemeObj() {
    return gMeme;
}

function createMemeObj(imgId) {

    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: null,
        lines: []
    };
}

function setLineIdx(idx) {
    gMeme.selectedLineIdx = idx
}

function clearLineIdx() {
    gMeme.selectedLineIdx = null;
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    clearLineIdx();
}

function updateFontSize(diff) {

    if (diff === 'up') gMeme.lines[gMeme.selectedLineIdx].size += 3
    else gMeme.lines[gMeme.selectedLineIdx].size -= 3
}

function updateFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function createTextLine(posX, posY, font, size) {

    const textColor = document.querySelector('.text-color').value
    const strokeColor = document.querySelector('.stroke-color').value

    gMeme.lines.push({
        txt: '',
        font,
        size,
        posX,
        posY,
        align: 'center',
        fill: textColor,
        stroke: strokeColor
    })
}