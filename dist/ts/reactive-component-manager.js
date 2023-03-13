import { combineLatest, ReplaySubject, shareReplay, startWith, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
export class ReactiveComponentManager {
    constructor() {
        this._events = {};
        this._registerEvent$ = new ReplaySubject(1);
        this.listeners = this._registerEvent$.pipe(map((listeners) => Object.entries(listeners)), switchMap((listenersList) => combineLatest(listenersList.map((nameAndListener) => nameAndListener[1].onEvent.pipe(startWith(undefined))))
            .pipe(map((args) => {
            let names = listenersList.map((nameAndListener) => nameAndListener[0]);
            return Object.assign({}, Object.assign({}, ...args.map((listener, index) => ({ [names[index]]: listener }))));
        }))), shareReplay());
    }
    register(name, onEvent) {
        let subject = new ReplaySubject(1);
        this._events[name] = { obs: subject, onEvent: onEvent ? onEvent(subject) : subject.asObservable() };
        this._registerEvent$.next(Object.assign({}, this._events));
        return subject;
    }
    get(name) {
        return this._events[name].onEvent;
    }
    getSource(name) {
        return this._events[name].obs;
    }
    next(name, value) {
        this.getSource(name).next(value);
    }
}
//# sourceMappingURL=reactive-component-manager.js.map