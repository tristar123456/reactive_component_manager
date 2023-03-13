import {combineLatest, Observable, ReplaySubject, shareReplay, startWith, Subject, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';

type EventAndListenerDefinition = { [name: string]: { obs: Subject<string | number | boolean | object | any>, onEvent: Observable<string | number | boolean | object | any | void | undefined | null> } };

export class ReactiveComponentManager {
	private _events: EventAndListenerDefinition = {};
	private _registerEvent$ = new ReplaySubject<EventAndListenerDefinition>(1);
	public listeners = this._registerEvent$.pipe(
		map((listeners) => Object.entries(listeners)),
		switchMap((listenersList) => combineLatest(listenersList.map((nameAndListener) => nameAndListener[1].onEvent.pipe(startWith(undefined))))
			.pipe(
				map((args) => {
					let names = listenersList.map((nameAndListener) => nameAndListener[0])
					return {...Object.assign({}, ...args.map((listener, index) => ({[names[index]]: listener})))}
				})
			)),
		shareReplay()
	)

	register<T extends string | number | boolean | object>(name: string, onEvent: (obs: Observable<T>) => Observable<T | any | void | undefined | null>): Subject<T> {
		let subject = new ReplaySubject<T>(1);
		this._events[name] = {obs: subject, onEvent: onEvent ? onEvent(subject) : subject.asObservable()};
		this._registerEvent$.next({...this._events})
		return subject;
	}

	get(name: string): Observable<string | number | boolean | object | void | undefined | null> {
		return this._events[name].onEvent;
	}

	getSource(name: string): Subject<string | number | boolean | object> {
		return this._events[name].obs;
	}

	next(name: string, value: string | number | boolean | object) {
		this.getSource(name).next(value);
	}
}