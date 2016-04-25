 // classie - class helper functions
 // from bonzo https://github.com/ded/bonzo
 // 
 // classie.has( elem, 'my-class' ) -> true/false
 // classie.add( elem, 'my-new-class' )
 // classie.remove( elem, 'my-unwanted-class' )
 // classie.toggle( elem, 'my-class' )
 

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

(function (window) {

    'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

    function classReg(className) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ('classList' in document.documentElement) {
        hasClass = function (elem, c) {
            return elem.classList.contains(c);
        };
        addClass = function (elem, c) {
            elem.classList.add(c);
        };
        removeClass = function (elem, c) {
            elem.classList.remove(c);
        };
    }
    else {
        hasClass = function (elem, c) {
            return classReg(c).test(elem.className);
        };
        addClass = function (elem, c) {
            if (!hasClass(elem, c)) {
                elem.className = elem.className + ' ' + c;
            }
        };
        removeClass = function (elem, c) {
            elem.className = elem.className.replace(classReg(c), ' ');
        };
    }

    function toggleClass(elem, c) {
        var fn = hasClass(elem, c) ? removeClass : addClass;
        fn(elem, c);
    }

    var classie = {
        // full names
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        // short names
        has: hasClass,
        add: addClass,
        remove: removeClass,
        toggle: toggleClass
    };

// transport
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(classie);
        window.classie = classie;
    } else {
        // browser global
        window.classie = classie;
    }

})(window);

/**
 * animOnScroll.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;
(function (window) {

    'use strict';

    var docElem = window.document.documentElement;
    var slice = [].slice,
        CACH = {
            len: 0
        };

    function getViewportH() {
        var client = docElem['clientHeight'],//可见区域高度
            inner = window['innerHeight'];//窗口的高度(不包含工具条与滚动条)

        if (client < inner)
            return inner;
        else
            return client;
    }

    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
        //pageYOffset：当前页面相对于窗口显示区左上角的 Y 位置 ==> y方向滚动距离
        //scrollTop：设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离 ==> 被遮掉的内容高度
    }

    // http://stackoverflow.com/a/5598797/989439
    function getOffset(el) {
        var offsetTop = 0, offsetLeft = 0;
        do {
            if (!isNaN(el.offsetTop)) {
                //offsetTop:获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置
                offsetTop += el.offsetTop;
            }
            if (!isNaN(el.offsetLeft)) {
                offsetLeft += el.offsetLeft;
            }
            //offsetParent：返回一个对象的引用，这个对象是距离调用offsetParent的元素最近的
        } while (el = el.offsetParent)

        return {
            top: offsetTop,
            left: offsetLeft
        }
    }

    function inViewport(el, h) {
        var elH = el.offsetHeight,//元素的高，包含边框 (border) 与边距 (padding) ，但不包含边界 (margin)
            scrolled = scrollY(),//y方向滚动距离
            viewed = scrolled + getViewportH(),//滚动距离 + 可见区域高度
            elTop = getOffset(el).top,//元素顶部到顶层元素的距离
            elBottom = elTop + elH,//元素底部到顶层元素的距离
        // if 0, the element is considered in the viewport as soon as it enters.
        // if 1, the element is considered in the viewport only when it's fully inside
        // value in percentage (1 >= h >= 0)
            h = h || 0;

        return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
    }

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function isLazy(el, flg) {
        return el.tagName.toUpperCase() === 'IMG'
            || el.querySelectorAll('*[' + flg + ']').length > 0;
    };

    function addEffect(flg) {
        return flg
            ? function (el, opt) {
            var effect = opt.imgEffect + opt.effect.replace('effect-', '');
            classie.add(el, effect || 'shown');
        } : function (el) {
            classie.add(el, 'shown');
        };
    };

    function AnimOnScroll(el, options) {
        if (!(this instanceof AnimOnScroll)) {
            return new AnimOnScroll(el, options);
        }
        this.el = el;
        this.childrens = el.children;
        this.cLen = el.children.length;
        this.options = extend(this.defaults, options);
        this._init();
    };

    AnimOnScroll.prototype = {
        defaults: {
            minDuration: 0,//动画周期（下限）
            maxDuration: 0,//动画周期（上限）
            viewportFactor: 0,//对象显示%时，才触发lazyload
            scrollFlg: true,//滚动时触发
            resizeFlg: false,//视口变化时触发
            animGrid: '_animGrid',//主容器class
            animGridEl: '._animGridEl',//第一层子容器class
            dataFlg: 'data-lazy-url',//自定义属性
            flg: 'lazyUrl',//自定义属性（格式化）
            effect: 'effect-2',//效果（1-8）
            imgEffect: '_animImg-',//图片效果（1-8）
            imgOnly: false,//是否只对图片添加效果
            cover: false//全部元素加效果
        },

        _init: function () {
            var self = this, opt = self.options, children;
            if (!opt.imgOnly) {
                classie.add(self.el, opt.animGrid);
                classie.add(self.el, opt.effect);
            }
            self._addEffect = addEffect(opt.imgOnly);
            self.items = slice.call(opt.tag
                ? self.el.querySelectorAll(opt.tag)
                : self.el.querySelectorAll(opt.animGridEl));
            self.itemsCount = self.items.length;
            self.itemsRenderedCount = 0;
            self.didScroll = false;

            if (self.itemsCount === 0) {
                children = slice.call(self.childrens);
                opt.cover
                    ? children.forEach(function (c, i) {
                    classie.add(c, '_animGridEl');
                })
                    : children.forEach(function (c, i) {
                    isLazy(c, opt.dataFlg) && classie.add(c, '_animGridEl');
                });
                self.items = children;
                self.itemsCount = children.length;
            }

            self.items.forEach(function (el, i) {
                if (self.el.style.display != "" && inViewport(el, self.viewportFactor)) {
                    self._checkTotalRendered();
                    classie.add(el, 'shown');
                    self._lazyImgLoad(el);
                }
            });
            var scrollName = "scroll" + (++AnimOnScroll.prototype.appliCount);
            window[scrollName] = function () {
                self._onScrollFn();
            };
            opt.scrollFlg && window.addEventListener('scroll', window[scrollName], false);
            opt.resizeable && window.addEventListener('resize', function () {
                self._resizeHandler();
            }, false);
            self._onScrollFn();
            window.onpopstate = function () {
                for (var i = 1; i <= AnimOnScroll.prototype.appliCount; i++) {
                    window.removeEventListener('scroll', window["scroll" + i], false);
                }
                AnimOnScroll.prototype.appliCount = 0;
            }
        },

        _onScrollFn: function () {
            var self = this;
            if (!this.didScroll) {
                this.didScroll = true;
                setTimeout(function () {
                    self._scrollPage();
                }, 60);
            }
        },
        appliCount: 0,
        _scrollPage: function () {
            var self = this;
            self._checkUpdate();
            self.items.forEach(function (el, i) {
                if (self.options.effectOnly || !classie.has(el, 'shown') && !classie.has(el, 'animate') && inViewport(el, self.options.viewportFactor)) {
                    var perspY = scrollY() + getViewportH() / 2;
                    self.el.style.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
                    //self.el.style.MozPerspectiveOrigin = '50% ' + perspY + 'px';
                    self.el.style.perspectiveOrigin = '50% ' + perspY + 'px';
                    self._checkTotalRendered();
                    if (self.options.minDuration && self.options.maxDuration) {
                        var randDuration = ( Math.random() * ( self.options.maxDuration - self.options.minDuration ) + self.options.minDuration ) + 's';
                        el.style.WebkitAnimationDuration = randDuration;
                        //el.style.MozAnimationDuration = randDuration;
                        el.style.animationDuration = randDuration;
                    }
                    classie.add(el, 'animate');
                    self._lazyImgLoad(el);
                }
            });
            this.didScroll = false;
        },

        _resizeHandler: function () {
            var self = this;

            function delayed() {
                self._scrollPage();
                self.resizeTimeout = null;
            }

            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(delayed, 1000);
        },

        _checkTotalRendered: function () {
            ++this.itemsRenderedCount;
            if (this.itemsRenderedCount === this.itemsCount) {
                window.removeEventListener('scroll', this._onScrollFn);
            }
        },

        _lazyImgLoad: function (el) {
            var self = this, opt = self.options;
            var lazyUrl, children = el.querySelectorAll('*[' + opt.dataFlg + ']');
            if (lazyUrl = el.dataset[opt.flg]) {
                setImg(el, lazyUrl);
            }
            slice.call(children).forEach(function (child) {
                lazyUrl = child.dataset[opt.flg];
                lazyUrl && setImg(child, lazyUrl);
            });
            function setImg(el, url) {
                if (el.tagName.toUpperCase() == 'IMG') {
                    el.setAttribute('src', url);
                    el.onload = function () {
                        self._addEffect(el, opt);
                    };
                    return;
                }
                var img = new Image();
                img.src = url;
                img.onload = function () {
                    el.style.backgroundImage = "url('" + url + "')";
                    self._addEffect(el, opt);
                };
                img.onerror = function () {
                    el.style.opacity = "1";
                }
            };
        },

        _checkUpdate: function () {
            var self = this, len, cLen = self.childrens.length;
            if ((len = cLen - self.cLen) >= 0) {
                self.items = slice.call(self.childrens, -len);
                self.items.forEach(function (c, i) {
                    classie.add(c, '_animGridEl');
                })
                self.cLen = cLen;
                self.itemsCount = len;
                self.itemsRenderedCount = 0;
            }
        }
    }

    // add to global namespace
    window.AnimOnScroll = AnimOnScroll;

})(window);