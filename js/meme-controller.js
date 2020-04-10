'use strict';

var gElCanvas = document.querySelector('#canvas');
var gCtx = gElCanvas.getContext('2d');
var gIsTextSelected = false;

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
    const rectW = gCtx.measureText(line.txt).width + 15;
    const rectH = line.size + 5;
    const rectX = line.posX - (rectW / 2);
    const rectY = line.posY - (rectH / 2);

    gCtx.beginPath();
    gCtx.rect(rectX, rectY, rectW, rectH);
    gCtx.strokeStyle = "#FF0000";
    gCtx.setLineDash([6]);
    gCtx.strokeRect(rectX, rectY, rectW, rectH)
    gCtx.fillStyle = "#00000040";
    gCtx.fillRect(rectX, rectY, rectW, rectH);
    gCtx.setLineDash([]);

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
    if (memeObj.lines.length > 1) {
        switch (lineIdx) {
            case null:
                lineIdx = 0
                break;
            case 0:
                lineIdx = 2
                break;
            case 2:
                lineIdx = 1
                break;
            case 1:
                lineIdx = 0
                break;
        }
    } else lineIdx = 0;

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

function onTextInputBlur(elTextInput) {
    if (gIsTextSelected) return;
    clearTextInput()
}

function onCanvasClick(ev) {

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
            selectText(line.txt);
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

function selectText(txt) {
    gIsTextSelected = true;
    setTextInput(txt)
    renderCanvas();
}

function clearTextInput() {
    document.querySelector('.text-input').value = '';
    document.querySelector('.text-input-block').style.display = 'block'
}

function setTextInput(txt) {
    document.querySelector('.text-input-block').style.display = 'none';
    document.querySelector('.text-input').value = txt;
}