import { Observable, Subject } from 'rxjs';
export declare class ReactiveComponentManager {
    private _events;
    private _registerEvent$;
    listeners: Observable<any>;
    register<T extends string | number | boolean | object>(name: string, onEvent: (obs: Observable<T>) => Observable<T | any | void | undefined | null>): Subject<T>;
    get(name: string): Observable<string | number | boolean | object | void | undefined | null>;
    getSource(name: string): Subject<string | number | boolean | object>;
    next(name: string, value: string | number | boolean | object): void;
}
