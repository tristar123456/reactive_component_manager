import {Observable, Subject} from 'rxjs';

export type SourceAndListenerDefinition = { [name: string]: { source: Subject<string | number | boolean | object | any> | Observable<string | number | boolean | object | any>, listener: Observable<string | number | boolean | object | any | void | undefined | null> | undefined } };
