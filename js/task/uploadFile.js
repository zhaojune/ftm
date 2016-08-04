/**
 * Created by june on 16/8/4.
 */

function uploadFile(){
    var formData = new FormData($( "#updateFileInfo" )[0]);
    $.ajax({
        url: 'http://localhost:63342/ftm/html/index.html' ,
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
            alert(returndata);
        },
        error: function (returndata) {
            alert(returndata);
        }
    });
}