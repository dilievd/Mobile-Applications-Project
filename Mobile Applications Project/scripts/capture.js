var app = app || {};

(function(a) {
    function captureSuccess(mediaFiles) {
        var msg = mediaFiles.length + "image(s) captured";
        navigator.notification.alert(msg, null, 'Success!');
    }

    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Error!');
    }
    
    a.capture = {
        init:function() {
        },
        close:function() {            
        },
        captureImage:function() {
            navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 3});
        }
    };
}(app));