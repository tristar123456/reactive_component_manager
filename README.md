# Reactive Component Manager
This Manager allows you to manage your reactive (Angular) component. You can register new Events by simply using:
`eventManager.register('eventName', (observable) => observable.pipe(...)`

## Observable Handling
To subscribe to all your registered Event you just have to subscribe once to `eventManager.listeners`. These can either be done be using an `async` pipe or by using the default way with `.subscribe(()=>{})`.

## Registering a new Event
To register a new event use:
`eventManager.register('eventName', (observable) => observable.pipe(...)`
> It is possible to register events after the completion or emition of a previous event. Please take this into account while using this libary!

## Emitting new Events
You can choose each event by name:
`eventManager.get('eventName')`
and then using 
`.next(eventValue)` 
to emit a new Event
