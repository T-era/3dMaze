/// <reference path="../../../lib/jquery/jquery.d.ts" />

module Mz {
  export class EventMarker {
    dom :JQuery;
    events :Event[];
    startMarker :JQuery;
    goalMarker :JQuery;
    eventMarker :JQuery;

    constructor(events :Event[]) {
      this.events = events;
      this.startMarker = $('<div>').addClass('Start');
      this.goalMarker = $('<div>').addClass('Goal');
      this.eventMarker = $('<div>').addClass('Normal');
      this.dom = $('<div>')
          .addClass("MzRoom_EventMarker")
          .append(this.startMarker)
          .append(this.goalMarker)
          .append(this.eventMarker);
    }
    setStart(flag :boolean) {
      this.startMarker.text(flag ? 'S': '');
    }
    setGoal(flag :boolean) {
      this.goalMarker.text(flag ? 'G': '');
    }
    setEvent(list :any[]) {
      this.eventMarker.text(list.length);
    }
  }
}
