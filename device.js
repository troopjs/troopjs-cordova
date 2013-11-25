/**
 * Wrapper for the device API in Cordova.
 * The connection object describes the device's hardware and software.
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

define(["troopjs/component/widget"],function deviceWrapper(Widget) {"use strict";

    var DEVICE_READY = false;

    return Widget.extend({

        "dom:memory/deviceready" : function deviceReady() {
            var me = this;
            me[DEVICE_READY] = true;
        },

        "hub:memory/cordova/deviceInfo" : function deviceInformation() {
            var me = this;
            if(me[DEVICE_READY]) {
                return window.device;
            } else {
                return false;
            }
        }

    })

});