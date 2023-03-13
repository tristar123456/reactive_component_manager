import { combineLatest, ReplaySubject, shareReplay, startWith, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
export class ReactiveComponentManager {
    constructor() {
        this._sourcesAndListener = {};
        this._registerSourceAndListener$ = new ReplaySubject(1);
        this._listeners = this._registerSourceAndListener$.pipe(map((listeners) => Object.entries(listeners)), switchMap((listenersList) => combineLatest(listenersList.map((nameAndListener) => { var _a; return ((_a = nameAndListener[1]) === null || _a === void 0 ? void 0 : _a.listener) ? nameAndListener[1].listener.pipe(startWith(undefined)) : nameAndListener[1].source; }))
            .pipe(map((args) => {
            let names = listenersList.map((nameAndListener) => nameAndListener[0]);
            return Object.assign({}, Object.assign({}, ...args.map((listener, index) => ({ [names[index]]: listener }))));
        }))), shareReplay());
    }
    register(sources, listeners) {
        Object.entries(sources).map((source) => this.registerSource(source[0], source[1]));
        listeners && Object.entries(listeners).map((listener) => this.registerListener(listener[0], listener[1]));
        return this.getAllListeners();
    }
    /**
     * @description Registers a new Listener to an empty Subject
     * @returns source: ReplaySubject<T>
     */
    registerListener(name, listener) {
        let subject = new ReplaySubject(1);
        this._sourcesAndListener[name] = {
            source: subject,
            listener: listener ? listener(subject) : subject.asObservable()
        };
        this._registerSourceAndListener$.next(Object.assign({}, this._sourcesAndListener));
        return subject;
    }
    /**
     * @description Registers a source observable as listener
     * @returns source: Observable<T>
     */
    registerSource(name, subscribeOn) {
        this._sourcesAndListener[name] = { source: subscribeOn, listener: undefined };
        this._registerSourceAndListener$.next(Object.assign({}, this._sourcesAndListener));
        return subscribeOn;
    }
    getListener(name) {
        var _a, _b;
        return (_b = (_a = this._sourcesAndListener[name]) === null || _a === void 0 ? void 0 : _a.listener) !== null && _b !== void 0 ? _b : this._sourcesAndListener[name].source;
    }
    getSource(name) {
        if (this._sourcesAndListener[name].listener !== undefined)
            return this._sourcesAndListener[name].source;
        else
            throw new Error('The requested instance does only provide a listener');
    }
    getAllListeners() {
        return this._listeners;
    }
    next(name, value) {
        this.getSource(name).next(value);
    }
}
//# sourceMappingURL=reactive-component-manager.js.map