# Reactive Component Manager
This Manager allows you to manage your reactive (Angular) component. You can register new Events by simply using:
`eventManager.registerListener('listenerName', (observable) => observable.pipe(...)`

## Observable Handling
To subscribe to all your registered Listeners you just have to subscribe once to `eventManager.getAllListeners()`. These can either be done be using an `async` pipe or by using the default way with `.subscribe(()=>{})`.

### Registering a new Event
To register a new listener use:

`rcm.registerListener('listenerName', (observable) => observable.pipe(...)`

or if you just want to add a observable, to be listened to:

`rcm.registerListener('listenerName', observable)`
> It is possible to register listener or sources after the completion or emition of a previous value. Please take this into account while using this libary!

### Emitting new Events
You can choose each listener by name:
`rcm.getListener('listenerName')`
and then using
`.next(listenerValue)`
to emit a new Value

### Working example

The following example has all necessary functions to build a complete async Component

``` typescript
const {ReactiveComponentManager} = require('reactive-component-manager');
const {of, tap, map ,withLatestFrom} = require("rxjs");

let rcm = new ReactiveComponentManager();

rcm.getAllListeners().subscribe(console.log);

rcm.registerListener('add', (obs) =>
	obs.pipe(
		map((i)=>i+i),
		tap((event) => console.log('received event:', event))
	));
	
rcm.registerListener('sub', (obs) => {
	return obs.pipe(
		withLatestFrom(rcm.getListener('add')),
		map(([otherNumber, addNUmber]) => (otherNumber - addNUmber)),
		tap((event) => console.log('received event:', event))
	);
});

rcm.register({
	justOne: of(1),
	justTwo: of(2),
	justFour: of(4)
});

rcm.next('add',1)
rcm.next('sub',6)
rcm.next('sub',122)

setTimeout(()=>{}, 3000)
```