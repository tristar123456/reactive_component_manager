"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveComponentManager = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ReactiveComponentManager = /** @class */ (function () {
    function ReactiveComponentManager() {
        this._events = {};
        this._registerEvent$ = new rxjs_1.ReplaySubject(1);
        this.listeners = this._registerEvent$.pipe((0, operators_1.map)(function (listeners) { return Object.entries(listeners); }), (0, rxjs_1.switchMap)(function (listenersList) { return (0, rxjs_1.combineLatest)(listenersList.map(function (nameAndListener) { return nameAndListener[1].onEvent.pipe((0, rxjs_1.startWith)(undefined)); }))
            .pipe((0, operators_1.map)(function (args) {
            var names = listenersList.map(function (nameAndListener) { return nameAndListener[0]; });
            return __assign({}, Object.assign.apply(Object, __spreadArray([{}], args.map(function (listener, index) {
                var _a;
                return (_a = {}, _a[names[index]] = listener, _a);
            }), false)));
        })); }), (0, rxjs_1.shareReplay)());
    }
    ReactiveComponentManager.prototype.register = function (name, onEvent) {
        var subject = new rxjs_1.ReplaySubject(1);
        this._events[name] = { obs: subject, onEvent: onEvent ? onEvent(subject) : subject.asObservable() };
        this._registerEvent$.next(__assign({}, this._events));
        return subject;
    };
    ReactiveComponentManager.prototype.get = function (name) {
        return this._events[name].onEvent;
    };
    ReactiveComponentManager.prototype.getSource = function (name) {
        return this._events[name].obs;
    };
    ReactiveComponentManager.prototype.next = function (name, value) {
        this.getSource(name).next(value);
    };
    return ReactiveComponentManager;
}());
exports.ReactiveComponentManager = ReactiveComponentManager;
//# sourceMappingURL=reactive-component-manager.js.map