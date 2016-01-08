
export default class Store {
	isSettingSate = false;
	state = {};
	callbacks = []; // array of {key, callback, namespace}

	constructor(name, ...dispatchers) {
		this.name = name;
		for (const dispatcher of dispatchers) {
			dispatcher.register(this);
		}
	}

	register(key, callback, namespace = null) {
		this.onRegister(key);
		this.callbacks.push({key, callback, namespace});
		callback(this.state);
	}

	unregister(key) {
		this.onUnregister(key);
		for (let i = 0; i < this.callbacks.length; i++) {
			if (this.callbacks[i].key === key) {
				this.callbacks.splice(i, 1);
				return;
			}
		}
		throw new Error("key not registerred at eflux.Store: " + key);
	}

	registerCallback(callback, namespace = null) {
		this.register(callback, callback, namespace);
	}

	registerObject(object, callbackMethodName = "setState", namespace = null) {
		this.register(object, newState => {
			object[callbackMethodName](newState);
		}, namespace);
	}

	getState(namespace = null) {
		return namespace ? {[namespace]: this.state} : this.state;
	}

	setState(newState) {
		if (this.isSettingSate) {
			this.onSetStateIsBusy(newState);
			return false;
		}
		try {
			this.isSettingSate = true;
			const oldState = this.state;
			this.onBeforeStateChange(oldState, newState);
			this.state = newState;
			for (const {callback, namespace} of this.callbacks) {
				this.onBeforeCallback(oldState, newState);
				let result;
				try {
					result = callback(this.getState(namespace));
				} catch(exception) {
					this.onCallbackException(exception, oldState, newState);
				} finally {
					this.onAfterCallback(oldState, newState, result);
				}
			}
			this.onAfterStateChange(oldState, newState);
		}
		finally {
			this.isSettingSate = false;
		}
		return true;
	}

	onRegister(key) {}
	onUnregister(key) {}
	onSetStateIsBusy(newState) {
		console.warn(this.name + ".SetStateIsBusy", newState);
	}
	onBeforeStateChange(oldState, newState) {}
	onAfterStateChange(oldState, newState) {}
	onBeforeCallback(oldState, newState) {}
	onCallbackException(exception, oldState, newState) {
		throw exception;
	}
	onAfterCallback(oldState, newState, result) {}
}
