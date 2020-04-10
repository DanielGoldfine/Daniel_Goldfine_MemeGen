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

var gStckrs = [];
var gStckrsIdx = 0;
var gStckrsDspl = [];
var gMeme;


//******************************************************************************************************************************* */

function init() {
    createGStckrs(36);
    initStckrsDispl(gStckrs);
    renderGallery();
    renderStickers();
}

function createGStckrs(num) {
for (let i = 0 ; i < num ; i++) {
    gStckrs.push({
            id: makeId(3),
            url: `.stickers/${i+1}.png`,
        });
};
}

function initStckrsDispl(stckrs) {
    for (let i = 0 ; i < 4 ; i++) {
        gStckrsDspl.push(stckrs[i]);
    }
}

function getImgs() {
    return gImgs
}

function getStckrsDspl() {
    return gStckrsDspl;
}

function getMemeObj() {
    return gMeme;
}

function createMemeObj(imgId) {

    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: null,
        lines: [],
        stckrs: []
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

function updateTextAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}

function updateColor(val, color) {
    if (val === 'stroke') gMeme.lines[gMeme.selectedLineIdx].stroke = color;
    else gMeme.lines[gMeme.selectedLineIdx].fill = color;
}

function updateLinePos(line, diffX, diffY) {
    line.posX += diffX;
    line.posY += diffY;
}

function scrollStickers(direction) {

    gStckrsDspl = [];

    if (direction === 'right') {
        gStckrsIdx++
        if (gStckrsIdx === gStckrs.length) gStckrsIdx = 0;
        for (var i = gStckrsIdx ; i < 4 + gStckrsIdx ; i++) {
            var idx = i;
            if (i > gStckrs.length - 1) idx -= (gStckrs.length);
            gStckrsDspl.push(gStckrs[idx]);
        }
    }
    if (direction === 'left') {
        gStckrsIdx--;
        if (gStckrsIdx === -1) gStckrsIdx = gStckrs.length - 1;
        for (var i = gStckrsIdx ; i < 4 + gStckrsIdx ; i++) {
            var idx = i;
            if (i > gStckrs.length - 1) idx -= (gStckrs.length);
            gStckrsDspl.push(gStckrs[idx]);
        }
    }
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