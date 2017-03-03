'use strict';

import eclipse from 'eclipse';

var body = $('body'),
    resetCSS = {
        'display': '',
        'height': '',
        'overflow': '',
        'opacity': ''
    },
    effects = {
        toggle: ['show', 'hide'],
        slide: ['slideDown', 'slideUp'],
        fade: ['fadeIn', 'fadeOut']
    },
    customEffects = {},
    COOLDOWN = 1;

function animate (effect, current, hide) {
    var self = this,
        hasClass = current.dropdown.hasClass('dd-dropdown--opened');

    if (hasClass || hide) {
        if (hasClass) {
            self._defaults.beforeClose(self._container);
        }
        
        current.dropdown.removeClass('dd-dropdown--pressed');
        current.trigger.removeClass('dd-trigger--active');

        current.drop[effects[effect][1]]({
            duration: parseInt(self._defaults.animationDuration, 10) || 0,
            done: function () {
                var hasClass = current.dropdown.hasClass('dd-dropdown--opened');

                current.dropdown.removeClass('dd-dropdown--opened');
                current.drop.css(resetCSS);

                if (hasClass) {
                    self._defaults.afterClose(self._container);
                }
            }
        });
    } else {
        self._defaults.beforeOpen(self._container);
        current.dropdown.addClass('dd-dropdown--pressed');
        current.trigger.addClass('dd-trigger--active');

        current.drop[effects[effect][0]]({
            duration: parseInt(self._defaults.animationDuration, 10) || 0,
            done: function () {
                current.dropdown.addClass('dd-dropdown--opened');
                current.drop.css(resetCSS);
                self._defaults.afterOpen(self._container);
            }
        });
    }
}

function createDropdownsArray (arr, id) {
    var tmp = arr.slice(0),
        drop, trigger, innerID, parentID, next, self,
        that = this;
        
    tmp.each(function () {
        self = $(this);
        drop = self.children('.dd-drop');
        trigger = that._isEqual ? self : self.find('.' + that._defaults.trigger).first();
        innerID = Math.random();
        parentID = (+self.data('level') > 1) ? id : null;
        next = drop.first().find('.dd-dropdown:first');

        if (next.length) {
            next = next.add(next.siblings('.dd-dropdown'));
            createDropdownsArray.call(that, next, innerID);
        }

        that._dropdowns.push({
            dropdown: self,
            drop: drop.first(),
            level: self.data('level'),
            trigger: trigger,
            id: innerID,
            parentID: parentID
        });
    });
}

function getEffect () {
    var effect, isCustom;

    if (effects[this._defaults.effect] || customEffects[this._defaults.effect]) {
        effect = this._defaults.effect;
    } else {
        effect = 'toggle';
    }

    isCustom = Object.prototype.hasOwnProperty.call(customEffects, effect);

    return {
        effect: effect,
        isCustom: isCustom
    };
}

function hideNested (id) {
    var next = [], self = this, effectObj;

    self._dropdowns.forEach(function (item) {
        if (item.parentID === id) {
            effectObj = getEffect.call(self);
            effectObj.isCustom ? customEffects[effectObj.effect].call(self, item, true) : animate.call(self, effectObj.effect, item, true);
            
            next.push(item);
        }
    });

    if (next.length) {
        next.forEach(function (item) {
            hideNested.call(self, item.id);
        });
    }
}

function hideSiblings (current, level) {
    var self = this, effectObj;

    self._dropdowns.forEach(function (item) {
        if (item !== current && item.level === level && item.dropdown.hasClass('dd-dropdown--opened')) {
            effectObj = getEffect.call(self);
            effectObj.isCustom ? customEffects[effectObj.effect].call(self, item, true) : animate.call(self, effectObj.effect, item, true);
            
            if (self._defaults.hideNested) {
                hideNested.call(self, item.id);
            }
        }
    });
}

function hideOnOtherDropdownsClick (container) {
    eclipse.storage.dropdowns.forEach(function (item) {
        if (item._container.data('other-dropdowns') && item._container !== container && item._container.find('.dd-dropdown--opened').length) {
            item._defaults.beforeClose(item._container);
            
            item._container.find('.dd-dropdown').removeClass('dd-dropdown--opened dd-dropdown--active dd-dropdown--pressed dd-trigger--active');
            item._container.find('.dd-drop').css(resetCSS);
            item._container.find('.dd-trigger').removeClass('dd-trigger--active');

            item._defaults.afterClose(item._container);
        }
    });
}

function reinit (newOptions) {
    var pos = eclipse.storage.dropdowns.indexOf(this);

    if (pos !== -1) {
        eclipse.storage.dropdowns.splice(pos, 1);
    }
    this._dropdowns.length = 0;
    
    if (eclipse.helpers.getClass(newOptions) === 'Object') {
        $.extend(this._defaults, newOptions);
    }
    createDropdownsArray.call(this, this._rootDD);
    eclipse.storage.dropdowns.push(this);
}

function init () {
    createDropdownsArray.call(this, this._rootDD);
    eclipse.storage.dropdowns.push(this);
}
// Delegation
body.on('click', function (e) {
    var target = $(e.target),
        dropdownContainer = target.closest('[data-dropdown]'),
        dropdown, i,
        current, effectObj, pos,
        request,
        launch;

    if (!dropdownContainer.length) {
        return;
    }

    for (i = 0; i < eclipse.storage.dropdowns.length; i += 1) {
        if (eclipse.storage.dropdowns[i]._container[0] === dropdownContainer[0]) {
            dropdown = eclipse.storage.dropdowns[i];
            break;
        }
    }

    if (!dropdown) {
        return;
    }

    target = $(e.target).closest('.' + dropdown._defaults.trigger);

    if (!target.length) {
        return;
    }

    if (dropdown._defaults.shouldPreventDefault) {
        e.preventDefault();
    }
    
    if (dropdown._state) {
        return;
    }

    launch = function () {
        effectObj.isCustom ? customEffects[effectObj.effect].call(dropdown, current, false) : animate.call(dropdown, effectObj.effect, current, false);
    
        if (dropdown._defaults.hideSiblings) {
            hideSiblings.call(dropdown, current, current.level);
        }
        if (dropdown._defaults.hideNested && !current.dropdown.hasClass('dd-dropdown--pressed')) {
            hideNested.call(dropdown, current.id);
        }

        setTimeout(function () {
            dropdown._state = null;
        }, parseInt(dropdown._defaults.animationDuration, 10) || 0);
    };

    hideOnOtherDropdownsClick.call(dropdown, dropdown._container);

    dropdown._state = COOLDOWN;
    current = target.closest('.dd-dropdown');

    for (i = 0; i < dropdown._dropdowns.length; i++) {
        if (dropdown._dropdowns[i].dropdown[0] === current[0]) {
            current = dropdown._dropdowns[i];
            break;
        }
    }

    effectObj = getEffect.call(dropdown);

    if (typeof dropdown._defaults.wait === 'function') {
        request = dropdown._defaults.wait(current);

        if (request.then) {
            pos = eclipse.storage.dropdowns.indexOf(dropdown);

            if (pos !== -1) {
                eclipse.storage.dropdowns.splice(pos, 1);
            }
            dropdown._dropdowns.length = 0;

            $.when(request).then(function (a, b) {
                createDropdownsArray.call(dropdown, dropdown._rootDD);
                eclipse.storage.dropdowns.push(dropdown);
                launch();
            });
        } else {
            launch();
        }
    } else {
        launch();
    }
});
// Delegation (END)

function Dropdown (root, options) {
    var self = this,
        defaults, dropdowns,
        container, state,
        firstDD, siblings, rootDD;

    defaults = eclipse.helpers.createMap();

    defaults.hideSiblings = true;
    defaults.hideNested = true;
    defaults.trigger = 'dd-dropdown';
    defaults.effect = 'toggle';
    defaults.shouldPreventDefault = true;
    defaults.animationDuration = 0;
    defaults.beforeOpen = $.noop;
    defaults.afterOpen = $.noop;
    defaults.beforeClose = $.noop;
    defaults.afterClose = $.noop;
    defaults.wait = null;
    
    dropdowns = [];

    Object.defineProperty(this, '_dropdowns', {
        get: function () {
            return dropdowns;
        }
    });

    if (eclipse.helpers.getClass(options) === 'Object') {
        $.extend(defaults, options);
    }

    defaults.animationDuration = parseInt(defaults.animationDuration, 10) || 0;

    Object.defineProperty(this, '_defaults', {
        get: function () {
            return defaults;
        }
    });

    container = $('#' + root);
    if (!container.length) {
        throw new Error('The container is not found!');
    }

    Object.defineProperty(this, '_container', {
        get: function () {
            return container;
        }
    });

    Object.defineProperty(this, '_isEqual', {
        get: function () {
            return (this._defaults.trigger === 'dd-dropdown');
        }
    });

    state = null;
    Object.defineProperty(this, '_state', {
        get: function () {
            return state;
        },
        set: function (value) {
            if (value === COOLDOWN || value === null) {
                state = value;
            } else {
                throw new Error('<state> cannot be anything except for <null> or <1>');
            }
        }
    });

    // Find the first dropdown
    firstDD = this._container.find('.dd-dropdown:first');
    // Find ajacent dropdowns
    siblings = firstDD.siblings('.dd-dropdown');
    // Join the first dropdown with the ajacent dropdowns so we get the root (parent) dropdowns
    rootDD = firstDD.add(siblings);

    Object.defineProperty(this, '_rootDD', {
        get: function () {
            return rootDD;
        }
    });

    return this;
};

Dropdown.hideOutside = function () {
    var self = this,
        isTouch;

    function hide (e) {
        if (e.type === 'touchstart') {
            isTouch = true;
        }
        if (isTouch && e.type === 'click') {
            return;
        }
        if (!$(e.target).closest('[data-outside="true"]').length && !$(e.target).closest('.dd-dropdown').length) {
            eclipse.storage.dropdowns.forEach(function (item) {
                var container = item._container;

                if (container.data('outside') && container.find('.dd-dropdown--opened').length) {
                    item._defaults.beforeClose(container);

                    container.find('.dd-dropdown').removeClass('dd-dropdown--opened dd-dropdown--active dd-dropdown--pressed');
                    container.find('.dd-drop').css(resetCSS);
                    container.find('.dd-trigger').removeClass('dd-trigger--active');

                    item._defaults.afterClose(container);
                }
            });
        }
    }

    body.on('touchstart click', hide);
};
Dropdown.hideOutside = eclipse.decorators.once(Dropdown.hideOutside, null);

Dropdown.addEffect = function (name, handler) {
    if (!Object.prototype.hasOwnProperty.call(customEffects, name)) {
        customEffects[name] = handler;
    }
};

Object.defineProperty(Dropdown.prototype, 'init', {
    value: function () {
        init.call(this);
    },
    enumerable: false
});
Object.defineProperty(Dropdown.prototype, 'reinit', {
    value: function (newOptions) {
        reinit.call(this, newOptions);
    },
    enumerable: false
});
Object.defineProperty(Dropdown.prototype, 'close', {
    value: function (effect, current, hide) {
        animate.call(this, effect, current, hide);
    },
    enumerable: false
});

export default Dropdown;