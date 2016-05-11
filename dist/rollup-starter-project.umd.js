(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.rollupStarterProject = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers;

  /**
   * # Actions
   * 
   * Example:
   * ```
   *  "actions": [ // A list of action objects
   *     {
   *         "name": "On", // Display name for the action
   *         "description": "Turns the light on.", // Optional description
   *         "id": "turn_light_on", // A unique id
   *         "updateState": "on", // Updates state on function call
   *         "schedule": "at 9:00am", // Optional scheduling using later.js
   *         "event": "Light turned on", // Optional event to emit when called.
   *         "function": function () {
   *             // The implementation of the action.
   *             LED.high();
   *             console.log("Light on.");
   *         }
   *     }
   *   ]
   * ```
   */

  var _$1 = require('underscore');
  var later = require('later');

  var Actions = {
    /**
     * Registers actions and returns a new actions object
     * @param {Object} config  
     * @return     A new grow instance.
    */

    register: function register(config) {
      this.actions = [];
      this.scheduledActions = [];

      for (var key in config) {
        // Check top level thing model for actions.
        if (key === 'actions') {
          for (var action in config[key]) {
            this.actions.push(config[key][action]);
          }
        }
      }

      for (var action in this.actions) {
        var actionId = this.actions[action].id;
        var action = this.getActionByID(actionId);
        if (!_$1.isUndefined(action)) {
          this.startAction(actionId);
        }
      }

      return this;
    },


    /**
     * Get action object based on the action id
     * @param {String} actionId  The id of the action object you want.
     * @returns {Object}
     */
    getActionByID: function getActionByID(actionId) {
      for (var i = this.actions.length - 1; i >= 0; i--) {
        if (this.actions[i].id === actionId) {
          return this.actions[i];
        }
      }
    },


    /**
     * Calls a registered action, emits event if the the action has an 'event'
     * property defined. Updates the state if the action has an 'updateState'
     * property specified.
     * @param      {String}  actionId The id of the action to call.
     * @param      {Object}  options Optional, options to call with the function.
    */
    callAction: function callAction(actionId, options) {
      var action = this.getActionByID(actionId);

      if (!_$1.isUndefined(options)) {
        return action.function(options);
      } else {
        return action.function();
      }
    },


    /**
     * Starts a reoccurring action if a schedule property is defined.
     * @param {Object} action An action object.
     */
    startAction: function startAction(action) {
      var meta = this.getActionByID(action);
      if (!_$1.isUndefined(meta.schedule)) {
        var schedule = later.parse.text(meta.schedule);
        var scheduledAction = later.setInterval(function () {
          this.callAction(action);
        }, schedule);
        this.scheduledActions.push(scheduledAction);
        return scheduledAction;
      }
    }
  };

  /**
   * # Events
   * Events are functions that return a value to emit as event or doesn't return 
     (in which case no event is emitted). 

   * NOTE: Events currently run like jobs and so REQUIRE a schedule property. 
     This is not nice, let's rewrite.
   
   * The "events" property of the config object takes a list of event objects. For example:

          "events": [
              {
                  "name": "Light data",
                  "id": "light_data",
                  "schedule": "every 1 second",
                  "function": function () {
                      // function should return the event to emit when it should be emited.
                      return lightSensor.value;
                  }
              }
          ]
   */

  var _$2 = require('underscore');
  var later$1 = require('later');

  var Events = {
    /**
     * Register a new events object.
     * @param {Object} config  
     * @return     A new events object
    */

    register: function register(config) {
      this.events = [];
      this.scheduledEvents = [];

      for (var key in config) {
        // Check top level thing model for events.
        if (key === 'events') {
          for (var event in config[key]) {
            this.events.push(config[key][event]);
          }
        }
      }

      for (var event in this.events) {
        var eventId = this.events[event].id;
        var event = this.getEventByID(eventId);
        if (!_$2.isUndefined(event)) {
          this.startEvent(eventId);
        }
      }

      return this;
    },


    // THOUGHT: since this is the same for actions an events, could it just be 'getComponentById'?
    /**
     * Get event object based on the event id
     * @param {String} eventId  The id of the event object you want.
     * @returns {Object}
     */
    getEventByID: function getEventByID(eventId) {
      for (var i = this.events.length - 1; i >= 0; i--) {
        if (this.events[i].id === eventId) {
          return this.events[i];
        }
      }
    },


    /**
     * Calls a registered event, emits event if the the event has an 'event'
     * property defined. Updates the state if the event has an 'updateState'
     * property specified.
     * @param      {String}  eventId The id of the event to call.
     * @param      {Object}  options Optional, options to call with the function.
    */
    callEvent: function callEvent(eventId, options) {
      var event = this.getEventByID(eventId);

      if (!_$2.isUndefined(options)) {
        return event.function(options);
      } else {
        return event.function();
      }
    },


    /**
     * Starts a reoccurring event if a schedule property is defined.
     * @param {Object} event An event object.
     */
    startEvent: function startEvent(event) {
      var meta = this.getEventByID(event);
      if (!_$2.isUndefined(meta.schedule)) {
        var schedule = later$1.parse.text(meta.schedule);
        var scheduledEvent = later$1.setInterval(function () {
          this.callEvent(event);
        }, schedule);
        this.scheduledEvents.push(scheduledEvent);
        return scheduledEvent;
      }
    }
  };

  var _ = require('underscore');

  var Thing =
  /**
   * Constructs a new thing object.
   * @param {Object} config  
   * @return     A new events object
  */
  function Thing(config) {
    babelHelpers.classCallCheck(this, Thing);

    if (!config) {
      throw new Error('Thing.js requires an config object.');
    } else {
      _.extend(this, config);
    }

    try {
      // We need the methods defined in the config, so we _.extend state.json.
      var state = require('./state.json');
      _.extend(this, state);
    } catch (err) {}
    // Do nothing.


    // Register actions events
    this.actions = Actions.register(config);
    this.events = Events.register(config);
  };

  ;

  return Thing;

}));
//# sourceMappingURL=rollup-starter-project.umd.js.map