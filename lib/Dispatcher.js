
export default class Dispatcher {
	static action(target, name, descriptor) {
		return {
			...descriptor,
			value: function actionPayloadWrapper() {
				const payload = descriptor.value.apply(this, arguments);
				if (payload) {
					this.dispatch(name, payload);
				}
			}
		};
	}

	observers = [];

	register(observer) {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
		}
	}

	dispatch(action, payload) {
		for (const o of this.observers) {
			const method = o[action];
			if (method === undefined) {
				continue;
			}
			try {
				method.call(o, payload);
			} catch(exception) {
				console.error(`Exeption while dispatching action "${action}" with payload:`, payload, "at observer:", o, "exception:", exception);
				throw exception;
			}
		}
	}
}
