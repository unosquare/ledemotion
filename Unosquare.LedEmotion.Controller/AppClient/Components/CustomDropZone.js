! function (e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("react"), require("react-dom")) : "function" == typeof define && define.amd ? define(["react", "react-dom"], t) : "object" == typeof exports ? exports.ReactDropzone = t(require("react"), require("react-dom")) : e.ReactDropzone = t(e.React, e.ReactDOM)
}(this, function (e, t) {
    return function (e) {
        function t(n) {
            if (i[n]) return i[n].exports;
            var r = i[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return e[n].call(r.exports, r, r.exports, t), r.l = !0, r.exports
        }
        var i = {};
        return t.m = e, t.c = i, t.d = function (e, i, n) {
            t.o(e, i) || Object.defineProperty(e, i, {
                configurable: !1,
                enumerable: !0,
                get: n
            })
        }, t.n = function (e) {
            var i = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return t.d(i, "a", i), i
        }, t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = "", t(t.s = 1)
    }([
        function (t, i) {
            t.exports = e
        },
        function (e, t, i) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.DropzoneComponent = void 0;
            var r = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
                o = n(i(0)),
                s = n(i(2)),
                a = n(i(3)),
                l = i(4),
                u = null,
                c = t.DropzoneComponent = function (e) {
                    function t(e) {
                        ! function (e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this, t);
                        var i = function (e, t) {
                            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return !t || "object" != typeof t && "function" != typeof t ? e : t
                        }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                        return i.state = {
                            files: []
                        }, i
                    }
                    return function (e, t) {
                        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                        e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                    }(t, o.default.Component), r(t, [{
                        key: "getDjsConfig",
                        value: function () {
                            var e = {
                                url: this.props.config.postUrl ? this.props.config.postUrl : null
                            };
                            return this.props.djsConfig ? (0, a.default)(!0, {}, e, this.props.djsConfig) : e
                        }
                    }, {
                        key: "componentDidMount",
                        value: function () {
                            var e = this.getDjsConfig();
                            (u = u || i(5)).autoDiscover = !1, this.props.config.postUrl || this.props.eventHandlers.drop /* || console.info('Neither postUrl nor a "drop" eventHandler specified, the React-Dropzone component might misbehave.'); */
                            var t = this.props.config.dropzoneSelector || s.default.findDOMNode(this);
                            this.dropzone = new u(t, e), this.setupEvents()
                        }
                    }, {
                        key: "componentWillUnmount",
                        value: function () {
                            var e = this;
                            if (this.dropzone)
                                if (this.dropzone.getActiveFiles().length > 0) {
                                    this.queueDestroy = !0;
                                    var t = window.setInterval(function () {
                                        return !1 === e.queueDestroy ? window.clearInterval(t) : 0 === e.dropzone.getActiveFiles().length ? (e.dropzone = e.destroy(e.dropzone), window.clearInterval(t)) : void 0
                                    }, 500)
                                } else this.dropzone = this.destroy(this.dropzone)
                        }
                    }, {
                        key: "componentDidUpdate",
                        value: function () {
                            if (this.queueDestroy = !1, !this.dropzone) {
                                var e = this.props.config.dropzoneSelector || s.default.findDOMNode(this);
                                this.dropzone = new u(e, this.getDjsConfig())
                            }
                        }
                    }, {
                        key: "componentWillUpdate",
                        value: function () {
                            var e = void 0,
                                t = void 0;
                            e = this.props.djsConfig ? this.props.djsConfig : {};
                            try {
                                t = this.props.config.postUrl ? {
                                    url: this.props.config.postUrl
                                } : {}
                            } catch (e) {
                                t = {}
                            }
                            this.dropzone.options = (0, a.default)(!0, {}, this.dropzone.options, e, t)
                        }
                    }, {
                        key: "render",
                        value: function () {
                            var e = [],
                                t = this.state.files,
                                i = this.props.config,
                                n = this.props.className ? "filepicker dropzone " + this.props.className : "filepicker dropzone";
                            if (i.showFiletypeIcon && i.iconFiletypes && (!t || t.length < 1))
                                for (var r = 0; r < this.props.config.iconFiletypes.length; r += 1) e.push(o.default.createElement(l.Icon, {
                                    filetype: i.iconFiletypes[r],
                                    key: "icon-component" + r
                                }));
                            return !this.props.config.postUrl && this.props.action ? o.default.createElement("form", {
                                action: this.props.action,
                                className: n
                            }, e, this.props.children) : o.default.createElement("div", {
                                className: n
                            }, " ", e, " ", this.props.children, " ")
                        }
                    }, {
                        key: "setupEvents",
                        value: function () {
                            var e = this,
                                t = this.props.eventHandlers;
                            if (this.dropzone && t) {
                                for (var i in t)
                                    if (t.hasOwnProperty(i) && t[i])
                                        if ("[object Array]" === Object.prototype.toString.call(t[i]))
                                            for (var n = 0; n < t[i].length; n += 1) "init" === i ? t[i][n](this.dropzone) : this.dropzone.on(i, t[i][n]);
                                        else "init" === i ? t[i](this.dropzone) : this.dropzone.on(i, t[i]);
                                this.dropzone.on("addedfile", function (t) {
                                    if (t) {
                                        /* console.log(e.state.files.length) */
                                        if (e.state.files.length < this.options.maxFiles) {
                                            var i = e.state.files || [];
                                            i.push(t), e.setState({
                                                files: i
                                            })
                                        } else {
                                            var i = e.state.files || [];
                                            i, e.setState({
                                                files: i
                                            })
                                        }
                                    }
                                }), this.dropzone.on("removedfile", function (t) {
                                    if (t) {
                                        var i = e.state.files || [];
                                        i.forEach(function (e, n) {
                                            e.name === t.name && e.size === t.size && i.splice(n, 1)
                                        }), e.setState({
                                            files: i
                                        })
                                    }
                                })
                            }
                        }
                    }, {
                        key: "destroy",
                        value: function (e) {
                            return e.off(), e.destroy()
                        }
                    }]), t
                }();
            c.defaultProps = {
                djsConfig: {},
                config: {},
                eventHandlers: {}
            }, t.default = c
        },
        function (e, i) {
            e.exports = t
        },
        function (e, t, i) {
            "use strict";
            var n = Object.prototype.hasOwnProperty,
                r = Object.prototype.toString,
                o = function (e) {
                    return "function" == typeof Array.isArray ? Array.isArray(e) : "[object Array]" === r.call(e)
                },
                s = function (e) {
                    if (!e || "[object Object]" !== r.call(e)) return !1;
                    var t = n.call(e, "constructor"),
                        i = e.constructor && e.constructor.prototype && n.call(e.constructor.prototype, "isPrototypeOf");
                    if (e.constructor && !t && !i) return !1;
                    var o;
                    for (o in e);
                    return void 0 === o || n.call(e, o)
                };
            e.exports = function e() {
                var t, i, n, r, a, l, u = arguments[0],
                    c = 1,
                    d = arguments.length,
                    p = !1;
                for ("boolean" == typeof u && (p = u, u = arguments[1] || {}, c = 2), (null == u || "object" != typeof u && "function" != typeof u) && (u = {}); c < d; ++c)
                    if (null != (t = arguments[c]))
                        for (i in t) n = u[i], u !== (r = t[i]) && (p && r && (s(r) || (a = o(r))) ? (a ? (a = !1, l = n && o(n) ? n : []) : l = n && s(n) ? n : {}, u[i] = e(p, l, r)) : void 0 !== r && (u[i] = r));
                return u
            }
        },
        function (e, t, i) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.Icon = void 0;
            var n = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(i(0));
            t.Icon = function (e) {
                return n.default.createElement("div", {
                    "data-filetype": e.filetype,
                    className: "filepicker-file-icon"
                })
            }
        },
        function (e, t, i) {
            "use strict";
            (function (e) {
                function t(e, t) {
                    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }

                function i(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }
                var n = function () {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function (t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                    r = function () {
                        function e() {
                            i(this, e)
                        }
                        return n(e, [{
                            key: "on",
                            value: function (e, t) {
                                return this._callbacks = this._callbacks || {}, this._callbacks[e] || (this._callbacks[e] = []), this._callbacks[e].push(t), this
                            }
                        }, {
                            key: "emit",
                            value: function (e) {
                                this._callbacks = this._callbacks || {};
                                var t = this._callbacks[e];
                                if (t) {
                                    for (var i = arguments.length, n = Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++) n[r - 1] = arguments[r];
                                    for (var o = 0, s = s = t; !(o >= s.length);) s[o++].apply(this, n)
                                }
                                return this
                            }
                        }, {
                            key: "off",
                            value: function (e, t) {
                                if (!this._callbacks || 0 === arguments.length) return this._callbacks = {}, this;
                                var i = this._callbacks[e];
                                if (!i) return this;
                                if (1 === arguments.length) return delete this._callbacks[e], this;
                                for (var n = 0; n < i.length; n++)
                                    if (i[n] === t) {
                                        i.splice(n, 1);
                                        break
                                    }
                                return this
                            }
                        }]), e
                    }(),
                    o = function (e) {
                        function o(e, n) {
                            i(this, o);
                            var r = t(this, (o.__proto__ || Object.getPrototypeOf(o)).call(this)),
                                s = void 0,
                                a = void 0;
                            if (r.element = e, r.version = o.version, r.defaultOptions.previewTemplate = r.defaultOptions.previewTemplate.replace(/\n*/g, ""), r.clickableElements = [], r.listeners = [], r.files = [], "string" == typeof r.element && (r.element = document.querySelector(r.element)), !r.element || null == r.element.nodeType) throw new Error("Invalid dropzone element.");
                            if (r.element.dropzone) throw new Error("Dropzone already attached.");
                            o.instances.push(r), r.element.dropzone = r;
                            var l = null != (a = o.optionsForElement(r.element)) ? a : {};
                            if (r.options = o.extend({}, r.defaultOptions, l, null != n ? n : {}), r.options.forceFallback || !o.isBrowserSupported()) {
                                var u;
                                return u = r.options.fallback.call(r), t(r, u)
                            }
                            /* if (null == r.options.url && (r.options.url = r.element.getAttribute("action")), !r.options.url) throw new Error("No URL provided."); */
                            if (r.options.acceptedFiles && r.options.acceptedMimeTypes) throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
                            if (r.options.uploadMultiple && r.options.chunking) throw new Error("You cannot set both: uploadMultiple and chunking.");
                            return r.options.acceptedMimeTypes && (r.options.acceptedFiles = r.options.acceptedMimeTypes, delete r.options.acceptedMimeTypes), null != r.options.renameFilename && (r.options.renameFile = function (e) {
                                return r.options.renameFilename.call(r, e.name, e)
                            }), r.options.method = r.options.method.toUpperCase(), (s = r.getExistingFallback()) && s.parentNode && s.parentNode.removeChild(s), !1 !== r.options.previewsContainer && (r.options.previewsContainer ? r.previewsContainer = o.getElement(r.options.previewsContainer, "previewsContainer") : r.previewsContainer = r.element), r.options.clickable && (!0 === r.options.clickable ? r.clickableElements = [r.element] : r.clickableElements = o.getElements(r.options.clickable, "clickable")), r.init(), r
                        }
                        return function (e, t) {
                            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                            e.prototype = Object.create(t && t.prototype, {
                                constructor: {
                                    value: e,
                                    enumerable: !1,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                        }(o, r), n(o, null, [{
                            key: "initClass",
                            value: function () {
                                this.prototype.Emitter = r, this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"], this.prototype.defaultOptions = {
                                    url: null,
                                    method: "post",
                                    withCredentials: !1,
                                    timeout: 3e4,
                                    parallelUploads: 2,
                                    uploadMultiple: !1,
                                    chunking: !1,
                                    forceChunking: !1,
                                    chunkSize: 2e6,
                                    parallelChunkUploads: !1,
                                    retryChunks: !1,
                                    retryChunksLimit: 3,
                                    maxFilesize: 256,
                                    paramName: "file",
                                    createImageThumbnails: !0,
                                    maxThumbnailFilesize: 10,
                                    thumbnailWidth: 120,
                                    thumbnailHeight: 120,
                                    thumbnailMethod: "crop",
                                    resizeWidth: null,
                                    resizeHeight: null,
                                    resizeMimeType: null,
                                    resizeQuality: .8,
                                    resizeMethod: "contain",
                                    filesizeBase: 1e3,
                                    maxFiles: null,
                                    headers: null,
                                    clickable: !0,
                                    ignoreHiddenFiles: !0,
                                    acceptedFiles: null,
                                    acceptedMimeTypes: null,
                                    autoProcessQueue: !0,
                                    autoQueue: !0,
                                    addRemoveLinks: !1,
                                    previewsContainer: null,
                                    hiddenInputContainer: "body",
                                    capture: null,
                                    renameFilename: null,
                                    renameFile: null,
                                    forceFallback: !1,
                                    dictDefaultMessage: "Drop files here to upload",
                                    dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
                                    dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
                                    dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                                    dictInvalidFileType: "You can't upload files of this type.",
                                    dictResponseError: "Server responded with {{statusCode}} code.",
                                    dictCancelUpload: "Cancel upload",
                                    dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
                                    dictRemoveFile: "Remove file",
                                    dictRemoveFileConfirmation: null,
                                    dictMaxFilesExceeded: "You can not upload any more files.",
                                    dictFileSizeUnits: {
                                        tb: "TB",
                                        gb: "GB",
                                        mb: "MB",
                                        kb: "KB",
                                        b: "b"
                                    },
                                    init: function () { },
                                    params: function (e, t, i) {
                                        if (i) return {
                                            dzuuid: i.file.upload.uuid,
                                            dzchunkindex: i.index,
                                            dztotalfilesize: i.file.size,
                                            dzchunksize: this.options.chunkSize,
                                            dztotalchunkcount: i.file.upload.totalChunkCount,
                                            dzchunkbyteoffset: i.index * this.options.chunkSize
                                        }
                                    },
                                    accept: function (e, t) {
                                        return t()
                                    },
                                    chunksUploaded: function (e, t) {
                                        t()
                                    },
                                    fallback: function () {
                                        var e = void 0;
                                        this.element.className = this.element.className + " dz-browser-not-supported";
                                        for (var t = 0, i = i = this.element.getElementsByTagName("div"); ;) {
                                            var n;
                                            if (t >= i.length) break;
                                            var r = n = i[t++];
                                            if (/(^| )dz-message($| )/.test(r.className)) {
                                                e = r, r.className = "dz-message";
                                                break
                                            }
                                        }
                                        e || (e = o.createElement('<div class="dz-message"><span></span></div>'), this.element.appendChild(e));
                                        var s = e.getElementsByTagName("span")[0];
                                        return s && (null != s.textContent ? s.textContent = this.options.dictFallbackMessage : null != s.innerText && (s.innerText = this.options.dictFallbackMessage)), this.element.appendChild(this.getFallbackForm())
                                    },
                                    resize: function (e, t, i, n) {
                                        var r = {
                                            srcX: 0,
                                            srcY: 0,
                                            srcWidth: e.width,
                                            srcHeight: e.height
                                        },
                                            o = e.width / e.height;
                                        null == t && null == i ? (t = r.srcWidth, i = r.srcHeight) : null == t ? t = i * o : null == i && (i = t / o);
                                        var s = (t = Math.min(t, r.srcWidth)) / (i = Math.min(i, r.srcHeight));
                                        if (r.srcWidth > t || r.srcHeight > i)
                                            if ("crop" === n) o > s ? (r.srcHeight = e.height, r.srcWidth = r.srcHeight * s) : (r.srcWidth = e.width, r.srcHeight = r.srcWidth / s);
                                            else {
                                                if ("contain" !== n) throw new Error("Unknown resizeMethod '" + n + "'");
                                                o > s ? i = t / o : t = i * o
                                            }
                                        return r.srcX = (e.width - r.srcWidth) / 2, r.srcY = (e.height - r.srcHeight) / 2, r.trgWidth = t, r.trgHeight = i, r
                                    },
                                    transformFile: function (e, t) {
                                        return (this.options.resizeWidth || this.options.resizeHeight) && e.type.match(/image.*/) ? this.resizeImage(e, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, t) : t(e)
                                    },
                                    previewTemplate: '<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>',
                                    drop: function (e) {
                                        return this.element.classList.remove("dz-drag-hover")
                                    },
                                    dragstart: function (e) { },
                                    dragend: function (e) {
                                        return this.element.classList.remove("dz-drag-hover")
                                    },
                                    dragenter: function (e) {
                                        return this.element.classList.add("dz-drag-hover")
                                    },
                                    dragover: function (e) {
                                        return this.element.classList.add("dz-drag-hover")
                                    },
                                    dragleave: function (e) {
                                        return this.element.classList.remove("dz-drag-hover")
                                    },
                                    paste: function (e) { },
                                    reset: function () {
                                        return this.element.classList.remove("dz-started")
                                    },
                                    addedfile: function (e) {
                                        var t = this;
                                        if (this.element === this.previewsContainer && this.element.classList.add("dz-started"), this.previewsContainer) {
                                            e.previewElement = o.createElement(this.options.previewTemplate.trim()), e.previewTemplate = e.previewElement, this.previewsContainer.appendChild(e.previewElement);
                                            for (var i = 0, n = n = e.previewElement.querySelectorAll("[data-dz-name]"); ;) {
                                                var r;
                                                if (i >= n.length) break;
                                                var s = r = n[i++];
                                                s.textContent = e.name
                                            }
                                            for (var a = 0, l = l = e.previewElement.querySelectorAll("[data-dz-size]"); !(a >= l.length);)(s = l[a++]).innerHTML = this.filesize(e.size);
                                            this.options.addRemoveLinks && (e._removeLink = o.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>' + this.options.dictRemoveFile + "</a>"), e.previewElement.appendChild(e._removeLink));
                                            for (var u = function (i) {
                                                return i.preventDefault(), i.stopPropagation(), /* e.status === o.UPLOADING ? o.confirm(t.options.dictCancelUploadConfirmation, function () {
                                                    return t.removeFile(e)
                                                }) : t.options.dictRemoveFileConfirmation ? o.confirm(t.options.dictRemoveFileConfirmation, function () {
                                                    return t.removeFile(e)
                                                }) : */ t.removeFile(e)
                                            }, c = 0, d = d = e.previewElement.querySelectorAll("[data-dz-remove]"); !(c >= d.length);) d[c++].addEventListener("click", u)

                                        }
                                    },
                                    removedfile: function (e) {
                                        return null != e.previewElement && null != e.previewElement.parentNode && e.previewElement.parentNode.removeChild(e.previewElement), this._updateMaxFilesReachedClass()
                                    },
                                    thumbnail: function (e, t) {
                                        if (e.previewElement) {
                                            e.previewElement.classList.remove("dz-file-preview");
                                            for (var i = 0, n = n = e.previewElement.querySelectorAll("[data-dz-thumbnail]"); ;) {
                                                var r;
                                                if (i >= n.length) break;
                                                var o = r = n[i++];
                                                o.alt = e.name, o.src = t
                                            }
                                            return setTimeout(function () {
                                                return e.previewElement.classList.add("dz-image-preview")
                                            }, 1)
                                        }
                                    },
                                    error: function (e, t) {
                                        if (e.previewElement) {
                                            e.previewElement.classList.add("dz-error"), "String" != typeof t && t.error && (t = t.error);
                                            for (var i = 0, n = n = e.previewElement.querySelectorAll("[data-dz-errormessage]"); !(i >= n.length);) n[i++].textContent = t
                                        }
                                    },
                                    errormultiple: function () { },
                                    processing: function (e) {
                                        if (e.previewElement && (e.previewElement.classList.add("dz-processing"), e._removeLink)) return e._removeLink.textContent = this.options.dictCancelUpload
                                    },
                                    processingmultiple: function () { },
                                    uploadprogress: function (e, t, i) {
                                        if (e.previewElement)
                                            for (var n = 0, r = r = e.previewElement.querySelectorAll("[data-dz-uploadprogress]"); ;) {
                                                var o;
                                                if (n >= r.length) break;
                                                var s = o = r[n++];
                                                "PROGRESS" === s.nodeName ? s.value = t : s.style.width = t + "%"
                                            }
                                    },
                                    totaluploadprogress: function () { },
                                    sending: function () { },
                                    sendingmultiple: function () { },
                                    success: function (e) {
                                        if (e.previewElement) return e.previewElement.classList.add("dz-success")
                                    },
                                    successmultiple: function () { },
                                    canceled: function (e) {
                                        return this.emit("error", e, "Upload canceled.")
                                    },
                                    canceledmultiple: function () { },
                                    complete: function (e) {
                                        if (e._removeLink && (e._removeLink.textContent = this.options.dictRemoveFile), e.previewElement) return e.previewElement.classList.add("dz-complete")
                                    },
                                    completemultiple: function () { },
                                    maxfilesexceeded: function () { },
                                    maxfilesreached: function () { },
                                    queuecomplete: function () { },
                                    addedfiles: function () { }
                                }, this.prototype._thumbnailQueue = [], this.prototype._processingThumbnail = !1
                            }
                        }, {
                            key: "extend",
                            value: function (e) {
                                for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
                                for (var r = 0, o = o = i; ;) {
                                    var s;
                                    if (r >= o.length) break;
                                    var a = s = o[r++];
                                    for (var l in a) {
                                        var u = a[l];
                                        e[l] = u
                                    }
                                }
                                return e
                            }
                        }]), n(o, [{
                            key: "getAcceptedFiles",
                            value: function () {
                                return this.files.filter(function (e) {
                                    return e.accepted
                                }).map(function (e) {
                                    return e
                                })
                            }
                        }, {
                            key: "getRejectedFiles",
                            value: function () {
                                return this.files.filter(function (e) {
                                    return !e.accepted
                                }).map(function (e) {
                                    return e
                                })
                            }
                        }, {
                            key: "getFilesWithStatus",
                            value: function (e) {
                                return this.files.filter(function (t) {
                                    return t.status === e
                                }).map(function (e) {
                                    return e
                                })
                            }
                        }, {
                            key: "getQueuedFiles",
                            value: function () {
                                return this.getFilesWithStatus(o.QUEUED)
                            }
                        }, {
                            key: "getUploadingFiles",
                            value: function () {
                                return this.getFilesWithStatus(o.UPLOADING)
                            }
                        }, {
                            key: "getAddedFiles",
                            value: function () {
                                return this.getFilesWithStatus(o.ADDED)
                            }
                        }, {
                            key: "getActiveFiles",
                            value: function () {
                                return this.files.filter(function (e) {
                                    return e.status === o.UPLOADING || e.status === o.QUEUED
                                }).map(function (e) {
                                    return e
                                })
                            }
                        }, {
                            key: "init",
                            value: function () {
                                var e = this;
                                "form" === this.element.tagName && this.element.setAttribute("enctype", "multipart/form-data"), this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message") && this.element.appendChild(o.createElement('<div class="dz-default dz-message"><span>' + this.options.dictDefaultMessage + "</span></div>")), this.clickableElements.length && function t() {
                                    return e.hiddenFileInput && e.hiddenFileInput.parentNode.removeChild(e.hiddenFileInput), e.hiddenFileInput = document.createElement("input"), e.hiddenFileInput.setAttribute("type", "file"), (null === e.options.maxFiles || e.options.maxFiles > 1) && e.hiddenFileInput.setAttribute("multiple", "multiple"), e.hiddenFileInput.className = "dz-hidden-input", null !== e.options.acceptedFiles && e.hiddenFileInput.setAttribute("accept", e.options.acceptedFiles), null !== e.options.capture && e.hiddenFileInput.setAttribute("capture", e.options.capture), e.hiddenFileInput.style.visibility = "hidden", e.hiddenFileInput.style.position = "absolute", e.hiddenFileInput.style.top = "0", e.hiddenFileInput.style.left = "0", e.hiddenFileInput.style.height = "0", e.hiddenFileInput.style.width = "0", document.querySelector(e.options.hiddenInputContainer).appendChild(e.hiddenFileInput), e.hiddenFileInput.addEventListener("change", function () {
                                        var i = e.hiddenFileInput.files;
                                        if (i.length)
                                            for (var n = 0, r = r = i; ;) {
                                                var o;
                                                if (n >= r.length) break;
                                                var s = o = r[n++];
                                                /* console.log(e.files.length) */
                                                if (e.files.length < e.options.maxFiles) {
                                                    e.addFile(s)
                                                }
                                            }
                                        return e.emit("addedfiles", i), t()
                                    })
                                }(), this.URL = null !== window.URL ? window.URL : window.webkitURL;
                                for (var t = 0, i = i = this.events; ;) {
                                    var n;
                                    if (t >= i.length) break;
                                    var r = n = i[t++];
                                    this.on(r, this.options[r])
                                }
                                this.on("uploadprogress", function () {
                                    return e.updateTotalUploadProgress()
                                }), this.on("removedfile", function () {
                                    return e.updateTotalUploadProgress()
                                }), this.on("canceled", function (t) {
                                    return e.emit("complete", t)
                                }), this.on("complete", function (t) {
                                    if (0 === e.getAddedFiles().length && 0 === e.getUploadingFiles().length && 0 === e.getQueuedFiles().length) return setTimeout(function () {
                                        return e.emit("queuecomplete")
                                    }, 0)
                                });
                                var s = function (e) {
                                    return e.stopPropagation(), e.preventDefault ? e.preventDefault() : e.returnValue = !1
                                };
                                return this.listeners = [{
                                    element: this.element,
                                    events: {
                                        dragstart: function (t) {
                                            return e.emit("dragstart", t)
                                        },
                                        dragenter: function (t) {
                                            return s(t), e.emit("dragenter", t)
                                        },
                                        dragover: function (t) {
                                            var i = void 0;
                                            try {
                                                i = t.dataTransfer.effectAllowed
                                            } catch (e) { }
                                            return t.dataTransfer.dropEffect = "move" === i || "linkMove" === i ? "move" : "copy", s(t), e.emit("dragover", t)
                                        },
                                        dragleave: function (t) {
                                            return e.emit("dragleave", t)
                                        },
                                        drop: function (t) {
                                            return s(t), e.drop(t)
                                        },
                                        dragend: function (t) {
                                            return e.emit("dragend", t)
                                        }
                                    }
                                }], this.clickableElements.forEach(function (t) {
                                    return e.listeners.push({
                                        element: t,
                                        events: {
                                            click: function (i) {
                                                return (t !== e.element || i.target === e.element || o.elementInside(i.target, e.element.querySelector(".dz-message"))) && e.hiddenFileInput.click(), !0
                                            }
                                        }
                                    })
                                }), this.enable(), this.options.init.call(this)
                            }
                        }, {
                            key: "destroy",
                            value: function () {
                                return this.disable(), this.removeAllFiles(!0), (null != this.hiddenFileInput ? this.hiddenFileInput.parentNode : void 0) && (this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput), this.hiddenFileInput = null), delete this.element.dropzone, o.instances.splice(o.instances.indexOf(this), 1)
                            }
                        }, {
                            key: "updateTotalUploadProgress",
                            value: function () {
                                var e = void 0,
                                    t = 0,
                                    i = 0;
                                if (this.getActiveFiles().length) {
                                    for (var n = 0, r = r = this.getActiveFiles(); ;) {
                                        var o;
                                        if (n >= r.length) break;
                                        var s = o = r[n++];
                                        t += s.upload.bytesSent, i += s.upload.total
                                    }
                                    e = 100 * t / i
                                } else e = 100;
                                return this.emit("totaluploadprogress", e, i, t)
                            }
                        }, {
                            key: "_getParamName",
                            value: function (e) {
                                return "function" == typeof this.options.paramName ? this.options.paramName(e) : this.options.paramName + (this.options.uploadMultiple ? "[" + e + "]" : "")
                            }
                        }, {
                            key: "_renameFile",
                            value: function (e) {
                                return "function" != typeof this.options.renameFile ? e.name : this.options.renameFile(e)
                            }
                        }, {
                            key: "getFallbackForm",
                            value: function () {
                                var e = void 0,
                                    t = void 0;
                                if (e = this.getExistingFallback()) return e;
                                var i = '<div class="dz-fallback">';
                                this.options.dictFallbackText && (i += "<p>" + this.options.dictFallbackText + "</p>"), i += '<input type="file" name="' + this._getParamName(0) + '" ' + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + ' /><input type="submit" value="Upload!"></div>';
                                var n = o.createElement(i);
                                return "FORM" !== this.element.tagName ? (t = o.createElement('<form action="' + this.options.url + '" enctype="multipart/form-data" method="' + this.options.method + '"></form>')).appendChild(n) : (this.element.setAttribute("enctype", "multipart/form-data"), this.element.setAttribute("method", this.options.method)), null != t ? t : n
                            }
                        }, {
                            key: "getExistingFallback",
                            value: function () {
                                for (var e = ["div", "form"], t = 0; t < e.length; t++) {
                                    var i, n = e[t];
                                    if (i = function (e) {
                                        for (var t = 0, i = i = e; ;) {
                                            var n;
                                            if (t >= i.length) break;
                                            var r = n = i[t++];
                                            if (/(^| )fallback($| )/.test(r.className)) return r
                                        }
                                    }(this.element.getElementsByTagName(n))) return i
                                }
                            }
                        }, {
                            key: "setupEventListeners",
                            value: function () {
                                return this.listeners.map(function (e) {
                                    return function () {
                                        var t = [];
                                        for (var i in e.events) {
                                            var n = e.events[i];
                                            t.push(e.element.addEventListener(i, n, !1))
                                        }
                                        return t
                                    }()
                                })
                            }
                        }, {
                            key: "removeEventListeners",
                            value: function () {
                                return this.listeners.map(function (e) {
                                    return function () {
                                        var t = [];
                                        for (var i in e.events) {
                                            var n = e.events[i];
                                            t.push(e.element.removeEventListener(i, n, !1))
                                        }
                                        return t
                                    }()
                                })
                            }
                        }, {
                            key: "disable",
                            value: function () {
                                var e = this;
                                return this.clickableElements.forEach(function (e) {
                                    return e.classList.remove("dz-clickable")
                                }), this.removeEventListeners(), this.files.map(function (t) {
                                    return e.cancelUpload(t)
                                })
                            }
                        }, {
                            key: "enable",
                            value: function () {
                                return this.clickableElements.forEach(function (e) {
                                    return e.classList.add("dz-clickable")
                                }), this.setupEventListeners()
                            }
                        }, {
                            key: "filesize",
                            value: function (e) {
                                var t = 0,
                                    i = "b";
                                if (e > 0) {
                                    for (var n = ["tb", "gb", "mb", "kb", "b"], r = 0; r < n.length; r++) {
                                        var o = n[r];
                                        if (e >= Math.pow(this.options.filesizeBase, 4 - r) / 10) {
                                            t = e / Math.pow(this.options.filesizeBase, 4 - r), i = o;
                                            break
                                        }
                                    }
                                    t = Math.round(10 * t) / 10
                                }
                                return "<strong>" + t + "</strong> " + this.options.dictFileSizeUnits[i]
                            }
                        }, {
                            key: "_updateMaxFilesReachedClass",
                            value: function () {
                                return null != this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles ? (this.getAcceptedFiles().length === this.options.maxFiles && this.emit("maxfilesreached", this.files), this.element.classList.add("dz-max-files-reached")) : this.element.classList.remove("dz-max-files-reached")
                            }
                        }, {
                            key: "drop",
                            value: function (e) {
                                if (e.dataTransfer) {
                                    this.emit("drop", e);
                                    var t = e.dataTransfer.files;
                                    if (this.emit("addedfiles", t), t.length) {
                                        var i = e.dataTransfer.items;
                                        i && i.length && null != i[0].webkitGetAsEntry ? this._addFilesFromItems(i) : this.handleFiles(t)
                                    }
                                }
                            }
                        }, {
                            key: "paste",
                            value: function (e) {
                                if (null != function (e, t) {
                                    return void 0 !== e && null !== e ? function (e) {
                                        return e.items
                                    }(e) : void 0
                                }(null != e ? e.clipboardData : void 0)) {
                                    this.emit("paste", e);
                                    var t = e.clipboardData.items;
                                    return t.length ? this._addFilesFromItems(t) : void 0
                                }
                            }
                        }, {
                            key: "handleFiles",
                            value: function (e) {
                                var t = this;
                                return e.map(function (e) {
                                    return t.addFile(e)
                                })
                            }
                        }, {
                            key: "_addFilesFromItems",
                            value: function (e) {
                                var t = this;
                                return function () {
                                    for (var i = [], n = 0, r = r = e; ;) {
                                        var o;
                                        if (n >= r.length) break;
                                        var s, a = o = r[n++];
                                        null != a.webkitGetAsEntry && (s = a.webkitGetAsEntry()) ? s.isFile ? i.push(t.addFile(a.getAsFile())) : s.isDirectory ? i.push(t._addFilesFromDirectory(s, s.name)) : i.push(void 0) : null == a.getAsFile || null != a.kind && "file" !== a.kind ? i.push(void 0) : i.push(t.addFile(a.getAsFile()))
                                    }
                                    return i
                                }()
                            }
                        }, {
                            key: "_addFilesFromDirectory",
                            value: function (e, t) {
                                var i = this,
                                    n = e.createReader(),
                                    r = function (e) {
                                        return function (e, t, i) {
                                            return void 0 !== e && null !== e && "function" == typeof e.log ? function (t) {
                                                return t.log(e)
                                            }(e) : void 0
                                        }(console)
                                    };
                                return function e() {
                                    return n.readEntries(function (n) {
                                        if (n.length > 0) {
                                            for (var r = 0, o = o = n; ;) {
                                                var s;
                                                if (r >= o.length) break;
                                                var a = s = o[r++];
                                                a.isFile ? a.file(function (e) {
                                                    if (!i.options.ignoreHiddenFiles || "." !== e.name.substring(0, 1)) return e.fullPath = t + "/" + e.name, i.addFile(e)
                                                }) : a.isDirectory && i._addFilesFromDirectory(a, t + "/" + a.name)
                                            }
                                            e()
                                        }
                                        return null
                                    }, r)
                                }()
                            }
                        }, {
                            key: "accept",
                            value: function (e, t) {
                                return e.size > 1024 * this.options.maxFilesize * 1024 ? t(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(e.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize)) : o.isValidFile(e, this.options.acceptedFiles) ? null != this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles ? (t(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles)), this.emit("maxfilesexceeded", e)) : this.options.accept.call(this, e, t) : t(this.options.dictInvalidFileType)
                            }
                        }, {
                            key: "addFile",
                            value: function (e) {
                                var t = this;
                                return e.upload = {
                                    uuid: o.uuidv4(),
                                    progress: 0,
                                    total: e.size,
                                    bytesSent: 0,
                                    filename: this._renameFile(e),
                                    chunked: this.options.chunking && (this.options.forceChunking || e.size > this.options.chunkSize),
                                    totalChunkCount: Math.ceil(e.size / this.options.chunkSize)
                                },
                                    /* console.log(t.options.maxFiles), */
                                    this.files.length < t.options.maxFiles ? (this.files.push(e), e.status = o.ADDED, this.emit("addedfile", e)) : null,
                                    this._enqueueThumbnail(e),
                                    this.accept(e, function (i) {
                                        return i ? (e.accepted = !1, t._errorProcessing([e], i)) : (e.accepted = !0, t.options.autoQueue && t.enqueueFile(e)), t._updateMaxFilesReachedClass()
                                    })
                            }
                        }, {
                            key: "enqueueFiles",
                            value: function (e) {
                                for (var t = 0, i = i = e; ;) {
                                    var n;
                                    if (t >= i.length) break;
                                    var r = n = i[t++];
                                    this.enqueueFile(r)
                                }
                                return null
                            }
                        }, {
                            key: "enqueueFile",
                            value: function (e) {
                                var t = this;
                                if (e.status !== o.ADDED || !0 !== e.accepted) throw new Error("This file can't be queued because it has already been processed or was rejected.");
                                if (e.status = o.QUEUED, this.options.autoProcessQueue) return setTimeout(function () {
                                    return t.processQueue()
                                }, 0)
                            }
                        }, {
                            key: "_enqueueThumbnail",
                            value: function (e) {
                                var t = this;
                                if (this.options.createImageThumbnails && e.type.match(/image.*/) && e.size <= 1024 * this.options.maxThumbnailFilesize * 1024) return this._thumbnailQueue.push(e), setTimeout(function () {
                                    return t._processThumbnailQueue()
                                }, 0)
                            }
                        }, {
                            key: "_processThumbnailQueue",
                            value: function () {
                                var e = this;
                                if (!this._processingThumbnail && 0 !== this._thumbnailQueue.length) {
                                    this._processingThumbnail = !0;
                                    var t = this._thumbnailQueue.shift();
                                    return this.createThumbnail(t, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, !0, function (i) {
                                        return e.emit("thumbnail", t, i), e._processingThumbnail = !1, e._processThumbnailQueue()
                                    })
                                }
                            }
                        }, {
                            key: "removeFile",
                            value: function (e) {
                                if (e.status === o.UPLOADING && this.cancelUpload(e), this.files = s(this.files, e), this.emit("removedfile", e), 0 === this.files.length) return this.emit("reset")
                            }
                        }, {
                            key: "removeAllFiles",
                            value: function (e) {
                                null == e && (e = !1);
                                for (var t = 0, i = i = this.files.slice(); ;) {
                                    var n;
                                    if (t >= i.length) break;
                                    var r = n = i[t++];
                                    (r.status !== o.UPLOADING || e) && this.removeFile(r)
                                }
                                return null
                            }
                        }, {
                            key: "resizeImage",
                            value: function (e, t, i, n, r) {
                                var s = this;
                                return this.createThumbnail(e, t, i, n, !1, function (t, i) {
                                    if (null === i) return r(e);
                                    var n = s.options.resizeMimeType;
                                    null == n && (n = e.type);
                                    var a = i.toDataURL(n, s.options.resizeQuality);
                                    return "image/jpeg" !== n && "image/jpg" !== n || (a = u.restore(e.dataURL, a)), r(o.dataURItoBlob(a))
                                })
                            }
                        }, {
                            key: "createThumbnail",
                            value: function (e, t, i, n, r, o) {
                                var s = this,
                                    a = new FileReader;
                                return a.onload = function () {
                                    if (e.dataURL = a.result, "image/svg+xml" !== e.type) return s.createThumbnailFromUrl(e, t, i, n, r, o);
                                    null != o && o(a.result)
                                }, a.readAsDataURL(e)
                            }
                        }, {
                            key: "createThumbnailFromUrl",
                            value: function (e, t, i, n, r, o, s) {
                                var a = this,
                                    u = document.createElement("img");
                                return s && (u.crossOrigin = s), u.onload = function () {
                                    var s = function (e) {
                                        return e(1)
                                    };
                                    return "undefined" != typeof EXIF && null !== EXIF && r && (s = function (e) {
                                        return EXIF.getData(u, function () {
                                            return e(EXIF.getTag(this, "Orientation"))
                                        })
                                    }), s(function (r) {
                                        e.width = u.width, e.height = u.height;
                                        var s = a.options.resize.call(a, e, t, i, n),
                                            c = document.createElement("canvas"),
                                            d = c.getContext("2d");
                                        switch (c.width = s.trgWidth, c.height = s.trgHeight, r > 4 && (c.width = s.trgHeight, c.height = s.trgWidth), r) {
                                            case 2:
                                                d.translate(c.width, 0), d.scale(-1, 1);
                                                break;
                                            case 3:
                                                d.translate(c.width, c.height), d.rotate(Math.PI);
                                                break;
                                            case 4:
                                                d.translate(0, c.height), d.scale(1, -1);
                                                break;
                                            case 5:
                                                d.rotate(.5 * Math.PI), d.scale(1, -1);
                                                break;
                                            case 6:
                                                d.rotate(.5 * Math.PI), d.translate(0, -c.height);
                                                break;
                                            case 7:
                                                d.rotate(.5 * Math.PI), d.translate(c.width, -c.height), d.scale(-1, 1);
                                                break;
                                            case 8:
                                                d.rotate(-.5 * Math.PI), d.translate(-c.width, 0)
                                        }
                                        l(d, u, null != s.srcX ? s.srcX : 0, null != s.srcY ? s.srcY : 0, s.srcWidth, s.srcHeight, null != s.trgX ? s.trgX : 0, null != s.trgY ? s.trgY : 0, s.trgWidth, s.trgHeight);
                                        var p = c.toDataURL("image/png");
                                        if (null != o) return o(p, c)
                                    })
                                }, null != o && (u.onerror = o), u.src = e.dataURL
                            }
                        }, {
                            key: "processQueue",
                            value: function () {
                                var e = this.options.parallelUploads,
                                    t = this.getUploadingFiles().length,
                                    i = t;
                                if (!(t >= e)) {
                                    var n = this.getQueuedFiles();
                                    if (n.length > 0) {
                                        if (this.options.uploadMultiple) return this.processFiles(n.slice(0, e - t));
                                        for (; i < e;) {
                                            if (!n.length) return;
                                            this.processFile(n.shift()), i++
                                        }
                                    }
                                }
                            }
                        }, {
                            key: "processFile",
                            value: function (e) {
                                return this.processFiles([e])
                            }
                        }, {
                            key: "processFiles",
                            value: function (e) {
                                for (var t = 0, i = i = e; ;) {
                                    var n;
                                    if (t >= i.length) break;
                                    var r = n = i[t++];
                                    r.processing = !0, r.status = o.UPLOADING, this.emit("processing", r)
                                }
                                return this.options.uploadMultiple && this.emit("processingmultiple", e), this.uploadFiles(e)
                            }
                        }, {
                            key: "_getFilesWithXhr",
                            value: function (e) {
                                return this.files.filter(function (t) {
                                    return t.xhr === e
                                }).map(function (e) {
                                    return e
                                })
                            }
                        }, {
                            key: "cancelUpload",
                            value: function (e) {
                                if (e.status === o.UPLOADING) {
                                    for (var t = this._getFilesWithXhr(e.xhr), i = 0, n = n = t; !(i >= n.length);) n[i++].status = o.CANCELED;
                                    void 0 !== e.xhr && e.xhr.abort();
                                    for (var r = 0, s = s = t; ;) {
                                        var a;
                                        if (r >= s.length) break;
                                        var l = a = s[r++];
                                        this.emit("canceled", l)
                                    }
                                    this.options.uploadMultiple && this.emit("canceledmultiple", t)
                                } else e.status !== o.ADDED && e.status !== o.QUEUED || (e.status = o.CANCELED, this.emit("canceled", e), this.options.uploadMultiple && this.emit("canceledmultiple", [e])); if (this.options.autoProcessQueue) return this.processQueue()
                            }
                        }, {
                            key: "resolveOption",
                            value: function (e) {
                                if ("function" == typeof e) {
                                    for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
                                    return e.apply(this, i)
                                }
                                return e
                            }
                        }, {
                            key: "uploadFile",
                            value: function (e) {
                                return this.uploadFiles([e])
                            }
                        }, {
                            key: "uploadFiles",
                            value: function (e) {
                                var t = this;
                                this._transformFiles(e, function (i) {
                                    if (e[0].upload.chunked) {
                                        var n = e[0],
                                            r = i[0],
                                            s = 0;
                                        n.upload.chunks = [];
                                        var a = function () {
                                            for (var i = 0; void 0 !== n.upload.chunks[i];) i++;
                                            if (!(i >= n.upload.totalChunkCount)) {
                                                s++;
                                                var a = i * t.options.chunkSize,
                                                    l = Math.min(a + t.options.chunkSize, n.size),
                                                    u = {
                                                        name: t._getParamName(0),
                                                        data: r.webkitSlice ? r.webkitSlice(a, l) : r.slice(a, l),
                                                        filename: n.upload.filename,
                                                        chunkIndex: i
                                                    };
                                                n.upload.chunks[i] = {
                                                    file: n,
                                                    index: i,
                                                    dataBlock: u,
                                                    status: o.UPLOADING,
                                                    progress: 0,
                                                    retries: 0
                                                }, t._uploadData(e, [u])
                                            }
                                        };
                                        if (n.upload.finishedChunkUpload = function (i) {
                                            var r = !0;
                                            i.status = o.SUCCESS, i.dataBlock = null;
                                            for (var s = 0; s < n.upload.totalChunkCount; s++) {
                                                if (void 0 === n.upload.chunks[s]) return a();
                                                n.upload.chunks[s].status !== o.SUCCESS && (r = !1)
                                            }
                                            r && t.options.chunksUploaded(n, function () {
                                                t._finished(e, "", null)
                                            })
                                        }, t.options.parallelChunkUploads)
                                            for (var l = 0; l < n.upload.totalChunkCount; l++) a();
                                        else a()
                                    } else {
                                        for (var u = [], c = 0; c < e.length; c++) u[c] = {
                                            name: t._getParamName(c),
                                            data: i[c],
                                            filename: e[c].upload.filename
                                        };
                                        t._uploadData(e, u)
                                    }
                                })
                            }
                        }, {
                            key: "_getChunk",
                            value: function (e, t) {
                                for (var i = 0; i < e.upload.totalChunkCount; i++)
                                    if (void 0 !== e.upload.chunks[i] && e.upload.chunks[i].xhr === t) return e.upload.chunks[i]
                            }
                        }, {
                            key: "_uploadData",
                            value: function (e, t) {
                                for (var i = this, n = new XMLHttpRequest, r = 0, s = s = e; !(r >= s.length);) s[r++].xhr = n;
                                e[0].upload.chunked && (e[0].upload.chunks[t[0].chunkIndex].xhr = n);
                                var a = this.resolveOption(this.options.method, e),
                                    l = this.resolveOption(this.options.url, e);
                                n.open(a, l, !0), n.timeout = this.resolveOption(this.options.timeout, e), n.withCredentials = !!this.options.withCredentials, n.onload = function (t) {
                                    i._finishedUploading(e, n, t)
                                }, n.onerror = function () {
                                    i._handleUploadError(e, n)
                                }, (null != n.upload ? n.upload : n).onprogress = function (t) {
                                    return i._updateFilesUploadProgress(e, n, t)
                                };
                                var u = {
                                    Accept: "application/json",
                                    "Cache-Control": "no-cache",
                                    "X-Requested-With": "XMLHttpRequest"
                                };
                                this.options.headers && o.extend(u, this.options.headers);
                                for (var c in u) {
                                    var d = u[c];
                                    d && n.setRequestHeader(c, d)
                                }
                                var p = new FormData;
                                if (this.options.params) {
                                    var h = this.options.params;
                                    "function" == typeof h && (h = h.call(this, e, n, e[0].upload.chunked ? this._getChunk(e[0], n) : null));
                                    for (var f in h) {
                                        var v = h[f];
                                        p.append(f, v)
                                    }
                                }

                                for (var m = 0, g = g = e; ;) {
                                    var y;
                                    if (m >= g.length) break;
                                    var k = y = g[m++];
                                    this.emit("sending", k, n, p)
                                }
                                this.options.uploadMultiple && this.emit("sendingmultiple", e, n, p), this._addFormElementData(p);
                                for (var b = 0; b < t.length; b++) {
                                    var F = t[b];
                                    p.append(F.name, F.data, F.filename)
                                }/* console.log("---------------"),console.log(e),console.log("---------------") */
                                this.submitRequest(n, p, e)
                            }
                        }, {
                            key: "_transformFiles",
                            value: function (e, t) {
                                for (var i = this, n = [], r = 0, o = 0; o < e.length; o++)! function (o) {
                                    i.options.transformFile.call(i, e[o], function (i) {
                                        n[o] = i, ++r === e.length && t(n)
                                    })
                                }(o)
                            }
                        }, {
                            key: "_addFormElementData",
                            value: function (e) {
                                if ("FORM" === this.element.tagName)
                                    for (var t = 0, i = i = this.element.querySelectorAll("input, textarea, select, button"); ;) {
                                        var n;
                                        if (t >= i.length) break;
                                        var r = n = i[t++],
                                            o = r.getAttribute("name"),
                                            s = r.getAttribute("type");
                                        if (s && (s = s.toLowerCase()), void 0 !== o && null !== o)
                                            if ("SELECT" === r.tagName && r.hasAttribute("multiple"))
                                                for (var a = 0, l = l = r.options; ;) {
                                                    var u;
                                                    if (a >= l.length) break;
                                                    var c = u = l[a++];
                                                    c.selected && e.append(o, c.value)
                                                } else (!s || "checkbox" !== s && "radio" !== s || r.checked) && e.append(o, r.value)
                                    }
                            }
                        }, {
                            key: "_updateFilesUploadProgress",
                            value: function (e, t, i) {
                                var n = void 0;
                                if (void 0 !== i) {
                                    if (n = 100 * i.loaded / i.total, e[0].upload.chunked) {
                                        var r = e[0],
                                            o = this._getChunk(r, t);
                                        o.progress = n, o.total = i.total, o.bytesSent = i.loaded, r.upload.progress = 0, r.upload.total = 0, r.upload.bytesSent = 0;
                                        for (var s = 0; s < r.upload.totalChunkCount; s++) void 0 !== r.upload.chunks[s] && void 0 !== r.upload.chunks[s].progress && (r.upload.progress += r.upload.chunks[s].progress, r.upload.total += r.upload.chunks[s].total, r.upload.bytesSent += r.upload.chunks[s].bytesSent);
                                        r.upload.progress = r.upload.progress / r.upload.totalChunkCount
                                    } else
                                        for (var a = 0, l = l = e; ;) {
                                            var u;
                                            if (a >= l.length) break;
                                            var c = u = l[a++];
                                            c.upload.progress = n, c.upload.total = i.total, c.upload.bytesSent = i.loaded
                                        }
                                    for (var d = 0, p = p = e; ;) {
                                        var h;
                                        if (d >= p.length) break;
                                        var f = h = p[d++];
                                        this.emit("uploadprogress", f, f.upload.progress, f.upload.bytesSent)
                                    }
                                } else {
                                    var v = !0;
                                    n = 100;
                                    for (var m = 0, g = g = e; ;) {
                                        var y;
                                        if (m >= g.length) break;
                                        var k = y = g[m++];
                                        100 === k.upload.progress && k.upload.bytesSent === k.upload.total || (v = !1), k.upload.progress = n, k.upload.bytesSent = k.upload.total
                                    }
                                    if (v) return;
                                    for (var b = 0, F = F = e; ;) {
                                        var w;
                                        if (b >= F.length) break;
                                        var E = w = F[b++];
                                        this.emit("uploadprogress", E, n, E.upload.bytesSent)
                                    }
                                }
                            }
                        }, {
                            key: "_finishedUploading",
                            value: function (e, t, i) {
                                var n = void 0;
                                if (e[0].status !== o.CANCELED && 4 === t.readyState) {
                                    if ("arraybuffer" !== t.responseType && "blob" !== t.responseType && (n = t.responseText, t.getResponseHeader("content-type") && ~t.getResponseHeader("content-type").indexOf("application/json"))) try {
                                        n = JSON.parse(n)
                                    } catch (e) {
                                        i = e, n = "Invalid JSON response from server."
                                    }
                                    this._updateFilesUploadProgress(e), 200 <= t.status && t.status < 300 ? e[0].upload.chunked ? e[0].upload.finishedChunkUpload(this._getChunk(e[0], t)) : this._finished(e, n, i) : this._handleUploadError(e, t, n)
                                }
                            }
                        }, {
                            key: "_handleUploadError",
                            value: function (e, t, i) {
                                if (e[0].status !== o.CANCELED) {
                                    if (e[0].upload.chunked && this.options.retryChunks) {
                                        var n = this._getChunk(e[0], t);
                                        if (n.retries++ < this.options.retryChunksLimit) return void this._uploadData(e, [n.dataBlock]);
                                        console.warn("Retried this chunk too often. Giving up.")
                                    }
                                    for (var r = 0, s = s = e; !(r >= s.length);) s[r++], this._errorProcessing(e, i || this.options.dictResponseError.replace("{{statusCode}}", t.status), t)
                                }
                            }
                        }, {
                            key: "submitRequest",
                            value: function (e, t, i) {
                                /* this.emit("success", e, t, i)
                                this.emit("complete", e, t, i) */
                                e.send("")
                            }
                        }, {
                            key: "_finished",
                            value: function (e, t, i) {
                                for (var n = 0, r = r = e; ;) {
                                    var s;
                                    if (n >= r.length) break;
                                    var a = s = r[n++];
                                    a.status = o.SUCCESS, this.emit("success", a, t, i), this.emit("complete", a)
                                }
                                if (this.options.uploadMultiple && (this.emit("successmultiple", e, t, i), this.emit("completemultiple", e)), this.options.autoProcessQueue) return this.processQueue()
                            }
                        }, {
                            key: "_errorProcessing",
                            value: function (e, t, i) {
                                for (var n = 0, r = r = e; ;) {
                                    var s;
                                    if (n >= r.length) break;
                                    var a = s = r[n++];
                                    a.status = o.ERROR, this.emit("error", a, t, i), this.emit("complete", a)
                                }
                                if (this.options.uploadMultiple && (this.emit("errormultiple", e, t, i), this.emit("completemultiple", e)), this.options.autoProcessQueue) return this.processQueue()
                            }
                        }], [{
                            key: "uuidv4",
                            value: function () {
                                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                                    var t = 16 * Math.random() | 0;
                                    return ("x" === e ? t : 3 & t | 8).toString(16)
                                })
                            }
                        }]), o
                    }();
                o.initClass(), o.version = "5.2.0", o.options = {}, o.optionsForElement = function (e) {
                    return e.getAttribute("id") ? o.options[a(e.getAttribute("id"))] : void 0
                }, o.instances = [], o.forElement = function (e) {
                    if ("string" == typeof e && (e = document.querySelector(e)), null == (null != e ? e.dropzone : void 0)) throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
                    return e.dropzone
                }, o.autoDiscover = !0, o.discover = function () {
                    var e = void 0;
                    if (document.querySelectorAll) e = document.querySelectorAll(".dropzone");
                    else {
                        e = [];
                        var t = function (t) {
                            return function () {
                                for (var i = [], n = 0, r = r = t; ;) {
                                    var o;
                                    if (n >= r.length) break;
                                    var s = o = r[n++];
                                    /(^| )dropzone($| )/.test(s.className) ? i.push(e.push(s)) : i.push(void 0)
                                }
                                return i
                            }()
                        };
                        t(document.getElementsByTagName("div")), t(document.getElementsByTagName("form"))
                    }
                    return function () {
                        for (var t = [], i = 0, n = n = e; ;) {
                            var r;
                            if (i >= n.length) break;
                            var s = r = n[i++];
                            !1 !== o.optionsForElement(s) ? t.push(new o(s)) : t.push(void 0)
                        }
                        return t
                    }()
                }, o.blacklistedBrowsers = [/opera.*(Macintosh|Windows Phone).*version\/12/i], o.isBrowserSupported = function () {
                    var e = !0;
                    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector)
                        if ("classList" in document.createElement("a"))
                            for (var t = 0, i = i = o.blacklistedBrowsers; !(t >= i.length);) i[t++].test(navigator.userAgent) && (e = !1);
                        else e = !1;
                    else e = !1;
                    return e
                }, o.dataURItoBlob = function (e) {
                    for (var t = atob(e.split(",")[1]), i = e.split(",")[0].split(":")[1].split(";")[0], n = new ArrayBuffer(t.length), r = new Uint8Array(n), o = 0, s = t.length, a = 0 <= s; a ? o <= s : o >= s; a ? o++ : o--) r[o] = t.charCodeAt(o);
                    return new Blob([n], {
                        type: i
                    })
                };
                var s = function (e, t) {
                    return e.filter(function (e) {
                        return e !== t
                    }).map(function (e) {
                        return e
                    })
                },
                    a = function (e) {
                        return e.replace(/[\-_](\w)/g, function (e) {
                            return e.charAt(1).toUpperCase()
                        })
                    };
                o.createElement = function (e) {
                    var t = document.createElement("div");
                    return t.innerHTML = e, t.childNodes[0]
                }, o.elementInside = function (e, t) {
                    if (e === t) return !0;
                    for (; e = e.parentNode;)
                        if (e === t) return !0;
                    return !1
                }, o.getElement = function (e, t) {
                    var i = void 0;
                    if ("string" == typeof e ? i = document.querySelector(e) : null != e.nodeType && (i = e), null == i) throw new Error("Invalid `" + t + "` option provided. Please provide a CSS selector or a plain HTML element.");
                    return i
                }, o.getElements = function (e, t) {
                    var i = void 0,
                        n = void 0;
                    if (e instanceof Array) {
                        n = [];
                        try {
                            for (var r = 0, o = o = e; !(r >= o.length);) i = o[r++], n.push(this.getElement(i, t))
                        } catch (e) {
                            n = null
                        }
                    } else if ("string" == typeof e) {
                        n = [];
                        for (var s = 0, a = a = document.querySelectorAll(e); !(s >= a.length);) i = a[s++], n.push(i)
                    } else null != e.nodeType && (n = [e]); if (null == n || !n.length) throw new Error("Invalid `" + t + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
                    return n
                }, o.confirm = function (e, t, i) {
                    return window.confirm(e) ? t() : null != i ? i() : void 0
                }, o.isValidFile = function (e, t) {
                    if (!t) return !0;
                    t = t.split(",");
                    for (var i = e.type, n = i.replace(/\/.*$/, ""), r = 0, o = o = t; ;) {
                        var s;
                        if (r >= o.length) break;
                        var a = s = o[r++];
                        if ("." === (a = a.trim()).charAt(0)) {
                            if (-1 !== e.name.toLowerCase().indexOf(a.toLowerCase(), e.name.length - a.length)) return !0
                        } else if (/\/\*$/.test(a)) {
                            if (n === a.replace(/\/.*$/, "")) return !0
                        } else if (i === a) return !0
                    }
                    return !1
                }, "undefined" != typeof jQuery && null !== jQuery && (jQuery.fn.dropzone = function (e) {
                    return this.each(function () {
                        return new o(this, e)
                    })
                }), void 0 !== e && null !== e ? e.exports = o : window.Dropzone = o, o.ADDED = "added", o.QUEUED = "queued", o.ACCEPTED = o.QUEUED, o.UPLOADING = "uploading", o.PROCESSING = o.UPLOADING, o.CANCELED = "canceled", o.ERROR = "error", o.SUCCESS = "success";
                var l = function (e, t, i, n, r, o, s, a, l, u) {
                    var c = function (e) {
                        e.naturalWidth;
                        var t = e.naturalHeight,
                            i = document.createElement("canvas");
                        i.width = 1, i.height = t;
                        var n = i.getContext("2d");
                        n.drawImage(e, 0, 0);
                        for (var r = n.getImageData(1, 0, 1, t).data, o = 0, s = t, a = t; a > o;) 0 === r[4 * (a - 1) + 3] ? s = a : o = a, a = s + o >> 1;
                        var l = a / t;
                        return 0 === l ? 1 : l
                    }(t);
                    return e.drawImage(t, i, n, r, o, s, a, l, u / c)
                },
                    u = function () {
                        function e() {
                            i(this, e)
                        }
                        return n(e, null, [{
                            key: "initClass",
                            value: function () {
                                this.KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                            }
                        }, {
                            key: "encode64",
                            value: function (e) {
                                for (var t = "", i = void 0, n = void 0, r = "", o = void 0, s = void 0, a = void 0, l = "", u = 0; i = e[u++], n = e[u++], r = e[u++], o = i >> 2, s = (3 & i) << 4 | n >> 4, a = (15 & n) << 2 | r >> 6, l = 63 & r, isNaN(n) ? a = l = 64 : isNaN(r) && (l = 64), t = t + this.KEY_STR.charAt(o) + this.KEY_STR.charAt(s) + this.KEY_STR.charAt(a) + this.KEY_STR.charAt(l), i = n = r = "", o = s = a = l = "", u < e.length;);
                                return t
                            }
                        }, {
                            key: "restore",
                            value: function (e, t) {
                                if (!e.match("data:image/jpeg;base64,")) return t;
                                var i = this.decode64(e.replace("data:image/jpeg;base64,", "")),
                                    n = this.slice2Segments(i),
                                    r = this.exifManipulation(t, n);
                                return "data:image/jpeg;base64," + this.encode64(r)
                            }
                        }, {
                            key: "exifManipulation",
                            value: function (e, t) {
                                var i = this.getExifArray(t),
                                    n = this.insertExif(e, i);
                                return new Uint8Array(n)
                            }
                        }, {
                            key: "getExifArray",
                            value: function (e) {
                                for (var t = void 0, i = 0; i < e.length;) {
                                    if (255 === (t = e[i])[0] & 225 === t[1]) return t;
                                    i++
                                }
                                return []
                            }
                        }, {
                            key: "insertExif",
                            value: function (e, t) {
                                var i = e.replace("data:image/jpeg;base64,", ""),
                                    n = this.decode64(i),
                                    r = n.indexOf(255, 3),
                                    o = n.slice(0, r),
                                    s = n.slice(r),
                                    a = o;
                                return a = a.concat(t), a = a.concat(s)
                            }
                        }, {
                            key: "slice2Segments",
                            value: function (e) {
                                for (var t = 0, i = []; ;) {
                                    var n;
                                    if (255 === e[t] & 218 === e[t + 1]) break;
                                    if (255 === e[t] & 216 === e[t + 1]) t += 2;
                                    else {
                                        var r = t + (n = 256 * e[t + 2] + e[t + 3]) + 2,
                                            o = e.slice(t, r);
                                        i.push(o), t = r
                                    } if (t > e.length) break
                                }
                                return i
                            }
                        }, {
                            key: "decode64",
                            value: function (e) {
                                var t = void 0,
                                    i = void 0,
                                    n = "",
                                    r = void 0,
                                    o = void 0,
                                    s = void 0,
                                    a = "",
                                    l = 0,
                                    u = [];
                                for (/[^A-Za-z0-9\+\/\=]/g.exec(e) && console.warn("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); r = this.KEY_STR.indexOf(e.charAt(l++)), o = this.KEY_STR.indexOf(e.charAt(l++)), s = this.KEY_STR.indexOf(e.charAt(l++)), a = this.KEY_STR.indexOf(e.charAt(l++)), t = r << 2 | o >> 4, i = (15 & o) << 4 | s >> 2, n = (3 & s) << 6 | a, u.push(t), 64 !== s && u.push(i), 64 !== a && u.push(n), t = i = n = "", r = o = s = a = "", l < e.length;);
                                return u
                            }
                        }]), e
                    }();
                u.initClass(), o._autoDiscoverFunction = function () {
                    if (o.autoDiscover) return o.discover()
                },
                    function (e, t) {
                        var i = !1,
                            n = !0,
                            r = e.document,
                            o = r.documentElement,
                            s = r.addEventListener ? "addEventListener" : "attachEvent",
                            a = r.addEventListener ? "removeEventListener" : "detachEvent",
                            l = r.addEventListener ? "" : "on",
                            u = function n(o) {
                                if ("readystatechange" !== o.type || "complete" === r.readyState) return ("load" === o.type ? e : r)[a](l + o.type, n, !1), !i && (i = !0) ? t.call(e, o.type || o) : void 0
                            };
                        if ("complete" !== r.readyState) {
                            if (r.createEventObject && o.doScroll) {
                                try {
                                    n = !e.frameElement
                                } catch (e) { }
                                n && function e() {
                                    try {
                                        o.doScroll("left")
                                    } catch (t) {
                                        return void setTimeout(e, 50)
                                    }
                                    return u("poll")
                                }()
                            }
                            r[s](l + "DOMContentLoaded", u, !1), r[s](l + "readystatechange", u, !1), e[s](l + "load", u, !1)
                        }
                    }(window, o._autoDiscoverFunction)
            }).call(t, i(6)(e))
        },
        function (e, t) {
            e.exports = function (e) {
                return e.webpackPolyfill || (e.deprecate = function () { }, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
                    enumerable: !0,
                    get: function () {
                        return e.l
                    }
                }), Object.defineProperty(e, "id", {
                    enumerable: !0,
                    get: function () {
                        return e.i
                    }
                }), e.webpackPolyfill = 1), e
            }
        }
    ])
});
//# sourceMappingURL=react-dropzone.js.map