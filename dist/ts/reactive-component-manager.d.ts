import { Observable, Subject } from 'rxjs';
export declare class ReactiveComponentManager {
    private _sourcesAndListener;
    private _registerSourceAndListener$;
    private _listeners;
    register(sources: {
        [name: string]: Observable<string | number | boolean | object | any>;
    }, listeners?: {
        [name: string]: (obs: Observable<string | number | boolean | object | any>) => Observable<string | number | boolean | object | any | void | undefined | null>;
    }): Observable<{
        [name: string]: [value: string | number | boolean | object | any];
    }>;
    /**
     * @description Registers a new Listener to an empty Subject
     * @returns source: ReplaySubject<T>
     */
    registerListener<T extends string | number | boolean | object>(name: string, listener: (obs: Observable<T>) => Observable<T | any | void | undefined | null>): Subject<T>;
    /**
     * @description Registers a source observable as listener
     * @returns source: Observable<T>
     */
    registerSource<T extends string | number | boolean | object>(name: string, subscribeOn: Observable<T>): Observable<T>;
    getListener(name: string): Observable<string | number | boolean | object | void | undefined | null>;
    getSource(name: string): Subject<string | number | boolean | object>;
    getAllListeners(): Observable<any>;
    next(name: string, value: string | number | boolean | object): void;
}
