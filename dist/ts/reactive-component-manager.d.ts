import { Observable, Subject } from 'rxjs';
export declare class ReactiveComponentManager {
    private _events;
    private _registerEvent$;
    listeners: Observable<any>;
    register(name: string, onEvent: (obs: Observable<any>) => Observable<any>): void;
    get(name: string): Observable<any>;
    getSource(name: string): Subject<any>;
    next(name: string, value: any): void;
}
