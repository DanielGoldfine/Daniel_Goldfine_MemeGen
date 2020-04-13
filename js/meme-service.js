'use strict';

var gKeywords = {
    'men': 1,
    'woman': 1,
    'babies': 1,
    'animals': 1,
    'movies': 1,
    'cute': 1,
    'funny': 1,
    'leaders': 1,
    'smile': 1,
    'crazy': 1,
    'beauty': 1,
}

var gImgs = [{
    id: 'img01',
    url: '.meme-imgs/1.jpg',
    keywords: ['leaders', 'crazy', 'men']
},
{
    id: 'img02',
    url: '.meme-imgs/2.jpg',
    keywords: ['animals', 'cute', 'beauty']
},
{
    id: 'img03',
    url: '.meme-imgs/3.jpg',
    keywords: ['babies', 'animals', 'cute', 'beauty']
},
{
    id: 'img04',
    url: '.meme-imgs/4.jpg',
    keywords: ['animals']
},
{
    id: 'img05',
    url: '.meme-imgs/5.jpg',
    keywords: ['babies', 'crazy']
},
{
    id: 'img06',
    url: '.meme-imgs/6.jpg',
    keywords: ['men']
},
{
    id: 'img07',
    url: '.meme-imgs/7.jpg',
    keywords: ['babies', 'crazy']
},
{
    id: 'img08',
    url: '.meme-imgs/8.jpg',
    keywords: ['movies', 'men']
},
{
    id: 'img09',
    url: '.meme-imgs/9.jpg',
    keywords: ['babies', 'crazy', 'funny', 'smile']
},
{
    id: 'img10',
    url: '.meme-imgs/10.jpg',
    keywords: ['leaders', 'men', 'smile']
},
{
    id: 'img11',
    url: '.meme-imgs/11.jpg',
    keywords: ['funny', 'crazy', 'men']
},
{
    id: 'img12',
    url: '.meme-imgs/12.jpg',
    keywords: ['funny', 'men']
},
{
    id: 'img13',
    url: '.meme-imgs/13.jpg',
    keywords: ['movies', 'men']
},
{
    id: 'img14',
    url: '.meme-imgs/14.jpg',
    keywords: ['movies', 'men']
},
{
    id: 'img15',
    url: '.meme-imgs/15.jpg',
    keywords: ['movies', 'men']
},
{
    id: 'img16',
    url: '.meme-imgs/16.jpg',
    keywords: ['movies', 'men']
},
{
    id: 'img17',
    url: '.meme-imgs/17.jpg',
    keywords: ['leaders', 'crazy', 'men']
},
{
    id: 'img18',
    url: '.meme-imgs/18.jpg',
    keywords: ['movies']
},
{
    id: 'img19',
    url: '.meme-imgs/19.jpg',
    keywords: ['crazy']
},
{
    id: 'img20',
    url: '.meme-imgs/20.jpg',
    keywords: ['crazy', 'woman']
},
{
    id: 'img21',
    url: '.meme-imgs/21.jpg',
    keywords: ['leaders, crazy', 'men']
},
{
    id: 'img22',
    url: '.meme-imgs/22.jpg',
    keywords: ['babies, funny']
},
{
    id: 'img23',
    url: '.meme-imgs/23.jpg',
    keywords: ['animals, funny, crazy']
},
{
    id: 'img24',
    url: '.meme-imgs/24.jpg',
    keywords: ['crazy, movies', 'men']
},
{
    id: 'img25',
    url: '.meme-imgs/25.jpg',
    keywords: ['beauty, movies', 'woman']
}];

const KEY = 'getCanvass';
var gSavedMemes = [1,2,3,4];
var gStckrs = [];
var gStckrsIdx = 0;
var gStckrsDspl = [];
var gMeme;


//******************************************************************************************************************************* */

function init() {
    renderGallery(gImgs);
    renderKeywords('less');
    createGStckrs(36);
    initStckrsDispl(gStckrs);
    renderHiddenStckrs(gStckrs);
    renderStickers();
    assignSavedCanvass()
}

function createGStckrs(num) {
    for (let i = 0; i < num; i++) {
        gStckrs.push({
            id: 'stckr0' + (i + 1),
            url: `.stickers/${i + 1}.png`,
        });
    };
}

function initStckrsDispl(stckrs) {
    for (let i = 0; i < 4; i++) {
        gStckrsDspl.push(stckrs[i]);
    }
}

function assignSavedCanvass() {
    var storedCanvass = LoadFromLocalStorage(KEY);
    gSavedMemes = (storedCanvass) ? storedCanvass : [];
}

function scrollStickers(direction) {

    gStckrsDspl = [];

    if (direction === 'right') {
        gStckrsIdx++
        if (gStckrsIdx === gStckrs.length) gStckrsIdx = 0;
        for (let i = gStckrsIdx; i < 4 + gStckrsIdx; i++) {
            var idx = i;
            if (i > gStckrs.length - 1) idx -= (gStckrs.length);
            gStckrsDspl.push(gStckrs[idx]);
        }
    }
    if (direction === 'left') {
        gStckrsIdx--;
        if (gStckrsIdx === -1) gStckrsIdx = gStckrs.length - 1;
        for (let i = gStckrsIdx; i < 4 + gStckrsIdx; i++) {
            var idx = i;
            if (i > gStckrs.length - 1) idx -= (gStckrs.length);
            gStckrsDspl.push(gStckrs[idx]);
        };
    };
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

function getSavedMemes() {
    return gSavedMemes;
}

function getKeywords() {
    return gKeywords;
}

function getSavedMemeIdx(savedMemeId) {
    let idx = gSavedMemes.findIndex(savedMeme => savedMeme.meme.id === savedMemeId)
    return idx;
}

function getStckrIdx(stckrId) {
    const stckrIdx = gStckrs.findIndex(stckr => stckr.id === stckrId);
    return stckrIdx;
}

function createMemeObj(imgId) {

    gMeme = {
        id: makeId(4),
        selectedImgId: imgId,
        selectedLineIdx: null,
        selectedStckrIdx: null,
        lines: [],
        stckrs: [],
        canvasW: null,
        canvasH: null
    };
}

function assignMemeObj(savedMeme) {
    gMeme = savedMeme;
}

function createTextLine(posX, posY, font) {

    const textColor = document.querySelector('.text-color').value;
    const strokeColor = document.querySelector('.stroke-color').value;

    gMeme.lines.push({
        txt: '',
        font,
        size: 40,
        posX,
        posY,
        align: 'center',
        fill: textColor,
        stroke: strokeColor
    });
}

function createStckr(stckrId, elStckr) {

    const stckrW = 100;
    const ratio = stckrW / elStckr.width;
    const stckrH = elStckr.height * ratio;
    const url = gStckrs[getStckrIdx(stckrId)].url;

    gMeme.stckrs.push({
        id: stckrId,
        url,
        posX: getRandomIntInclusive(20, gElCanvas.width - 100),
        posY: getRandomIntInclusive(20, gElCanvas.height - 100),
        width: stckrW,
        height: stckrH
    });
}

function seCanvasSize(w, h) {
    gMeme.canvasW = 476;
    var ratio = gMeme.canvasW / w;
    gMeme.canvasH = h * ratio;
}

function setLineIdx(idx) {
    gMeme.selectedLineIdx = idx
}

function clearLineIdx() {
    gMeme.selectedLineIdx = null;
}

function setStckrIdx(idx) {
    gMeme.selectedStckrIdx = idx;
}

function clearStckrIdx() {
    gMeme.selectedStckrIdx = null;
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    clearLineIdx();
}

function deleteStckr() {
    gMeme.stckrs.splice(gMeme.selectedStckrIdx, 1);
    clearStckrIdx();
}

function updateFontSize(diff) {

    if (diff === 'up') gMeme.lines[gMeme.selectedLineIdx].size += 3
    else gMeme.lines[gMeme.selectedLineIdx].size -= 3
}

function updateStckrSize(diff) {
    if (diff === 'up') {
        gMeme.stckrs[gMeme.selectedStckrIdx].width *= 1.1;
        gMeme.stckrs[gMeme.selectedStckrIdx].height *= 1.1;
    } else {
        gMeme.stckrs[gMeme.selectedStckrIdx].width /= 1.1;
        gMeme.stckrs[gMeme.selectedStckrIdx].height /= 1.1;
    };
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

function updateStckrPos(stckr, diffX, diffY) {
    stckr.posX += diffX;
    stckr.posY += diffY;
}

function filterByText(input) {

    var imgsFiltered = []

    gImgs.map(img => {
        for (let i = 0; i < img.keywords.length; i++) {

            let keyword = img.keywords[i];
            if (keyword.slice(0, input.length) === input.toLowerCase()) {
                imgsFiltered.push(img);
                break;
            };
        };
    });
    renderGallery(imgsFiltered);
}

function submitSearch(word) {

    gKeywords[word]++
    let quantity = (!gIskeywordsExpanded) ? 'less' : 'full';
    renderKeywords(quantity);
}

function saveCanvasToStorage(canvas) {
    let thiscanvasId = gMeme.id;
    let existingCanvasIdx;
    let dataToSave = {
        meme: gMeme,
        thumbnail: canvas.toDataURL()
    };
    if (gSavedMemes.length > 0) {
        for (var i = 0; i < gSavedMemes.length; i++) {
            if (gSavedMemes[i].meme.id === thiscanvasId) {
                existingCanvasIdx = i;
                break;
            };
        };
    };

    if (existingCanvasIdx) {
        gSavedMemes.splice(existingCanvasIdx, 1, dataToSave);
    } else {
        gSavedMemes.push(dataToSave);
    };
    saveToLocalStorage(KEY, gSavedMemes);
}