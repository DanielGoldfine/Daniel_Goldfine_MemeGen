'use strict';

var gElCanvas = document.querySelector('#canvas');
var gCtx = gElCanvas.getContext('2d');
var gIsTextSelected = false;
var gDragging = {
    isMousDown: false,
    lastXpos: null,
    lastYpos: null
}

//******************************************************************************************************************************* */

function renderGallery() {
    const imgs = getImgs();
    var elGallery = document.querySelector('.imgs-grid');
    var strHtmls = imgs.map(img => {
        var url = img.url.slice(1, img.length);
        return `<img class="meme-img" src="${url}" id="${img.id}" alt="meme-img" onclick="selectImg('${img.id}')">`
    })
    elGallery.innerHTML = strHtmls.join('');
}

function selectImg(imgId) {
    createMemeObj(imgId);
    renderCanvas();
    togglePages();
}

function togglePages() {
    document.querySelector('.editor-container').classList.toggle('display-none');
    document.querySelector('.main-container-gallery').classList.toggle('display-none');
    document.querySelector('.button-gallery').classList.toggle('selected');
    document.querySelector('.button-editor').classList.toggle('selected');
    
}

function renderCanvas() {

    const memeObj = getMemeObj();
    const imgIdName = '#' + memeObj.selectedImgId;
    const imgToDraw = document.querySelector(imgIdName);

    gCtx.drawImage(imgToDraw, 0, 0, gElCanvas.width, gElCanvas.height);

    if (gIsTextSelected) {
        renderCanvasSelectedText(memeObj);
        return;
    }

    if (memeObj.lines.length > 0) {
        memeObj.lines.map(line => {

            gCtx.lineWidth = '1';
            gCtx.strokeStyle = line.stroke;
            gCtx.fillStyle = line.fill;
            gCtx.textBaseline = "middle";
            gCtx.font = (line.size + 'px ' + line.font);
            gCtx.textAlign = line.align;
            gCtx.fillText(line.txt, line.posX, line.posY);
            gCtx.strokeText(line.txt, line.posX, line.posY);
        });
    };
}

function renderCanvasSelectedText(memeObj) {

    const line = memeObj.lines[memeObj.selectedLineIdx];

    gCtx.font = (line.size + 'px ' + line.font);
    var rectW = gCtx.measureText(line.txt).width + 15;
    var rectH = line.size + 5;
    var rectX = line.posX - (rectW / 2);
    var rectY = line.posY - (rectH / 2);

    if (line.align === 'left') rectX += (rectW / 2)
    if (line.align === 'right') rectX -= (rectW / 2)

    gCtx.beginPath();
    gCtx.rect(rectX, rectY, rectW, rectH);
    gCtx.strokeStyle = "#FF0000";
    gCtx.setLineDash([6]);
    gCtx.strokeRect(rectX, rectY, rectW, rectH)
    gCtx.fillStyle = "#00000040";
    gCtx.fillRect(rectX, rectY, rectW, rectH);
    gCtx.setLineDash([]);

    memeObj.lines.map(line => {

        gCtx.font = (line.size + 'px ' + line.font);
        gCtx.lineWidth = '1';
        gCtx.strokeStyle = line.stroke;
        gCtx.fillStyle = line.fill;
        gCtx.textBaseline = "middle";
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.posX, line.posY);
        gCtx.strokeText(line.txt, line.posX, line.posY);
    });
}

function onAddTextLine() {

    const memeObj = getMemeObj()

    if (gIsTextSelected) {
        if (memeObj.lines.length === 3) return;
        gIsTextSelected = false
        clearLineIdx()
        document.querySelector('.text-input').value = '';
        renderCanvas();
    }

    var posX = gElCanvas.width / 2
    var posY;

    switch (memeObj.lines.length) {
        case 0:
            posY = 30
            break;
        case 1:
            posY = (gElCanvas.height - 30)
            break;
        case 2:
            posY = (gElCanvas.height / 2)
            break;
        default:
            return;
    }

    const font = document.querySelector('.select-font').value
    var size;

    switch (font) {
        case 'impact':
            size = 40
            break;
        case 'helvetica':
            size = 50
            break;
        case 'ariel':
            size = 50
            break;
    }
    createTextLine(posX, posY, font, size);
    var elTextInput = document.querySelector('.text-input')
    elTextInput.focus();
}

function onDrawText(value, event, elTextInput) {

    if (event.key === 'Enter') {
        if (gIsTextSelected) {
            elTextInput.blur();
            return;
        }
        elTextInput.blur();
        clearTextInput()
        return
    }
    var memeObj = getMemeObj();

    if (gIsTextSelected) {
        memeObj.lines[memeObj.selectedLineIdx].txt = value;
    } else {
        memeObj.lines[memeObj.lines.length - 1].txt = value;
    }
    renderCanvas();
}

function onSwitchLine() {
    var memeObj = getMemeObj();
    if (memeObj.lines.length === 0) return;
    var lineIdx = memeObj.selectedLineIdx

    if (lineIdx === null) lineIdx = 0;
    else if (lineIdx === memeObj.lines.length - 1) lineIdx = 0;
    else lineIdx++


    document.querySelector('.select-font').value = memeObj.lines[lineIdx].font;
    setLineIdx(lineIdx);
    setTextInput(memeObj.lines[lineIdx].txt);
    gIsTextSelected = true;
    renderCanvas();
}

function onDeleteLine() {
    if (!gIsTextSelected) return;
    deleteLine();
    gIsTextSelected = false;
    clearTextInput();
    renderCanvas();
}

function onChangeFontSize(diff) {
    if (!gIsTextSelected) return;
    updateFontSize(diff);
    renderCanvas();
}

function onChangeFont(font) {
    if (!gIsTextSelected) return;
    updateFont(font);
    renderCanvas();
}

function onTextAlign(align) {
    updateTextAlign(align);
    renderCanvas();
}

function onChangeColor(val, color) {
    updateColor(val, color);
    renderCanvas();
}

function onTextInputBlur(elTextInput) {
    if (gIsTextSelected) return;
    clearTextInput()
}

function onScrollStickers(direction) {
    scrollStickers(direction);
    renderStickers();
}

function renderStickers() {

    const stckrs = getStckrsDspl()
    var elStckrsSection = document.querySelector('.stickers-section');
    var strHtmls = stckrs.map(stckr => {
    var url = stckr.url.slice(1, stckr.length);
    return `<img src="${url}" alt="sticker" onclick="selectStckr('${stckr.id}')">`
    });
    elStckrsSection.innerHTML = strHtmls.join('');
}

function selectStckr(id) {
    console.log(id)
}

function onCanvasClick(ev) {

    gDragging.isMousDown = true;
    gDragging.lastXpos = ev.offsetX;
    gDragging.lastYpos = ev.offsetY;

    const mX = ev.offsetX;
    const mY = ev.offsetY;
    var memeObj = getMemeObj();

    for (var idx = 0; idx < memeObj.lines.length; idx++) {

        var line = memeObj.lines[idx];

        gCtx.font = line.size + 'px ' + line.font;
        const width = gCtx.measureText(line.txt).width;
        const height = line.size;

        if (mX >= line.posX - (width / 2) && mX <= line.posX + (width / 2) &&
            mY >= line.posY - (height / 2) && mY <= line.posY + (height / 2)) {

            if (memeObj.selectedLineIdx === idx) return;

            setLineIdx(idx);
            gIsTextSelected = true;
            setTextInput(line.txt)
            renderCanvas();

            document.querySelector('.select-font').value = memeObj.lines[idx].font;
            return;
        } else {
            if (gIsTextSelected) {
                gIsTextSelected = false;
                clearLineIdx();
                renderCanvas();
                clearTextInput()
            }
        }
    };
}

function onMouseUp() {
    gDragging.isMousDown = false;
    gDragging.lastXpos = null;
    gDragging.lastYpos = null;
}

function onDrag(ev) {
    if (!gDragging.isMousDown || !gIsTextSelected) return;

    var currXpos = ev.offsetX
    var currYpos = ev.offsetY
    const memeObj = getMemeObj();
    const line = memeObj.lines[memeObj.selectedLineIdx];

    gCtx.font = line.size + 'px ' + line.font;
    const width = gCtx.measureText(line.txt).width;
    const height = line.size;

    if (gDragging.lastXpos >= line.posX - (width / 2) &&
        gDragging.lastXpos <= line.posX + (width / 2) &&
        gDragging.lastYpos >= line.posY - (height / 2) &&
        gDragging.lastYpos <= line.posY + (height / 2)) {

        const diffX = (currXpos - gDragging.lastXpos);
        const diffY = (currYpos - gDragging.lastYpos);

        updateLinePos(line, diffX, diffY);

        gDragging.lastXpos = currXpos;
        gDragging.lastYpos = currYpos;

        renderCanvas();
    };
}

function clearTextInput() {
    document.querySelector('.text-input').value = '';
    document.querySelector('.text-input-block').style.display = 'block'
}

function setTextInput(txt) {
    document.querySelector('.text-input-block').style.display = 'none';
    document.querySelector('.text-input').value = txt;
}

