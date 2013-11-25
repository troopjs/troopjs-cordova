/**
 * Wrapper for the connection API in Cordova.
 * The connection object, exposed via navigator.connection, provides information about the device's cellular and wifi connection.
 *
 * @author Brian Milton
 * @version 1.0.0
 *
 * Important information
 * ---------------------
 * Method mapping:
 * connection.type --> publish("cordova/connectionStatus") = Returns the current status of the network.
 */

define(["troopjs/component/widget"],function connectionWrapper(Widget) {"use strict";

    var DEVICE_READY = false;

    return Widget.extend({
        "dom:memory/deviceready" : function deviceReady() {
            var me = this;
            me[DEVICE_READY] = true;
        },

        "hub:memory/cordova/connectionStatus" : function connectionState() {
            var me = this;
            if(me[DEVICE_READY]) {
                // Possible return values:
                // Connection.UNKNOWN  --> Unknown connection type.
                // Connection.ETHERNET --> Ethernet connection.
                // Connection.WIFI     --> Wireless connection.
                // Connection.CELL_2G  --> Cellular 2G connection.
                // Connection.CELL_3G  --> Cellular 3G connection.
                // Connection.CELL_4G  --> Cellular 4G connection.
                // Connection.CELL     --> Generic cellular connection (iOS & Windows always reports this for cell).
                // Connection.NONE     --> No network connection.
                return navigator.connection.type;
            } else {
                return false;
            }
        }
    });
});