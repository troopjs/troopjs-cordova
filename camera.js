/**
 * Wrapper for the camera API in Cordova.
 * The camera object provides access to the device's default camera application.
 *
 * @author Brian Milton
 * @version 1.0.0
 *
 * Important information
 * ---------------------
 * Method mapping:
 * camera.getPicture --> publish("cordova/getPicture"[,cameraOptions]) = returns either a base64 string or a url to the image.
 * camera.cleanup --> publish("cordova/cameraCleanup") = clears intermediate image data on iOS only.
 *
 * cameraOptions data object parameters:
 *  - quality : 0 - 100
 *  - destinationType : Camera.DestinationType.DATA_URL / Camera.DestinationType.FILE_URI / Camera.DestinationType.BASE_URI
 *
 */

define(["troopjs/component/widget"], function cameraWrapper(Widget){"use strict";

    var DEVICE_READY = false;

    function onSuccess(imageData) {

        // Depending on options and context, imageData will return a base64 encoded string with the image data or a URL
        // to the image file in local storage.

        var cameraResult = {};
        // You're either getting an image/url or cleaning up... Either way, you should know what to expect in imageData!
        cameraResult.imageData = imageData || "Camera cleanup success.";
        cameraResult.isSuccess = true;
        return cameraResult;
    }

    function onError(message) {
        var cameraResult = {};
        cameraResult.message = message;
        cameraResult.isSuccess = false;
        return message;
    }

    return Widget.extend({

        "dom:memory/deviceready" : function deviceReady() {
            var me = this;
            me.DEVICE_READY = true;
        },

        "hub:memory/cordova/getPicture" : function getPicture(cameraOptions) {
            var me = this;
            if (me[DEVICE_READY]) {
                return navigator.camera.getPicture(onSuccess,onError,cameraOptions);
            } else {
                return false;
            }
        },

        "hub:memory/cordova/cameraCleanup" : function cameraCleanup() {
            // This is only supported on iOS. Other platforms won't work.
            var me = this;
            if(me[DEVICE_READY]) {
                return navigator.camera.cleanup(onSuccess,onError);
            } else {
                return false;
            }
        }

    });

});