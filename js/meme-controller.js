'use strict';

var gElCanvas = document.querySelector('#canvas');
var gCtx = gElCanvas.getContext('2d');
var gIsTextSelected = false;
var gIsStckrSelected = false;
var gIskeywordsExpanded = false;
var gDragging = {
    isMousDown: false,
    lastXpos: null,
    lastYpos: null
}

//******************************************************************************************************************************* */

function renderGallery(imgs) {
    var elGallery = document.querySelector('.imgs-grid');
    var strHtmls = imgs.map(img => {
        var url = img.url.slice(1, img.length);
        return `<img class="meme-img" src="${url}" id="${img.id}" alt="meme-img" onclick="selectImg('${img.id}')">`
    });
    elGallery.innerHTML = ''
    elGallery.innerHTML = strHtmls.join('');
}

function selectImg(imgId) {
    createMemeObj(imgId);
    renderCanvas();
    togglePages('editor');
    clearSearchInput();
    const imgs = getImgs();
    renderGallery(imgs);
}

function selectStckr(stckrId, elStckr) {
    var memeObj = getMemeObj();
    if (memeObj.stckrs.length === 10) return;
    createStckr(stckrId, elStckr);
    renderCanvas();
}

function togglePages(page) {

    let elGallery = document.querySelector('.main-container-gallery');
    let elEditor = document.querySelector('.editor-container');
    let elMyMemes = document.querySelector('.my-memes-container');
    let elGalleryBtn = document.querySelector('.button-gallery');
    let elEditorBtn = document.querySelector('.button-editor');
    let elMyMemesBtn = document.querySelector('.button-my-memes');

    if (page === 'gallery') {
        elGallery.style.display = 'block';
        elEditor.style.display = 'none';
        elMyMemes.style.display = 'none';
        elGalleryBtn.classList.add('selected');
        elEditorBtn.classList.remove('selected');
        elMyMemesBtn.classList.remove('selected');
        gIsStckrSelected = false;
        gIsTextSelected = false;
    } else if (page === 'editor') {
        elGallery.style.display = 'none';
        elEditor.style.display = 'flex';
        elMyMemes.style.display = 'none';
        elGalleryBtn.classList.remove('selected');
        elEditorBtn.classList.add('selected');
        elMyMemesBtn.classList.remove('selected');
        gIsStckrSelected = false;
        gIsTextSelected = false;
    } else {
        elGallery.style.display = 'none';
        elEditor.style.display = 'none';
        elMyMemes.style.display = 'flex';
        elGalleryBtn.classList.remove('selected');
        elEditorBtn.classList.remove('selected');
        elMyMemesBtn.classList.add('selected');
        gIsStckrSelected = false;
        gIsTextSelected = false;
        renderMyMemes();
    };
}

function expandKeywords(elBtn) {

    document.querySelector('.search-words').classList.toggle('expand')
    document.querySelector('.gellery-filter').classList.toggle('expand')


    if (!gIskeywordsExpanded) {
        elBtn.innerText = 'less';
        renderKeywords('full');
        gIskeywordsExpanded = true;
    } else {
        elBtn.innerText = 'more';
        renderKeywords('less');
        gIskeywordsExpanded = false;
    };
}

function renderKeywords(val) {

    let keywords = getKeywords();
    let quantity = (val === 'less') ? 6 : 11
    let strHtmls = [];

    for (let word in keywords) {

        let fontSize = .4 + (keywords[word] / 5) + 'rem';
        let str = `<p style="font-size: ${fontSize}" onclick="submitSearch('${word}'); filterByText('${word}')">${word}</p>`
        strHtmls.push(str)
    };
    let finalStr = strHtmls.slice(0, quantity);
    document.querySelector('.search-words').innerHTML = finalStr.join('')
}

function renderCanvas() {

    const memeObj = getMemeObj();
    const imgToDraw = document.getElementById(memeObj.selectedImgId);

    if (!memeObj.canvasW) {
        seCanvasSize(imgToDraw.width, imgToDraw.height);
    }

    gElCanvas.width = memeObj.canvasW
    gElCanvas.height = memeObj.canvasH

    gCtx.drawImage(imgToDraw, 0, 0, gElCanvas.width, gElCanvas.height);

    if (gIsTextSelected) {

        let line = memeObj.lines[memeObj.selectedLineIdx];

        gCtx.font = (line.size + 'px ' + line.font);
        let rectW = gCtx.measureText(line.txt).width + 15;
        let rectH = line.size + 5;
        let rectX = line.posX - (rectW / 2);
        let rectY = line.posY - (rectH / 2);

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
    }

    if (gIsStckrSelected) {

        let stckr = memeObj.stckrs[memeObj.selectedStckrIdx];

        let rectX = stckr.posX;
        let rectY = stckr.posY;
        let rectW = stckr.width;
        let rectH = stckr.height;

        gCtx.beginPath();
        gCtx.rect(rectX, rectY, rectW, rectH);
        gCtx.strokeStyle = "#FF0000";
        gCtx.setLineDash([6]);
        gCtx.strokeRect(rectX, rectY, rectW, rectH)
        gCtx.fillStyle = "#00000040";
        gCtx.fillRect(rectX, rectY, rectW, rectH);
        gCtx.setLineDash([]);

    };

    if (memeObj.stckrs.length) {

        memeObj.stckrs.map(stckr => {

            let stckrId = 'hidden' + stckr.id
            let stckrToDraw = document.getElementById(stckrId);

            gCtx.shadowColor = "rgba(0, 0, 0, 0.657)";
            gCtx.shadowBlur = 3;
            gCtx.shadowOffsetX = 1;
            gCtx.shadowOffsetY = 1;
            gCtx.drawImage(stckrToDraw, stckr.posX, stckr.posY, stckr.width, stckr.height);

        });
    };

    if (memeObj.lines.length) {
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

function onAddTextLine() {

    const memeObj = getMemeObj();

    if (gIsTextSelected) {
        gIsTextSelected = false;
        clearLineIdx();
        document.querySelector('.text-input').value = '';
        renderCanvas();
    };

    clearStckrIdx();
    gIsStckrSelected = false;

    var posX = gElCanvas.width / 2
    var posY;

    if (memeObj.lines.length === 0) posY = 30
    if (memeObj.lines.length === 1) posY = (gElCanvas.height - 30)
    if (memeObj.lines.length >= 2) posY = (gElCanvas.height / 2)

    const font = document.querySelector('.select-font').value

    createTextLine(posX, posY, font);
    var elTextInput = document.querySelector('.text-input')
    elTextInput.placeholder = '';
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
    document.querySelector('.text-input').focus();
    gIsTextSelected = true;
    gIsStckrSelected = false;
    renderCanvas();
}

function onDeleteElement() {
    if (!gIsTextSelected && !gIsStckrSelected) return;

    if (gIsTextSelected) {

        deleteLine();
        gIsTextSelected = false;
        clearTextInput();
    } else {
        deleteStckr();
        gIsStckrSelected = false;
    }
    renderCanvas();
}

function onChangeSize(diff) {
    if (!gIsTextSelected && !gIsStckrSelected) return;

    if (gIsTextSelected) {
        updateFontSize(diff);
    } else {
        updateStckrSize(diff);
    };
    renderCanvas();
}

function onChangeFont(font) {
    if (!gIsTextSelected) return;
    updateFont(font);
    renderCanvas();
}

function onTextAlign(align) {
    if (!gIsTextSelected) return;
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
    let elStckrsSection = document.querySelector('.stickers-section');
    let strHtmls = stckrs.map(stckr => {
        let url = stckr.url.slice(1, stckr.length);
        return `<img src="${url}" alt="sticker" onclick="selectStckr('${stckr.id}', this)">`
    });
    elStckrsSection.innerHTML = strHtmls.join('');
}

function renderHiddenStckrs(stckrs) {
    let strHtmls = stckrs.map(stckr => {
        let id = 'hidden' + stckr.id;
        let url = stckr.url.slice(1, stckr.length);
        return `<img src="${url}" id="${id}" alt="sticker">`
    });
    document.querySelector('.hidden-stickers').innerHTML = strHtmls.join('');
}

function onCanvasClick(ev) {

    const clickX = ev.offsetX;
    const clickY = ev.offsetY;

    gDragging.isMousDown = true;
    gDragging.lastXpos = clickX;
    gDragging.lastYpos = clickY;


    var memeObj = getMemeObj();

    // check if clicked on a line or clear line selected
    if (memeObj.lines.length) {
        for (var idx = 0; idx < memeObj.lines.length; idx++) {

            var line = memeObj.lines[idx];

            gCtx.font = line.size + 'px ' + line.font;
            const width = gCtx.measureText(line.txt).width;
            const height = line.size;

            if (clickX >= line.posX - (width / 2) &&
                clickX <= line.posX + (width / 2) &&
                clickY >= line.posY - (height / 2) &&
                clickY <= line.posY + (height / 2)) {

                if (memeObj.selectedLineIdx === idx) return;

                setLineIdx(idx);
                gIsTextSelected = true;
                clearStckrIdx();
                gIsStckrSelected = false;
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
                };
            };
        };
    };
    // check if ckicked on a sticker or clear sticker selected
    if (memeObj.stckrs.length) {
        for (var idx = 0; idx < memeObj.stckrs.length; idx++) {
            var stckr = memeObj.stckrs[idx];

            if (clickX <= stckr.posX + stckr.width &&
                clickX >= stckr.posX &&
                clickY <= stckr.posY + stckr.height &&
                clickY >= stckr.posY) {

                setStckrIdx(idx);
                gIsStckrSelected = true;
                clearLineIdx();
                gIsTextSelected = false;
                renderCanvas();
                return;
            } else {
                if (gIsStckrSelected) {
                    gIsStckrSelected = false;
                    clearStckrIdx();
                    renderCanvas();
                };
            };
        };
    };
}

function onMouseUp() {
    gDragging.isMousDown = false;
    gDragging.lastXpos = null;
    gDragging.lastYpos = null;
}

function onDrag(ev) {
    if (!gDragging.isMousDown) return;

    const currXpos = ev.offsetX
    const currYpos = ev.offsetY
    const diffX = (currXpos - gDragging.lastXpos);
    const diffY = (currYpos - gDragging.lastYpos);
    const memeObj = getMemeObj();

    if (gIsTextSelected) {

        const line = memeObj.lines[memeObj.selectedLineIdx];

        gCtx.font = line.size + 'px ' + line.font;
        const width = gCtx.measureText(line.txt).width;
        const height = line.size;

        if (gDragging.lastXpos >= line.posX - (width / 2) &&
            gDragging.lastXpos <= line.posX + (width / 2) &&
            gDragging.lastYpos >= line.posY - (height / 2) &&
            gDragging.lastYpos <= line.posY + (height / 2)) {

            updateLinePos(line, diffX, diffY);
            gDragging.lastXpos = currXpos;
            gDragging.lastYpos = currYpos;
            renderCanvas();
            return;
        };
    };
    if (gIsStckrSelected) {

        const stckr = memeObj.stckrs[memeObj.selectedStckrIdx];

        if (gDragging.lastXpos <= stckr.posX + stckr.width &&
            gDragging.lastXpos >= stckr.posX &&
            gDragging.lastYpos <= stckr.posY + stckr.height &&
            gDragging.lastYpos >= stckr.posY) {

            updateStckrPos(stckr, diffX, diffY);
            gDragging.lastXpos = currXpos;
            gDragging.lastYpos = currYpos;
            renderCanvas();
            return;
        };
    };
}

function clearTextInput() {
    document.querySelector('.text-input').value = '';
    document.querySelector('.text-input').placeholder = 'Add or select line to edit';
    document.querySelector('.text-input-block').style.display = 'block'
}

function setTextInput(txt) {
    document.querySelector('.text-input-block').style.display = 'none';
    document.querySelector('.text-input').value = txt;
}

function onDownloadCanvas(el) {
    var canvasUrl = gElCanvas.toDataURL();
    el.href = canvasUrl;
    el.download = 'my-meme.jpg'
}

function onShareCnavas() {
    gIsTextSelected = false;
    renderCanvas();
    shareToFb();
}

function onSaveCanvas() {
    gIsTextSelected = false;
    gIsStckrSelected = false;
    renderCanvas();
    saveCanvasToStorage(gElCanvas);
}

function onFilterText(ev, elSearch, input) {

    if (ev.key === 'Enter') {
        elSearch.blur();
        submitSearch(elSearch.value);
        return;
    }

    if (input === '') {
        const imgs = getImgs()
        renderGallery(imgs)
        return;
    }
    filterByText(input);
}

function clearSearchInput() {
    document.querySelector('.input-search').value = '';
}

function renderMyMemes() {
    const savedMemes = getSavedMemes();
    let elGallery = document.querySelector('.my-memes-grid')
    let strHtmls = savedMemes.map(savedMeme => {
        return `<img src="${savedMeme.thumbnail}" alt="meme-img" onclick="asignSavedMeme('${savedMeme.meme.id}')"></img>`
    });
    elGallery.innerHTML = strHtmls.join('');
}

function asignSavedMeme(savedMemeId) {
    const savedMemeIdx = getSavedMemeIdx(savedMemeId);
    const savedMemes = getSavedMemes();
    const savedMeme = savedMemes[savedMemeIdx].meme;
    assignMemeObj(savedMeme);
    togglePages('editor');
    renderCanvas();
}

function toggleNavModal() {
    let elMobileBtn = document.querySelectorAll('.mobile-button');
    Array.from(elMobileBtn).forEach(btn => {
        btn.classList.toggle('open');
    });
}