import {combineLatest, Observable, ReplaySubject, shareReplay, startWith, Subject, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';

type EventAndListenerDefinition = { [name: string]: { obs: Subject<any>, onEvent: Observable<any> } };

export class ReactiveComponentManager {
	private _events: EventAndListenerDefinition = {};
	private _registerEvent$ = new ReplaySubject<EventAndListenerDefinition>(1);
	public listeners = this._registerEvent$.pipe(
		map((listeners) => Object.entries(listeners)),
		switchMap((listenersList) => combineLatest(listenersList.map((nameAndListener)=> nameAndListener[1].onEvent.pipe(startWith(undefined))))
			.pipe(
				map((args)=>{
					let names = listenersList.map((nameAndListener)=> nameAndListener[0])
					return {...Object.assign({}, ...args.map((listener, index) => ({[names[index]]: listener})))}
				})
			)),
		shareReplay()
	)

	register(name: string, onEvent: (obs: Observable<any>) => Observable<any>) {
		let obs = new ReplaySubject<any>(1);
		this._events[name] = {obs, onEvent: onEvent? onEvent(obs) : obs};
		this._registerEvent$.next({...this._events})
	}

	get(name: string): Observable<any>{
		return this._events[name].onEvent;
	}
	getSource(name: string): Subject<any>{
		return this._events[name].obs;
	}

	next(name: string, value: any){
		this.getSource(name).next(value);
	}
}