import {combineLatest, Observable, ReplaySubject, shareReplay, startWith, Subject, switchMap, map} from 'rxjs';

type SourceAndListenerDefinition = { [name: string]: { source: Subject<string | number | boolean | object | any> | Observable<string | number | boolean | object | any>, listener: Observable<string | number | boolean | object | any | void | undefined | null> | undefined } };

export class ReactiveComponentManager {
	private _sourcesAndListener: SourceAndListenerDefinition = {};
	private _registerSourceAndListener$ = new ReplaySubject<SourceAndListenerDefinition>(1);
	private _listeners: Observable<{ [name: string]: [value: string | number | boolean | object | any] }> = this._registerSourceAndListener$.pipe(
		map((listeners) => Object.entries(listeners)),
		switchMap((listenersList) => combineLatest(listenersList.map((nameAndListener) => nameAndListener[1]?.listener ? nameAndListener[1].listener.pipe(startWith(undefined)) : nameAndListener[1].source))
			.pipe(
				map((args) => {
					let names = listenersList.map((nameAndListener) => nameAndListener[0])
					return {...Object.assign({}, ...args.map((listener, index) => ({[names[index]]: listener})))}
				})
			)),
		shareReplay()
	)

	register<T, S>(sources: { [name: string]: Observable<T> }, listeners?: { [name: string]: (obs: Observable<T>) => Observable<S> }): Observable<{ [name: string]: [value: T] }> {
		Object.entries(sources).map((source:[string, Observable<T>]) => this.registerSource(source[0], source[1]));
		listeners && Object.entries(listeners).map((listener) => this.registerListener(listener[0], listener[1]));
		return this.getAllListeners();
	}

	/**
	 * @description Registers a new Listener to an empty Subject
	 * @returns source: ReplaySubject<T>
	 */
	registerListener<T, S>(name: string, listener: (obs: Observable<T>) => Observable<S>): Subject<T> {
		let subject = new ReplaySubject<T>(1);
		this._sourcesAndListener[name] = {
			source: subject,
			listener: listener(subject)
		};
		this._registerSourceAndListener$.next({...this._sourcesAndListener})
		return subject;
	}


	/**
	 * @description Registers a source observable as listener
	 * @returns source: Observable<T>
	 */
	registerSource<T>(name: string, subscribeOn: Observable<T>): Observable<T> {
		this._sourcesAndListener[name] = {source: subscribeOn, listener: undefined};
		this._registerSourceAndListener$.next({...this._sourcesAndListener})
		return subscribeOn;
	}

	getListener(name: string): Observable<string | number | boolean | object | void | undefined | null> {
		return this._sourcesAndListener[name]?.listener ?? this._sourcesAndListener[name].source;
	}

	getSource(name: string): Subject<string | number | boolean | object> {
		if (this._sourcesAndListener[name].listener !== undefined)
			return <Subject<string | number | boolean | object>>this._sourcesAndListener[name].source;
		else
			throw new Error('The requested instance does only provide a listener')
	}

	getAllListeners(): Observable<any> {
		return this._listeners;
	}

	next(name: string, value: string | number | boolean | object) {
		this.getSource(name).next(value);
	}
}