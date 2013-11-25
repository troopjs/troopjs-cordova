/**
 * Wrapper for the Capture API in Cordova.
 * Provides access to the device's audio, image, and video capture capabilities.
 *
 * @author Brian Milton
 * @version 1.0.0
 *
 * Important Information
 * ---------------------
 * Method mapping:
 * capture.captureAudio --> publish("cordova/captureAudio", [audioOptions]) = Returns a MediaFile array with captured audio clip information.
 * capture.captureImage --> publish("cordova/captureImage", [imageOptions]) = Returns a MediaFile array with captured image information.
 * capture.captureVideo --> publish("cordova/captureVideo", [videoOptions]) = Returns a MediaFile array with captured video clip information.
 * capture.supportedImageModes --> publish("cordova/captureConfigdata") = Returns an array with supported image modes.
 */

define(["troopjs/component/widget"],function captureWrapper(Widget) {"use strict";

    var DEVICE_READY = false;

    function captureSuccess(mediaFiles) {
        /* Returns an object containing media files with the following fields:
         * isSuccess : true
         * mediaFiles : an array of MediaFile objects with the following structure per object:
         *      name : The name of the file, without path information. (DOMString)
         *      fullPath : The full path of the file, including the name. (DOMString)
         *      type : The file's MIME type (DOMString)
         *      lastModifiedDate : The date and time when the file was last modified. (Date)
         *      size : The size of the file, in bytes. (Number)
         *      getFormatData(successCallback, [errorCallback]) : Retrieves the format information of the media file (Function)
         *          MediaFileData object returned by getFormatData:
         *              codecs : The actual format of the audio and video content. (DOMString)
         *              bitrate : The average bitrate of the content. The value is zero for images. (Number)
         *              height : The height of the image or video in pixels. The value is zero for audio clips. (Number)
         *              width : The width of the image or video in pixels. The value is zero for audio clips. (Number)
         *              duration : The length of the video or sound clip in seconds. The value is zero for images. (Number)
         */
        var returnObj = {};
        returnObj.mediaFiles = mediaFiles;
        returnObj.isSuccess = true;
        return mediaFiles;
    }

    function captureError(error) {
        /* Returns an error object with the following fields:
         * isSuccess : false
         * code : Returns one of the following error codes-
         *          CAPTURE_INTERNAL_ERR : Camera or microphone failed to capture image or sound.
         *          CAPTURE_APPLICATION_BUSY : The camera or audio capture application is serving another request.
         *          CAPTURE_INVALID_ARGUMENT : Invalid use of API (E.g. the value of 'limit' is less than one).
         *          CAPTURE_NO_MEDIA_FILES : The user exits the camera or audio capture application before capturing anything.
         *          CAPTURE_NOT_SUPPORTED : The requested capture operation is not supported on this device.
         */
        error.isSuccess = false;
        return error;
    }

    return Widget.extend({
        "dom:memory/deviceready": function() {
            var me = this;
            me[DEVICE_READY] = true;
        },

        "hub:memory/cordova/captureAudio" : function(audioOptions) {
            var me = this;
            if (me[DEVICE_READY]) {
                /* Capture options fields and defaults:
                 *    limit : The maximum amount of audio clips the device user can record in a single capture
                 *            operation. The value must be greater than or equal to 1. Default is 1.
                 *    duration : The maximum duration of an audio sound clip, in seconds. Default is no limit.
                 */
                // Start the audio recorder application and return information about captured audio clip files.
                return navigator.device.capture.captureAudio(captureSuccess,captureError,audioOptions);
            } else {
                return false;
            }
        },

        "hub:memory/cordova/captureImage" : function (imageOptions) {
            var me = this;
            if(me[DEVICE_READY]) {
                /* Capture options fields and defaults:
                 *    limit : The maximum amount of audio clips the device user can record in a single capture
                 *            operation. The value must be greater than or equal to 1. Default is 1.
                 *    duration : The maximum duration of a video clip, in seconds. Default is no limit.
                 */
                // Start the camera application and return information about captured image files.
                return navigator.device.capture.captureImage(captureSuccess,captureError,imageOptions);
            } else {
                return false;
            }
        },

        "hub:memory/cordova/captureVideo" : function (videoOptions) {
            var me = this;
            if(me[DEVICE_READY]) {
                /* Capture options fields and defaults:
                 *    limit : The maximum amount of audio clips the device user can record in a single capture
                 *            operation. The value must be greater than or equal to 1. Default is 1.
                 */
                // Start the video recorder application and return information about captured video clip files.
                return navigator.device.cpature.captureVideo(captureSuccess,captureError,videoOptions);
            } else {
                return false;
            }
        },

        "hub:memory/cordova/captureConfigData" : function() {
            /* Presently, no device supports this, but it might appear in a future update.
             * It returns an array which encapsulates a set of media capture parameters that a device supports.
             * MIME types should adhere to RFC2046 standards for example:
             *      video/3gpp
             *      video/quicktime
             *      image/jpeg
             *      audio/amr
             *      audio/wav
             *
             * Properties:
             *      type : The ASCII-encoded lowercase string representing the media type (DOMString)
             *      height : The height of the image or video in pixels. The value is zero for sound clips. (Number)
             *      width : The width of the image or video in pixels. The value is zero for sound clips. (Number)
             */
             if(me[DEVICE_READY]) {
                 return navigator.device.capture.supportedImageModes;
             } else {
                 return false;
             }
        }
    });

});