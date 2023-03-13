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
        this._sourcesAndListener = {};
        this._registerSourceAndListener$ = new rxjs_1.ReplaySubject(1);
        this._listeners = this._registerSourceAndListener$.pipe((0, operators_1.map)(function (listeners) { return Object.entries(listeners); }), (0, rxjs_1.switchMap)(function (listenersList) { return (0, rxjs_1.combineLatest)(listenersList.map(function (nameAndListener) { var _a; return ((_a = nameAndListener[1]) === null || _a === void 0 ? void 0 : _a.listener) ? nameAndListener[1].listener.pipe((0, rxjs_1.startWith)(undefined)) : nameAndListener[1].source; }))
            .pipe((0, operators_1.map)(function (args) {
            var names = listenersList.map(function (nameAndListener) { return nameAndListener[0]; });
            return __assign({}, Object.assign.apply(Object, __spreadArray([{}], args.map(function (listener, index) {
                var _a;
                return (_a = {}, _a[names[index]] = listener, _a);
            }), false)));
        })); }), (0, rxjs_1.shareReplay)());
    }
    ReactiveComponentManager.prototype.register = function (sources, listeners) {
        var _this = this;
        Object.entries(sources).map(function (source) { return _this.registerSource(source[0], source[1]); });
        listeners && Object.entries(listeners).map(function (listener) { return _this.registerListener(listener[0], listener[1]); });
        return this.getAllListeners();
    };
    /**
     * @description Registers a new Listener to an empty Subject
     * @returns source: ReplaySubject<T>
     */
    ReactiveComponentManager.prototype.registerListener = function (name, listener) {
        var subject = new rxjs_1.ReplaySubject(1);
        this._sourcesAndListener[name] = {
            source: subject,
            listener: listener ? listener(subject) : subject.asObservable()
        };
        this._registerSourceAndListener$.next(__assign({}, this._sourcesAndListener));
        return subject;
    };
    /**
     * @description Registers a source observable as listener
     * @returns source: Observable<T>
     */
    ReactiveComponentManager.prototype.registerSource = function (name, subscribeOn) {
        this._sourcesAndListener[name] = { source: subscribeOn, listener: undefined };
        this._registerSourceAndListener$.next(__assign({}, this._sourcesAndListener));
        return subscribeOn;
    };
    ReactiveComponentManager.prototype.getListener = function (name) {
        var _a, _b;
        return (_b = (_a = this._sourcesAndListener[name]) === null || _a === void 0 ? void 0 : _a.listener) !== null && _b !== void 0 ? _b : this._sourcesAndListener[name].source;
    };
    ReactiveComponentManager.prototype.getSource = function (name) {
        if (this._sourcesAndListener[name].listener !== undefined)
            return this._sourcesAndListener[name].source;
        else
            throw new Error('The requested instance does only provide a listener');
    };
    ReactiveComponentManager.prototype.getAllListeners = function () {
        return this._listeners;
    };
    ReactiveComponentManager.prototype.next = function (name, value) {
        this.getSource(name).next(value);
    };
    return ReactiveComponentManager;
}());
exports.ReactiveComponentManager = ReactiveComponentManager;
//# sourceMappingURL=reactive-component-manager.js.map