/**
 * Wrapper for the events API in Cordova.
 * Cordova lifecycle events.
 *
 * @author Brian Milton
 * @version 1.0.0
 *
 * Important information
 * ---------------------
 * This routes all DOM events to the pubsub... However, it might not be necessary... Why not just use the DOM event?...
 * What we could do is trigger the pubsub on every event with some kind of generic object containing the event information...
 *
 * cordova/eventTrigger --> Returns an object with the information of the event triggered.
 *
 */
define(["troopjs/component/widget"],function cordovaEventsWrapper(Widget){"use strict";

    var DEVICE_READY = false;

    return Widget.extend({

        "dom:memory/deviceready" : function onDeviceReady() {
            var me = this;
            me[DEVICE_READY] = true;
            me.publish("cordova/deviceReady");
        },

        "dom:memory/pause" : function onPause() {
            this.publish("cordova/appPause")
        },

        "dom:memory/resume" : function onResume() {
            this.publish("cordova/appResume");
        },

        "dom:memory/online" : function onOnline() {
            this.publish("cordova/online");
        },

        "dom:memory/offline" : function onOffline() {
            this.publish("cordova/offline");
        },

        "dom:memory/backbutton" : function onBackKeyDown() {
            this.publish("cordova/backButton");
        },

        "dom:memory/batterycritical" : function onBatteryCritical(info) {
            /* info object:
             * level : The percentage of the battery (0 - 100) (Number)
             * isPlugged : A boolean that indicates whether the device is plugged in. (Boolean)
             */
            this.publish("cordova/batteryCritical",info);
        },

        "dom:memory/batterylow" : function onBatteryLow(info) {
            /* info object:
             * level : The percentage of the battery (0 - 100) (Number)
             * isPlugged : A boolean that indicates whether the device is plugged in. (Boolean)
             */
            this.publish("cordova/batteryLow",info);
        },

        "dom:memory/batterystatus" : function onBatteryStatus(info) {
            /* info object:
             * level : The percentage of the battery (0 - 100) (Number)
             * isPlugged : A boolean that indicates whether the device is plugged in. (Boolean)
             */
            this.publish("cordova/batteryStatusChanged",info);
        },

        "dom:memory/menubutton" : function onMenuKeyDown() {
            this.publish("cordova/menuKey");
        },

        "dom:memory/searchbutton" : function onSearchKeyDown() {
            this.publish("cordova/searchKey");
        },

        "dom:memory/startcallbutton" : function onStartCallKeyDown() {
            this.publish("cordova/startCallKey");
        },

        "dom:memory/endcallbutton" : function onEndCallKeyDown() {
            this.publish("cordova/endCallKey");
        },

        "dom:memory/volumedownbutton" : function onVolumeDownKeyDown() {
            this.publish("cordova/volumeDown");
        },

        "dom:memory/volumeupbotton" : function onVolumeUpKeyDown() {
            this.publish("cordova/volumeUp");
        }
    });

});