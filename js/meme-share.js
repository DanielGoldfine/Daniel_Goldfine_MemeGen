'use strict'

function shareToFb() {

    var uploadedImgB64 = gElCanvas.toDataURL("image/jpeg");

    var formData = new FormData();
    formData.append('img', uploadedImgB64);

    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(function (uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`, '_blank') 
    })
    .catch(function (err) {
        console.error(err)
    })
}