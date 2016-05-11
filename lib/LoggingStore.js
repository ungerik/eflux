/*eslint no-unused-vars:0 */

import Store from "./Store";

export default class LoggingStore extends Store {
	constructor(name, ...dispatchers) {
		super(name, ...dispatchers);
		this.logger = console;
	}

	onRegister(key) {}
	onUnregister(key) {}

	onSetStateIsBusy(newState) {
		this.logger.warn(this.name + ".SetStateIsBusy", newState);
	}

	onBeforeStateChange(oldState, newState) {
		this.logger.log(this.name + ".BeforeStateChange", oldState, newState);
	}

	onAfterStateChange(oldState, newState) {
		this.logger.log(this.name + ".AfterStateChange", oldState, newState);
	}

	onBeforeCallback(oldState, newState) {
		this.logger.log(this.name + ".BeforeCallback", oldState, newState);
	}

	onCallbackException(exception, oldState, newState) {
		this.logger.error(this.name + ".CallbackException", exception, oldState, newState);
	}

	onAfterCallback(oldState, newState, result) {
		this.logger.log(this.name + ".AfterCallback", oldState, newState);
	}
}
