import React from "react";

export default class BoundComponent extends React.Component {
	static displayName = "eflux.BoundComponent";

	stores = []; // {store, namespace, method}

	bindToStore(store, namespace = null, method = "setState") {
		this.stores.push({store, namespace, method});
		this.state = Object.assign(this.state || {}, store.getState(namespace));
	}

	componentWillMount() {
		for (const { store, namespace, method } of this.stores) {
			store.registerObject(this, method, namespace);
		}
	}

	componentWillUnmount() {
		for (const { store } of this.stores) {
			store.unregister(this);
		}
	}

}
