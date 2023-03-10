const {ReplaySubject, combineLatest, switchMap, startWith, shareReplay} = require('rxjs');
const {map} = require('rxjs/operators');

class ReactiveComponentManager {
	_events = {};
	_registerEvent$ = new ReplaySubject(1);
	listeners = this._registerEvent$.pipe(
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

	register(name, onEvent) {
		let obs = new ReplaySubject(1);
		this._events[name] = {obs, onEvent: onEvent? onEvent(obs) : obs};
		this._registerEvent$.next({...this._events})
	}

	get(name){
		return this._events[name].obs;
	}
}

module.exports = ReactiveComponentManager;