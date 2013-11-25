/**
 * Wrapper for the geolocation API in Cordova.
 * The geolocation object provides access to location based data on the device's GPS sensor or inferred from network signals.
 *
 * @author Brian Milton
 * @version 1.0.0
 *
 * Important information
 * ---------------------
 * Device object:
 *      model : The device's model name (DOMString).
 *      cordova : The verison of Cordova running on the device (DOMString).
 *      platform : The device's operating system name (DOMString).
 *      uuid : The device's Universally Unique Identifier (DOMString).
 *      verison : The device's operating system version (DOMString).
 *      name (deprecated) : The device's model name (DOMString).
 */

define(["troopjs/component/widget"], function geolocationWrapper(Widget) {

    var DEVICE_READY = false;
    var WATCH_ID;

    function geoSuccess(location) {
        var me = this;
        location.isSuccess = true;
        me.publish("cordova/geoUpdate",location);
    }

    function geoFailure(error) {
        var me = this;
        error.isSuccess = false;
        me.publish("cordova/geoUpdate",error);
    }
    return Widget.extend({

        "dom:memory/deviceready" : function deviceReady() {
            var me = this;
            me[DEVICE_READY] = true;
        },

        "hub:memory/cordova/getCurrentPosition" : function getCurrentPosition(geoOptions) {
            var me = this;
            if(me[DEVICE_READY]){

                return navigator.geolocation.getCurrentPosition(function(position) {
                    position.isSuccess = true;
                    return position;
                }, function(error) {
                    error.isSucces = false;
                    return error;
                }, geoOptions)
            } else {
                return false;
            }
        },

        "hub:memory/cordova/watchPosition" : function watchLocation(geoOptions) {
            var me = this;
            if(me[DEVICE_READY]) {
                me[WATCH_ID] = navigator.geolocation.watchPosition(geoSuccess,geoFailure,geoOptions);
                return true;
            } else {
                return false;
            }
        },

        "hub:memory/cordova/stopWatchPosition" : function clearLocation() {
            var me = this;
            if(me[DEVICE_READY]) {
                navigator.geolocation.clearWatch(me[WATCH_ID]);
                return true;
            } else {
                return false;
            }
        }
    });

});