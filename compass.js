/**
 * Wrapper for compass API in Cordova.
 * Obtains the direction that the device is pointing
 *
 * @author Brian Milton
 * @version 1.0.0
 *
 * Important information
 * ---------------------
 * Method mapping:
 * compass.getCurrentHeading --> publish("cordova/getCurrentHeading") =
 * compass.watchHeading --> publish("cordova/watchHeading") =
 * compass.clearWatch --> publish("cordova/stopHeading") =
 * compass.watchHeadingFilter (obsolete) --> Not supported
 * compass.clearWatchFilter (obsolete) --> Not supported
 *
 * Arguments:
 * Success and error callbacks are handled within the wrapper and not required.
 * accelerometerOptions are optional and, if being provided, should be published to cordova/watchHeading.
 *
 * Subscriptions:
 * This widget has a 'watch' function. Updates are published on the following topics:
 *      cordova/compassUpdate --> Provides a CompassHeading object as defined below.
 *          {
 *              magneticHeading : The heading in degrees from 0.359.99 at a single moment in time. (Number)
 *
 *              trueHeading : The heading relative to the geographic North Pole in degrees 0-359.99 at a single moment
 *                            in time. A negative value indicates that the true heading can't be determined. (Number)
 *
 *              headingAccuracy : The deviation in degrees between the reported heading and the true heading. (Number)
 *
 *              timestamp : The time at which this heading was determined. (Number - milliseconds)
 *          }
 *
 */

define([
    "troopjs/component/widget"], function compassWrapper(Widget) {"use strict";

    var DEVICE_READY = false;
    var WATCH_ID;

    function compassSuccess(compassHeading) {
        /* The acceleration object:
         * x : Amount of acceleration on the x-axis in m/s^2. (Number)
         * y : Amount of acceleration on the y-axis in m/s^2. (Number)
         * z : Amount of acceleration on the z-axis in m/s^2. (Number)
         * timestamp : Creation timestamp in milliseconds. (DOMTimeStamp)
         */

        // Since the acceleration object doesn't contain it, let's add a flag to say it's a success. Mainly doing this
        // because I want to use the same topic for errors as well. Makes sense at the moment...
        compassHeading.isSuccess = true;
        this.publish("cordova/compassUpdate",compassHeading);
    }

    function compassError(compassErrorObj) {
        /* The compassErrorObj contains a field with the error information. Since we're doing this over pub sub, we're
         * going to return a standard flag to show instantly that this is not successful.
         *
         * Error codes:
         * COMPASS_INTERNAL_ERR : there was a problem communicating with the internal compass.
         * COMPASS_NOT_SUPPORTED : Device doesn't support the compass.
         */
        compassErrorObj.isSuccess = false;
        this.publish("cordova/compassUpdate", compassErrorObj);
    }

    return Widget.extend({

        "dom:memory/deviceready": function onDeviceReady() {
            var me = this;
            me[DEVICE_READY] = true;
        },

        "hub:memory/cordova/watchHeading": function monitorCompass(compassOptions) {
            /* A note about default options
             * There is only two parameters which must be passed in an object thusly:
             * {
             *      frequency : How often to retrieve the compass heading in milliseconds (Number - Default: 100)
             *      filter : The change in degrees required to initiate a watchHeading success callback. (Number - Default: null)
             * }
             * This tells Cordova how often to trigger the polling of the accelerometer. Default is 10000 milliseconds
             * which is 10 seconds. This is quite a long interval. Be aware if calling this and needing more frequent
             * updates to the topic.
             */
            var me = this;
            if(me[DEVICE_READY]) {
                me[WATCH_ID] = navigator.compass.watchHeading(compassSuccess, compassError, compassOptions);
                return true;
            }
        },

        "hub:memory/cordova/stopHeading": function ignoreCompass() {
            var me = this;
            navigator.compass.clearHeading(me[WATCH_ID]);
            return true;
        },

        "hub:memory/cordova/getCurrentHeading": function getCurrentHeading() {
            /*
             This will not start observing and will only return an acceleration object on success or a false on error.
             */
            navigator.compass.getCurrentHeading(function(heading) {
                // On success, return the heading object.
                heading.isSuccess = true;
                return heading;
            }, function(error) {
                // On error, return the error object.
                error.isSuccess = false;
                return error;
            })
        }

    })
});