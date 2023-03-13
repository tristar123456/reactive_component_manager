import { Observable, Subject } from 'rxjs';
export declare class ReactiveComponentManager {
    private _sourcesAndListener;
    private _registerSourceAndListener$;
    private _listeners;
    register<T, S>(sources: {
        [name: string]: Observable<T>;
    }, listeners?: {
        [name: string]: (obs: Observable<T>) => Observable<S>;
    }): Observable<{
        [name: string]: [value: T];
    }>;
    /**
     * @description Registers a new Listener to an empty Subject
     * @returns source: ReplaySubject<T>
     */
    registerListener<T, S>(name: string, listener: (obs: Observable<T>) => Observable<S>): Subject<T>;
    /**
     * @description Registers a source observable as listener
     * @returns source: Observable<T>
     */
    registerSource<T>(name: string, subscribeOn: Observable<T>): Observable<T>;
    getListener(name: string): Observable<string | number | boolean | object | void | undefined | null>;
    getSource(name: string): Subject<string | number | boolean | object>;
    getAllListeners(): Observable<any>;
    next(name: string, value: string | number | boolean | object): void;
}
