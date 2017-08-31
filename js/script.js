(function(factory) { if (typeof define === 'function' && define.amd) { define(['jquery'], factory); } else if (typeof module === 'object' && module.exports) { module.exports = factory(require('jquery')); } else { factory(jQuery); } }(function($) { var slice = Array.prototype.slice; var splice = Array.prototype.splice; var defaults = { topSpacing: 0, bottomSpacing: 0, className: 'is-sticky', wrapperClassName: 'sticky-wrapper', center: false, getWidthFrom: '', widthFromWrapper: true, responsiveWidth: false, zIndex: 'auto' },
        $window = $(window),
        $document = $(document),
        sticked = [],
        windowHeight = $window.height(),
        scroller = function() { var scrollTop = $window.scrollTop(),
                documentHeight = $document.height(),
                dwh = documentHeight - windowHeight,
                extra = (scrollTop > dwh) ? dwh - scrollTop : 0; for (var i = 0, l = sticked.length; i < l; i++) { var s = sticked[i],
                    elementTop = s.stickyWrapper.offset().top,
                    etse = elementTop - s.topSpacing - extra;
                s.stickyWrapper.css('height', s.stickyElement.outerHeight()); if (scrollTop <= etse) { if (s.currentTop !== null) { s.stickyElement.css({ 'width': '', 'position': '', 'top': '', 'z-index': '' });
                        s.stickyElement.parent().removeClass(s.className);
                        s.stickyElement.trigger('sticky-end', [s]);
                        s.currentTop = null; } } else { var newTop = documentHeight - s.stickyElement.outerHeight() - s.topSpacing - s.bottomSpacing - scrollTop - extra; if (newTop < 0) { newTop = newTop + s.topSpacing; } else { newTop = s.topSpacing; } if (s.currentTop !== newTop) { var newWidth; if (s.getWidthFrom) { newWidth = $(s.getWidthFrom).width() || null; } else if (s.widthFromWrapper) { newWidth = s.stickyWrapper.width(); } if (newWidth == null) { newWidth = s.stickyElement.width(); }
                        s.stickyElement.css('width', newWidth).css('position', 'fixed').css('top', newTop).css('z-index', s.zIndex);
                        s.stickyElement.parent().addClass(s.className); if (s.currentTop === null) { s.stickyElement.trigger('sticky-start', [s]); } else { s.stickyElement.trigger('sticky-update', [s]); } if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) { s.stickyElement.trigger('sticky-bottom-reached', [s]); } else if (s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) { s.stickyElement.trigger('sticky-bottom-unreached', [s]); }
                        s.currentTop = newTop; } var stickyWrapperContainer = s.stickyWrapper.parent(); var unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing); if (unstick) { s.stickyElement.css('position', 'absolute').css('top', '').css('bottom', 0).css('z-index', ''); } else { s.stickyElement.css('position', 'fixed').css('top', newTop).css('bottom', '').css('z-index', s.zIndex); } } } },
        resizer = function() { windowHeight = $window.height(); for (var i = 0, l = sticked.length; i < l; i++) { var s = sticked[i]; var newWidth = null; if (s.getWidthFrom) { if (s.responsiveWidth) { newWidth = $(s.getWidthFrom).width(); } } else if (s.widthFromWrapper) { newWidth = s.stickyWrapper.width(); } if (newWidth != null) { s.stickyElement.css('width', newWidth); } } },
        methods = { init: function(options) { return this.each(function() { var o = $.extend({}, defaults, options); var stickyElement = $(this); var stickyId = stickyElement.attr('id'); var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName; var wrapper = $('<div></div>').attr('id', wrapperId).addClass(o.wrapperClassName);
                    stickyElement.wrapAll(function() { if ($(this).parent("#" + wrapperId).length == 0) { return wrapper; } }); var stickyWrapper = stickyElement.parent(); if (o.center) { stickyWrapper.css({ width: stickyElement.outerWidth(), marginLeft: "auto", marginRight: "auto" }); } if (stickyElement.css("float") === "right") { stickyElement.css({ "float": "none" }).parent().css({ "float": "right" }); }
                    o.stickyElement = stickyElement;
                    o.stickyWrapper = stickyWrapper;
                    o.currentTop = null;
                    sticked.push(o);
                    methods.setWrapperHeight(this);
                    methods.setupChangeListeners(this); }); }, setWrapperHeight: function(stickyElement) { var element = $(stickyElement); var stickyWrapper = element.parent(); if (stickyWrapper) { stickyWrapper.css('height', element.outerHeight()); } }, setupChangeListeners: function(stickyElement) { if (window.MutationObserver) { var mutationObserver = new window.MutationObserver(function(mutations) { if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) { methods.setWrapperHeight(stickyElement); } });
                    mutationObserver.observe(stickyElement, { subtree: true, childList: true }); } else { if (window.addEventListener) { stickyElement.addEventListener('DOMNodeInserted', function() { methods.setWrapperHeight(stickyElement); }, false);
                        stickyElement.addEventListener('DOMNodeRemoved', function() { methods.setWrapperHeight(stickyElement); }, false); } else if (window.attachEvent) { stickyElement.attachEvent('onDOMNodeInserted', function() { methods.setWrapperHeight(stickyElement); });
                        stickyElement.attachEvent('onDOMNodeRemoved', function() { methods.setWrapperHeight(stickyElement); }); } } }, update: scroller, unstick: function(options) { return this.each(function() { var that = this; var unstickyElement = $(that); var removeIdx = -1; var i = sticked.length; while (i-- > 0) { if (sticked[i].stickyElement.get(0) === that) { splice.call(sticked, i, 1);
                            removeIdx = i; } } if (removeIdx !== -1) { unstickyElement.unwrap();
                        unstickyElement.css({ 'width': '', 'position': '', 'top': '', 'float': '', 'z-index': '' }); } }); } }; if (window.addEventListener) { window.addEventListener('scroll', scroller, false);
        window.addEventListener('resize', resizer, false); } else if (window.attachEvent) { window.attachEvent('onscroll', scroller);
        window.attachEvent('onresize', resizer); }
    $.fn.sticky = function(method) { if (methods[method]) { return methods[method].apply(this, slice.call(arguments, 1)); } else if (typeof method === 'object' || !method) { return methods.init.apply(this, arguments); } else { $.error('Method ' + method + ' does not exist on jQuery.sticky'); } };
    $.fn.unstick = function(method) { if (methods[method]) { return methods[method].apply(this, slice.call(arguments, 1)); } else if (typeof method === 'object' || !method) { return methods.unstick.apply(this, arguments); } else { $.error('Method ' + method + ' does not exist on jQuery.sticky'); } };
    $(function() { setTimeout(scroller, 0); }); }));
$(document).ready(function() { var e = { responsive: !0 };
    $('[data-toggle="parallax-bg"], [data-toggle="parallax-element"]').each(function() { var e = $(this),
            t = e.data("toggle"),
            n = e.data("bg-img") || null,
            r = e.data("settings") || null; if (t === "parallax-bg") { e.css("backgroundImage", "url(" + n + ")").addClass("block-bg-img");
            e.attr("data-stellar-background-ratio") } else if (t === "parallax-element") { e.attr("data-stellar-ratio");
            e.addClass("parallax-element") }
        $.each(r, function(t, n) { e.attr("data-" + t, n) }) });
    $.stellar.positionProperty.parallaxPosition = { setTop: function(e, t, n) { var r = e.data("vpos") || null;
            r !== null ? e.css(r) : e.css("top", t) }, setLeft: function(e, t, n) { var r = e.data("hpos") || null;
            r !== null ? $.each(r, function(t, n) { e.css(t, n) }) : e.css("left", t) } };
    e.positionProperty = "parallaxPosition";
    $.stellar(e) });
(function(e, p) { e.extend({ lockfixed: function(a, b) { b && b.offset ? (b.offset.bottom = parseInt(b.offset.bottom, 10), b.offset.top = parseInt(b.offset.top, 10)) : b.offset = { bottom: 100, top: 0 }; if ((a = e(a)) && a.offset()) { var n = a.css("position"),
                    c = parseInt(a.css("marginTop"), 10),
                    l = a.css("top"),
                    k = a.offset().top,
                    f = !1; if (!0 === b.forcemargin || navigator.userAgent.match(/\bMSIE (4|5|6)\./) || navigator.userAgent.match(/\bOS ([0-9])_/) || navigator.userAgent.match(/\bAndroid ([0-9])\./i)) f = !0;
                a.wrap("<div class='lf-ghost' style='height:" + a.outerHeight() + "px;display:" + a.css("display") + "'></div>");
                e(window).bind("DOMContentLoaded load scroll resize orientationchange lockfixed:pageupdate", a, function(g) { if (!f || !document.activeElement || "INPUT" !== document.activeElement.nodeName) { var d = 0,
                            d = a.outerHeight();
                        g = a.parent().innerWidth() - parseInt(a.css("marginLeft"), 10) - parseInt(a.css("marginRight"), 10); var m = e(document).height() - b.offset.bottom,
                            h = e(window).scrollTop(); "fixed" === a.css("position") || f || (k = a.offset().top, l = a.css("top"));
                        h >= k - (c ? c : 0) - b.offset.top ? (d = m < h + d + c + b.offset.top ? h + d + c + b.offset.top - m : 0, f ? a.css({ marginTop: parseInt(h - k - d, 10) + 2 * b.offset.top + "px" }) : a.css({ position: "fixed", top: b.offset.top - d + "px", width: g + "px" })) : a.css({ position: n, top: l, width: g + "px", marginTop: (c && !f ? c : 0) + "px" }) } }) } } }) })(jQuery);;
(function(factory) { 'use strict'; if (typeof define === 'function' && define.amd) { define(['jquery'], factory); } else if (jQuery && !jQuery.fn.hoverIntent) { factory(jQuery); } })(function($) { 'use strict'; var _cfg = { interval: 100, sensitivity: 6, timeout: 0 }; var INSTANCE_COUNT = 0; var cX, cY; var track = function(ev) { cX = ev.pageX;
        cY = ev.pageY; }; var compare = function(ev, $el, s, cfg) { if (Math.sqrt((s.pX - cX) * (s.pX - cX) + (s.pY - cY) * (s.pY - cY)) < cfg.sensitivity) { $el.off(s.event, track);
            delete s.timeoutId;
            s.isActive = true;
            ev.pageX = cX;
            ev.pageY = cY;
            delete s.pX;
            delete s.pY; return cfg.over.apply($el[0], [ev]); } else { s.pX = cX;
            s.pY = cY;
            s.timeoutId = setTimeout(function() { compare(ev, $el, s, cfg); }, cfg.interval); } }; var delay = function(ev, $el, s, out) { delete $el.data('hoverIntent')[s.id]; return out.apply($el[0], [ev]); };
    $.fn.hoverIntent = function(handlerIn, handlerOut, selector) { var instanceId = INSTANCE_COUNT++; var cfg = $.extend({}, _cfg); if ($.isPlainObject(handlerIn)) { cfg = $.extend(cfg, handlerIn); if (!$.isFunction(cfg.out)) { cfg.out = cfg.over; } } else if ($.isFunction(handlerOut)) { cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector }); } else { cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut }); } var handleHover = function(e) { var ev = $.extend({}, e); var $el = $(this); var hoverIntentData = $el.data('hoverIntent'); if (!hoverIntentData) { $el.data('hoverIntent', (hoverIntentData = {})); } var state = hoverIntentData[instanceId]; if (!state) { hoverIntentData[instanceId] = state = { id: instanceId }; } if (state.timeoutId) { state.timeoutId = clearTimeout(state.timeoutId); } var mousemove = state.event = 'mousemove.hoverIntent.hoverIntent' + instanceId; if (e.type === 'mouseenter') { if (state.isActive) { return; }
                state.pX = ev.pageX;
                state.pY = ev.pageY;
                $el.off(mousemove, track).on(mousemove, track);
                state.timeoutId = setTimeout(function() { compare(ev, $el, state, cfg); }, cfg.interval); } else { if (!state.isActive) { return; }
                $el.off(mousemove, track);
                state.timeoutId = setTimeout(function() { delay(ev, $el, state, cfg.out); }, cfg.timeout); } }; return this.on({ 'mouseenter.hoverIntent': handleHover, 'mouseleave.hoverIntent': handleHover }, cfg.selector); }; });
(function(factory) { if (typeof define === "function" && define.amd) { define(['jquery'], function($) { return factory($); }); } else if (typeof module === "object" && typeof module.exports === "object") { exports = factory(require('jquery')); } else { factory(jQuery); } })(function($) { $.easing['jswing'] = $.easing['swing']; var pow = Math.pow,
        sqrt = Math.sqrt,
        sin = Math.sin,
        cos = Math.cos,
        PI = Math.PI,
        c1 = 1.70158,
        c2 = c1 * 1.525,
        c3 = c1 + 1,
        c4 = (2 * PI) / 3,
        c5 = (2 * PI) / 4.5;

    function bounceOut(x) { var n1 = 7.5625,
            d1 = 2.75; if (x < 1 / d1) { return n1 * x * x; } else if (x < 2 / d1) { return n1 * (x -= (1.5 / d1)) * x + .75; } else if (x < 2.5 / d1) { return n1 * (x -= (2.25 / d1)) * x + .9375; } else { return n1 * (x -= (2.625 / d1)) * x + .984375; } }
    $.extend($.easing, { def: 'easeOutQuad', swing: function(x) { return $.easing[$.easing.def](x); }, easeInQuad: function(x) { return x * x; }, easeOutQuad: function(x) { return 1 - (1 - x) * (1 - x); }, easeInOutQuad: function(x) { return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2; }, easeInCubic: function(x) { return x * x * x; }, easeOutCubic: function(x) { return 1 - pow(1 - x, 3); }, easeInOutCubic: function(x) { return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2; }, easeInQuart: function(x) { return x * x * x * x; }, easeOutQuart: function(x) { return 1 - pow(1 - x, 4); }, easeInOutQuart: function(x) { return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2; }, easeInQuint: function(x) { return x * x * x * x * x; }, easeOutQuint: function(x) { return 1 - pow(1 - x, 5); }, easeInOutQuint: function(x) { return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2; }, easeInSine: function(x) { return 1 - cos(x * PI / 2); }, easeOutSine: function(x) { return sin(x * PI / 2); }, easeInOutSine: function(x) { return -(cos(PI * x) - 1) / 2; }, easeInExpo: function(x) { return x === 0 ? 0 : pow(2, 10 * x - 10); }, easeOutExpo: function(x) { return x === 1 ? 1 : 1 - pow(2, -10 * x); }, easeInOutExpo: function(x) { return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? pow(2, 20 * x - 10) / 2 : (2 - pow(2, -20 * x + 10)) / 2; }, easeInCirc: function(x) { return 1 - sqrt(1 - pow(x, 2)); }, easeOutCirc: function(x) { return sqrt(1 - pow(x - 1, 2)); }, easeInOutCirc: function(x) { return x < 0.5 ? (1 - sqrt(1 - pow(2 * x, 2))) / 2 : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2; }, easeInElastic: function(x) { return x === 0 ? 0 : x === 1 ? 1 : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4); }, easeOutElastic: function(x) { return x === 0 ? 0 : x === 1 ? 1 : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1; }, easeInOutElastic: function(x) { return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2 : pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5) / 2 + 1; }, easeInBack: function(x) { return c3 * x * x * x - c1 * x * x; }, easeOutBack: function(x) { return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2); }, easeInOutBack: function(x) { return x < 0.5 ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2; }, easeInBounce: function(x) { return 1 - bounceOut(1 - x); }, easeOutBounce: bounceOut, easeInOutBounce: function(x) { return x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2; } }); });
$(document).ready(function() {

    // Smooth scrolling
    $(function() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, 'easeInOutExpo');

                    if ($(this).parents('.nav-menu').length) {
                        $('.nav-menu .menu-active').removeClass('menu-active');
                        $(this).closest('li').addClass('menu-active');
                    }

                    if ($('body').hasClass('mobile-nav-active')) {
                        $('body').removeClass('mobile-nav-active');
                        $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                        $('#mobile-body-overly').fadeOut();
                    }
                    return false;
                }
            }
        });
    });

    // Initiate superfish on nav menu
    $('.nav-menu').superfish({
        animation: { opacity: 'show' },
        speed: 400
    });

    // Mobile Navigation
    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({ id: 'mobile-nav' });
        $mobile_nav.find('> ul').attr({ 'class': '', 'id': '' });
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function(e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("fa-chevron-up fa-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function(e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function(e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    $(window).scroll(function(e) {
        var $el = $('.fixedElement');
        var isPositionFixed = ($el.css('position') == 'fixed');
        if ($(this).scrollTop() > 20 && !isPositionFixed) {
            $('.fixedElement').css({ 'position': 'fixed', 'top': '0px' });
        }
        if ($(this).scrollTop() < 20 && isPositionFixed) {
            $('.fixedElement').css({ 'position': 'static', 'top': '0px' });
        }
    });

    // Counting numbers

    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 1000
    });

    // Tooltip & popovers
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    // Background image via data tag
    $('[data-block-bg-img]').each(function() {
        // @todo - invoke backstretch plugin if multiple images
        var $this = $(this),
            bgImg = $this.data('block-bg-img');

        $this.css('backgroundImage', 'url(' + bgImg + ')').addClass('block-bg-img');
    });

    // jQuery counterUp
    if (jQuery().counterUp) {
        $('[data-counter-up]').counterUp({
            delay: 20,
        });
    }

    //Scroll Top link
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.scrolltop').fadeIn();
        } else {
            $('.scrolltop').fadeOut();
        }
    });

    $('.scrolltop, #logo a').click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 1000, 'easeInOutExpo');
        return false;
    });

});
(function(e) { "use strict";
    e.fn.counterUp = function(t) { var n = e.extend({ time: 400, delay: 10 }, t); return this.each(function() { var t = e(this),
                r = n,
                i = function() { var e = [],
                        n = r.time / r.delay,
                        i = t.text(),
                        s = /[0-9]+,[0-9]+/.test(i);
                    i = i.replace(/,/g, ""); var o = /^[0-9]+$/.test(i),
                        u = /^[0-9]+\.[0-9]+$/.test(i),
                        a = u ? (i.split(".")[1] || []).length : 0; for (var f = n; f >= 1; f--) { var l = parseInt(i / n * f);
                        u && (l = parseFloat(i / n * f).toFixed(a)); if (s)
                            while (/(\d+)(\d{3})/.test(l.toString())) l = l.toString().replace(/(\d+)(\d{3})/, "$1,$2");
                        e.unshift(l) }
                    t.data("counterup-nums", e);
                    t.text("0"); var c = function() { t.text(t.data("counterup-nums").shift()); if (t.data("counterup-nums").length) setTimeout(t.data("counterup-func"), r.delay);
                        else { delete t.data("counterup-nums");
                            t.data("counterup-nums", null);
                            t.data("counterup-func", null) } };
                    t.data("counterup-func", c);
                    setTimeout(t.data("counterup-func"), r.delay) };
            t.waypoint(i, { offset: "100%", triggerOnce: !0 }) }) } })(jQuery);