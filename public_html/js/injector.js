/* 
 * Copyright 2015 Erik Nijenhuis <erik@xerdi.com>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

InjectorShop = function () {};
InjectorShop.operators = [];
InjectorShop.signContract = function (injector) {
    InjectorShop.operators.push(injector);
    injector.input.addEventListener('keyup', InjectorShop.link, true);
    if(injector instanceof TimedInjector)
        injector.activate();
};
InjectorShop.breakContract = function (injector) {
    if(injector instanceof TimedInjector)
        injector.deactivate();
    injector.input.removeEventListener('keyup', InjectorShop.link, true);
    delete InjectorShop.operators[InjectorShop.operators.indexOf(injector)];
};
InjectorShop.trigger = function (input) {
    InjectorShop.getByInput(input).refresh(input.value);
};
InjectorShop.link = function () {
    InjectorShop.trigger(this);
};
InjectorShop.getByInput = function (input) {
    for (var x in InjectorShop.operators)
        if (InjectorShop.operators[x].input === input)
            return InjectorShop.operators[x];
    return null;
};
Injector = function (input, parent) {
    var data = input.dataset;
    this.base = document.createElement(data.type);
    if (data.content) {
        this.content = data.content;
        this.base.setAttribute(this.content,input.value);
    }
    this.input = input;
    parent.appendChild(this.base);
    this.text = document.createTextNode((input.value) ? input.value : "text");
    this.base.appendChild(this.text);
    this.refresh = function (value) {
        if (this.content) {
            this.base.setAttribute(this.content,value);
        } else {
            var txt = document.createTextNode(value);
            this.base.replaceChild(txt, this.text);
            this.text = txt;
        }
    };
};
BeastyInjector = function (input, parent) {
    var data = input.dataset;
    this.base = parent;
    this.input = input;
    this.type = data.type;
    this.delimiter = (data.delimiter === "default") ? '\n' : data.delimiter;
    this.refresh = function (value) {
        var nv = value.split(this.delimiter);
        Builder.empty(this.base, this.type);
        for (var x in nv) {
            var e = document.createElement(this.type);
            e.appendChild(document.createTextNode(nv[x]));
            this.base.appendChild(e);
        }
    };
    this.refresh(input.value);
};
TimedInjector = function (input, parent, interval) {
    Injector.call(this, input, parent);
    this.interval = (interval) ? interval : 1000;
    this.timer = null;
    this.tick = function () {
        input.value = new Date().toLocaleString();
        InjectorShop.trigger(input);
    };
};
TimedInjector.prototype = Object.create(Injector.prototype);
TimedInjector.constructor = TimedInjector;
TimedInjector.prototype.activate = function () {
    this.timer = setInterval(this.tick, this.interval);
};
TimedInjector.prototype.deactivate = function () {
    clearTimeout(this.timer);
};

Builder = function (form) {
    var data = form.dataset;
    this.target = (data['targetid']) ? document.getElementById(data['targetid']) : document.body;
    this.parent = Builder.path(data.type)[0];
    this.inputs = [];
    var inp = form.elements;
    console.log(inp);
    for (var i in inp) {
        if (!inp[i].dataset)
            continue;
        var path = this.getPath(inp[i].dataset.path);
        if (inp[i].name === 'time')
            this.inputs.push(new TimedInjector(inp[i], path));
        else if (inp[i].dataset.delimiter)
            this.inputs.push(new BeastyInjector(inp[i], path));
        else
            this.inputs.push(new Injector(inp[i], path));
    }
};
Builder.prototype.getPath = function (str) {
    var abs = Builder.path(str);
    var curScope = this.parent;
    for (var x in abs) {
        var pos = curScope.getElementsByTagName(abs[x].nodeName);
        if (pos.length > 0) {
            var found = false;
            if (abs[x].className) {
                for (var y in pos) {
                    if (abs[x].className === pos[y].className) {
                        found = true;
                        curScope = pos[y];
                    }
                }
            } else if (abs[x].id) {
                for (var y in pos) {
                    if (abs[x].id === pos[y].id) {
                        found = true;
                        curScope = pos[y];
                    }
                }
            } else {
                found = true;
                curScope = pos[0];
            }
            if (!found) {
                curScope.appendChild(abs[x]);
                curScope = abs[x];
            }
        } else {
            curScope.appendChild(abs[x]);
            curScope = abs[x];
        }
    }
    return curScope;
};
Builder.prototype.start = function () {
    this.target.appendChild(this.parent);
    for (var x in this.inputs)
        InjectorShop.signContract(this.inputs[x]);
};
Builder.prototype.stop = function () {
    this.target.removeChild(this.parent);
    for (var x in this.inputs)
        InjectorShop.breakContract(this.inputs[x]);
};
Builder.path = function (str) {
    var result = [];
    var elems = str.split(" ");
    for (var x in elems) {
        var e = elems[x];
        var tmp;
        var elem;
        if (e.indexOf(".") > -1) {
            tmp = e.split(".");
            elem = document.createElement(tmp[0]);
            elem.className = tmp[1];
            result.push(elem);
        } else if (e.indexOf("#") > -1) {
            tmp = e.split("#");
            elem = document.createElement(tmp[0]);
            elem.id = tmp[1];
            result.push(elem);
        } else
            result.push(document.createElement(e));
    }
    return result;
};
Builder.empty = function (elem, type) {
    while(elem.getElementsByTagName(type).length > 0)
        elem.removeChild(elem.getElementsByTagName(type)[0]);
};