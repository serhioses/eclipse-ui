'use strict';

import eclipse from 'eclipse';

var body = $('body'),
    effects = {
    toggle: 'toggle',
    slide: 'slideToggle',
    fade: 'fadeToggle'
},
    staticTabs, adaptiveTabs;

function findTabs (e, tabsType) {
    var target = $(e.target),
        tabsContainer = target.closest('[data-tabs]'),
        tabs, i;

    if (!tabsContainer.length) {
        return false;
    }

    for (i = 0; i < eclipse.storage[tabsType].length; i += 1) {
        if (eclipse.storage[tabsType][i]._container[0] === tabsContainer[0]) {
            tabs = eclipse.storage[tabsType][i];
            break;
        }
    }

    return tabs;
}

// Tabs (static)
(function () {
    function switchTab (tabs) {
        var that = $(this),
            id = that.data('tab'),
            effect = effects[tabs._defaults.effect] ? effects[tabs._defaults.effect] : 'toggle',
            classAction;

        if (!tabs._isAnimationFinished || (that.hasClass('t-tab-nav-item--active') && !tabs._defaults.toggleTabs)) {
            return;
        }

        classAction = tabs._defaults.toggleTabs ? 'toggleClass' : 'addClass';

        tabs._defaults.beforeAnimation();
        tabs._isAnimationFinished = false;

        if (tabs._defaults.hideAjacentTabs) {
            tabs._desktopTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active');
            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active');
        }
        
        that[classAction]('t-tab-nav-item--active');
        
        tabs._tabContent.filter('[data-tab="' + id + '"]')
            .stop(true, true)[effect](parseInt(tabs._defaults.speed, 10) || 0, function () {
                $(this)[classAction]('t-tab-item--active').removeAttr('style');

                tabs._isAnimationFinished = true;

                tabs._defaults.afterAnimation();

                if (tabs._defaults.scrollToActive) {
                    eclipse.DOM.scrollBody(that, tabs._defaults.scrollCorrection);
                }
            });
    }

    function reinit (newOptions) {
        var pos = eclipse.storage.staticTabs.indexOf(this);

        if (pos !== -1) {
            eclipse.storage.staticTabs.splice(pos, 1);
        }
        
        if (eclipse.helpers.getClass(newOptions) === 'Object') {
            $.extend(this._defaults, newOptions);
        }

        eclipse.storage.staticTabs.push(this);
    }

    function init () {
        eclipse.storage.staticTabs.push(this);
    }
    // Delegation
    body.on('click', function (e) {
        var tabs, target, tabNavItem;

        target = $(e.target);
        tabNavItem = target.closest('.t-tab-nav-item');

        if (!tabNavItem.length) {
            return;
        }

        tabs = findTabs(e, 'staticTabs');

        if (!tabs) {
            return;
        }

        if (tabs._defaults.shouldPreventDefault) {
            e.preventDefault();
        }

        switchTab.call(tabNavItem, tabs);
    });
    // Delegation (END)

    function StaticTabs (container, options) {
        var defaults, isAnimationFinished = true,
            container,
            desktopTabNav,
            tabContent;

        defaults = eclipse.helpers.createMap();

        defaults.effect = 'toggle';
        defaults.speed = 0;
        defaults.shouldPreventDefault = true;
        defaults.toggleTabs = false;
        defaults.hideAjacentTabs = true;
        defaults.scrollToActive = false;
        defaults.scrollCorrection = 0;
        defaults.beforeAnimation = $.noop;
        defaults.afterAnimation = $.noop;

        Object.defineProperty(this, '_isAnimationFinished', {
            get: function () {
                return isAnimationFinished;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    isAnimationFinished = value;
                } else {
                    throw new Error('<isAnimationFinished> can only be <boolean>');
                }
            }
        });

        container = $('#' + container);
        desktopTabNav = container.find('.t-tab-nav-item');
        tabContent = container.find('.t-tab-item');

        Object.defineProperties(this, {
            _container: {
                get: function () {
                    return container;
                }
            },
            _desktopTabNav: {
                get: function () {
                    return desktopTabNav;
                }
            },
            _tabContent: {
                get: function () {
                    return tabContent;
                }
            }
        });

        if (eclipse.helpers.getClass(options) === 'Object') {
            $.extend(defaults, options);
        }

        Object.defineProperty(this, '_defaults', {
            get: function () {
                return defaults;
            }
        });

        return this;    
    };

    Object.defineProperty(StaticTabs.prototype, 'reinit', {
        value: function (newOptions) {
            reinit.call(this, newOptions);
        }
    });
    Object.defineProperty(StaticTabs.prototype, 'init', {
        value: function () {
            init.call(this);
        }
    });
    staticTabs = StaticTabs;
}());
// Tabs (static) (END)

// Tabs (adaptive)
(function () {
    function switchTabDesktop (tabs) {
        var that = $(this),
            id = that.data('tab'),
            effect = effects[tabs._defaults.desktopEffect] ? effects[tabs._defaults.desktopEffect] : 'toggle',
            desktopClassAction, mobileClassAction;

        if (!tabs._isAnimationFinished || (that.hasClass('t-tab-nav-item--active_desktop') && !tabs._defaults.toggleTabsDesktop)) {
            return;
        }

        desktopClassAction = tabs._defaults.toggleTabsDesktop ? 'toggleClass' : 'addClass';
        mobileClassAction = tabs._defaults.toggleTabsMobile ? 'toggleClass' : 'addClass';

        tabs._defaults.beforeAnimation();
        tabs._isAnimationFinished = false;

        if (tabs._defaults.hideAjacentTabsDesktop) {
            tabs._desktopTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_desktop');
            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active t-tab-item--active_desktop');
        }

        if (tabs._defaults.bindMobileToDesktop) {
            tabs._mobileTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_mobile');
            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active_mobile');
            tabs._mobileTabNav.filter('[data-tab="' + id + '"]').addClass('t-tab-nav-item--active t-tab-nav-item--active_mobile');
            tabs._tabContent.filter('[data-tab="' + id + '"]').addClass('t-tab-item--active_mobile');
        }

        that[desktopClassAction]('t-tab-nav-item--active t-tab-nav-item--active_desktop');

        tabs._tabContent.filter('[data-tab="' + id + '"]')
            .stop(true, true)[effect](parseInt(tabs._defaults.desktopSpeed, 10) || 0, function () {
                $(this)[desktopClassAction]('t-tab-item--active t-tab-item--active_desktop').removeAttr('style');

                tabs._isAnimationFinished = true;

                tabs._defaults.afterAnimation();

                if (tabs._defaults.scrollToActiveDesktop) {
                    eclipse.DOM.scrollBody(that, tabs._defaults.scrollCorrectionDesktop);
                }
            });
    }

    function switchTabMobile (tabs) {
        var that = $(this),
            id = $(this).data('tab'),
            effect = effects[tabs._defaults.mobileEffect] ? effects[tabs._defaults.mobileEffect] : 'toggle',
            mobileClassAction, desktopClassAction;

        if (!tabs._isAnimationFinished || (that.hasClass('t-tab-nav-item--active_mobile') && !tabs._defaults.toggleTabsMobile)) {
            return;
        }

        mobileClassAction = tabs._defaults.toggleTabsMobile ? 'toggleClass' : 'addClass';
        desktopClassAction = tabs._defaults.toggleTabsDesktop ? 'toggleClass' : 'addClass';

        tabs._defaults.beforeAnimation();
        tabs._isAnimationFinished = false;

        if (tabs._defaults.hideAjacentTabsMobile) {
            tabs._mobileTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_mobile');
            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active t-tab-item--active_mobile');
        }

        if (tabs._defaults.bindDesktopToMobile) {
            tabs._desktopTabNav.not('[data-tab="' + id + '"]').removeClass('t-tab-nav-item--active t-tab-nav-item--active_desktop');
            tabs._tabContent.not('[data-tab="' + id + '"]').removeClass('t-tab-item--active_desktop');
            tabs._desktopTabNav.filter('[data-tab="' + id + '"]').addClass('t-tab-nav-item--active t-tab-nav-item--active_desktop');
            tabs._tabContent.filter('[data-tab="' + id + '"]').addClass('t-tab-item--active_desktop');
        }

        that[mobileClassAction]('t-tab-nav-item--active t-tab-nav-item--active_mobile');

        tabs._tabContent.filter('[data-tab="' + id + '"]')
            .stop(true, true)[effect](parseInt(tabs._defaults.mobileSpeed, 10) || 0, function () {
                $(this)[mobileClassAction]('t-tab-item--active t-tab-item--active_mobile').removeAttr('style');

                tabs._isAnimationFinished = true;

                tabs._defaults.afterAnimation();

                if (tabs._defaults.scrollToActiveMobile) {
                    eclipse.DOM.scrollBody(that, tabs._defaults.scrollCorrectionMobile);
                }
            });
    }

    function reinit (newOptions) {
        var pos = eclipse.storage.adaptiveTabs.indexOf(this);

        if (pos !== -1) {
            eclipse.storage.adaptiveTabs.splice(pos, 1);
        }
        
        if (eclipse.helpers.getClass(newOptions) === 'Object') {
            $.extend(this._defaults, newOptions);
        }

        eclipse.storage.adaptiveTabs.push(this);
    }

    function init () {
        eclipse.storage.adaptiveTabs.push(this);
    }

    // Delegation
    body.on('click', function (e) {
        var tabs, target, tabNavItem;

        target = $(e.target);
        tabNavItem = target.closest('.t-tab-nav-item');

        if (!tabNavItem.length) {
            return;
        }

        tabs = findTabs(e, 'adaptiveTabs');

        if (!tabs) {
            return;
        }

        if (tabs._defaults.shouldPreventDefault) {
            e.preventDefault();
        }

        if (tabNavItem.hasClass('t-tab-nav-item--desktop')) {
            switchTabDesktop.call(tabNavItem, tabs);
        } else if (tabNavItem.hasClass('t-tab-nav-item--mobile')) {
            switchTabMobile.call(tabNavItem, tabs);
        }
    });
    // Delegation (END)

    function AdaptiveTabs (container, options) {
        var defaults, isAnimationFinished = true,
            container,
            desktopTabNav, mobileTabNav,
            tabContent;
        
        defaults = eclipse.helpers.createMap();

        defaults.desktopEffect = 'toggle';
        defaults.desktopSpeed = 0;
        defaults.shouldPreventDefault = true;
        defaults.mobileEffect = 'slide';
        defaults.mobileSpeed = 300;
        defaults.hideAjacentTabsMobile = true;
        defaults.hideAjacentTabsDesktop = true;
        defaults.scrollToActiveMobile = true;
        defaults.scrollCorrectionMobile = 0;
        defaults.scrollToActiveDesktop = false;
        defaults.scrollCorrectionDesktop = 0;
        defaults.toggleTabsDesktop = false;
        defaults.toggleTabsMobile = true;
        defaults.bindMobileToDesktop = true;
        defaults.bindDesktopToMobile = true;
        defaults.beforeAnimation = $.noop;
        defaults.afterAnimation = $.noop;

        Object.defineProperty(this, '_isAnimationFinished', {
            get: function () {
                return isAnimationFinished;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    isAnimationFinished = value;
                } else {
                    throw new Error('<isAnimationFinished> can only be <boolean>');
                }
            }
        });

        container = $('#' + container);
        desktopTabNav = container.find('.t-tab-nav-item--desktop');
        mobileTabNav = container.find('.t-tab-nav-item--mobile');
        tabContent = container.find('.t-tab-item');

        Object.defineProperties(this, {
            _container: {
                get: function () {
                    return container;
                }
            },
            _desktopTabNav: {
                get: function () {
                    return desktopTabNav;
                }
            },
            _mobileTabNav: {
                get: function () {
                    return mobileTabNav;
                }
            },
            _tabContent: {
                get: function () {
                    return tabContent;
                }
            }
        });

        if (eclipse.helpers.getClass(options) === 'Object') {
            $.extend(defaults, options);
        }
        Object.defineProperty(this, '_defaults', {
            get: function () {
                return defaults;
            }
        });

        return this;
    };

    Object.defineProperty(AdaptiveTabs.prototype, 'reinit', {
        value: function (newOptions) {
            reinit.call(this, newOptions);
        }
    });
    Object.defineProperty(AdaptiveTabs.prototype, 'init', {
        value: function () {
            init.call(this);
        }
    });

    adaptiveTabs = AdaptiveTabs;
}());

export {staticTabs, adaptiveTabs};