// Simple toast pub/sub utility for app-wide notifications

const subscribers = new Set();

let nextId = 1;

export const toast = {
    subscribe(handler) {
        subscribers.add(handler);
        return () => subscribers.delete(handler);
    },
    _emit(event) {
        subscribers.forEach((fn) => fn(event));
    },
    show(message, { type = "info", duration = 3500 } = {}) {
        const id = nextId++;
        this._emit({ id, type, message, duration, action: "add" });
        return id;
    },
    success(message, opts) {
        return this.show(message, { type: "success", ...(opts || {}) });
    },
    error(message, opts) {
        return this.show(message, { type: "error", ...(opts || {}) });
    },
    info(message, opts) {
        return this.show(message, { type: "info", ...(opts || {}) });
    },
    dismiss(id) {
        this._emit({ id, action: "remove" });
    },
};

export default toast;


