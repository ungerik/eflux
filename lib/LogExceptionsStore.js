import Store from "./Store";

export default class LogExceptionsStore extends Store {
	constructor(name, ...dispatchers) {
		super(name, ...dispatchers);
		this.logger = console;
	}

	onCallbackException(exception, oldState, newState) {
		this.logger.error(this.name + ".CallbackException", exception, oldState, newState);
	}
}
