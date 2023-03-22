'use strict';

import {DateTime} from "luxon";
import {anIntegerWithPrecision} from "./random.js";

class ValidationError extends Error {
  #message;

  constructor(msg) {
    super(msg);
    this.#message = msg;
  }

  get message() {
    return this.#message;
  }
}

/**
 * A WebSocket handler to deal with weather subscriptions.
 */
export class WeatherHandler {
  #ws;
  #config;
  #name;
  #timeout;

  constructor(ws, config, name) {
    this.#ws = ws;
    this.#config = config;
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  /**
   * Handles incoming messages.
   * @param msg {{type:'subscribe'|'unsubscribe',target:'temperature'}}
   */
  onMessage(msg) {
    let json;
    try {
      json = this._validateMessage(msg);
    } catch (e) {
      this._send({error: e.message});
      return;
    }

    // @formatter:off
    switch (json.type) {
      case 'subscribe': this._onSubscribe(); break;
      case 'unsubscribe': this._onUnsubscribe(); break;
    }
    // @formatter:on
  }

  stop() {
    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }
  }

  start() {
    console.debug('New connection received', {handler: this.#name});
  }

  _validateMessage(msg) {
    if (!msg) {
      throw new ValidationError('Invalid inbound message');
    }
    const json = JSON.parse(msg);
    if (json.type !== 'subscribe' && json.type !== 'unsubscribe') {
      throw new ValidationError('Invalid message type');
    }
    if (json.target !== 'temperature') {
      throw new ValidationError('Invalid subscription target');
    }
    return json;
  }

  /**
   * Generates a random delay in milliseconds.
   * @return {number} Milliseconds
   * @private
   */
  _someMillis() {
    return anIntegerWithPrecision(2000, 0.2);
  }

  _sendTemperature() {
    const value = Math.random() * 30 + 15;
    this._send({type: 'temperature', dateTime: DateTime.now().toISO(), value})
  }

  _send(msg) {
    if (Math.random() > 0.01) {
      this.#ws.send(JSON.stringify(msg));
    } else {
      console.info('🐛 There\'s a bug preventing the message to be sent');
    }
  }

  _onSubscribe() {
    if (this.#timeout) {
      return;
    }

    console.debug('🌡  Subscribing to temperature');
    const callback = () => {
      this._sendTemperature();
      this.#timeout = setTimeout(callback, this._someMillis());
    };
    this.#timeout = setTimeout(callback, this._someMillis());
  }

  _onUnsubscribe() {
    if (!this.#timeout) {
      return;
    }
    clearTimeout(this.#timeout);
    this.#timeout = 0;
    this._send({ack: true});
  }
}
