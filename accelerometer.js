/**
 * Wrapper for accelerometer API in Cordova.
 * The accelerometer captures device motion in the x, y and z directions.
 *
 * @author Brian Milton
 * @version 1.0.0
 *
 * Important information
 * ---------------------
 * Method mapping:
 * accelerometer.getCurrentAcceleration --> publish("cordova/peekAccel") = returns acceleration object.
 * accelerometer.watchAcceleration --> publish("cordova/watchAccel") = triggers acceleration objects to be published on cordova/accelUpdate.
 * accelerometer.clearWatch --> publish("cordova/stopAccel") = cancels regular publishing of acceleration objects on cordova/accelUpdate.
 *
 * Arguments:
 * Success and error callbacks are handled within the wrapper and not required.
 * accelerometerOptions are optional and, if being provided, should be published to cordova/watchAccel.
 *
 */

define([
    "troopjs/component/widget"], function accelerometerWrapper(Widget, $, when) {"use strict";

    var DEVICE_READY = false;
    var WATCH_ID;

    function accelerometerSuccess(acceleration) {
        /* The acceleration object:
         * x : Amount of acceleration on the x-axis in m/s^2. (Number)
         * y : Amount of acceleration on the y-axis in m/s^2. (Number)
         * z : Amount of acceleration on the z-axis in m/s^2. (Number)
         * timestamp : Creation timestamp in milliseconds. (DOMTimeStamp)
         */

        // Since the acceleration object doesn't contain it, let's add a flag to say it's a success. Mainly doing this
        // because I want to use the same topic for errors as well. Makes sense at the moment...
        acceleration.isSuccess = true;
        this.publish("cordova/accelUpdate",acceleration);
    }

    function accelerometerError() {
        // The error doesn't return an acceleration object, so to make it more standardised, let's create one:
        var acceleration = {
            isSuccess : false  // All we really need to know is that it failed. Sadly, the Cordova API doesn't pass an error object.
        };
        this.publish("cordova/accelUpdate", acceleration);
    }

    return Widget.extend({

        "dom:memory/deviceready": function onDeviceReady() {
            var me = this;
            me[DEVICE_READY] = true;
        },

        "hub:memory/cordova/watchAccel": function monitorAccelerometer(accelerometerOptions) {
            /* A note about default options
             * There is only one parameter which must be passed in an object thusly:
             * { frequency : 10000  }
             * This tells Cordova how often to trigger the polling of the accelerometer. Default is 10000 milliseconds
             * which is 10 seconds. This is quite a long interval. Be aware if calling this and needing more frequent
             * updates to the topic.
             */
            var me = this;
            if(me[DEVICE_READY]) {
                me[WATCH_ID] = navigator.accelerometer.watchAcceleration(accelerometerSuccess, accelerometerError, accelerometerOptions);
                return true;
            } else {
                return false;
            }
        },

        "hub:memory/cordova/stopAccel": function ignoreAccelerometer() {
            if(me[DEVICE_READY]) {
                var me = this;
                navigator.accelerometer.clearWatch(me[WATCH_ID]);
                return true;
            } else {
                return false;
            }
        },

        "hub:memory/cordova/peekAccel": function peekAccelerometer() {
            /*
            This will not start observing and will only return an acceleration object on success or a false on error.
             */
            if(me[DEVICE_READY]) {
                return navigator.getCurrentAcceleration(function(acceleration) {
                        // On success, return the acceleration object.
                        acceleration.isSuccess = true;
                        return acceleration;
                    }, function(error) {
                        // On error, return false until I have chance to do it more gracefully with error logging and shiznit.
                        var errorObj = error || {};
                        errorObj.isSuccess = false;
                        return errorObj;
                    })
            } else {
                // Device not ready just return false.
                return false;
            }
        }

    })
});