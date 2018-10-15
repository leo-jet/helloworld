(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.coreapi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BasicAuthentication = function () {
  function BasicAuthentication() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BasicAuthentication);

    var username = options.username;
    var password = options.password;
    var hash = window.btoa(username + ':' + password);
    this.auth = 'Basic ' + hash;
  }

  _createClass(BasicAuthentication, [{
    key: 'authenticate',
    value: function authenticate(options) {
      options.headers['Authorization'] = this.auth;
      return options;
    }
  }]);

  return BasicAuthentication;
}();

module.exports = {
  BasicAuthentication: BasicAuthentication
};

},{}],2:[function(require,module,exports){
'use strict';

var basic = require('./basic');
var session = require('./session');
var token = require('./token');

module.exports = {
  BasicAuthentication: basic.BasicAuthentication,
  SessionAuthentication: session.SessionAuthentication,
  TokenAuthentication: token.TokenAuthentication
};

},{"./basic":1,"./session":3,"./token":4}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('../utils');

function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function getCookie(cookieName, cookieString) {
  cookieString = cookieString || window.document.cookie;
  if (cookieString && cookieString !== '') {
    var cookies = cookieString.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, cookieName.length + 1) === cookieName + '=') {
        return decodeURIComponent(cookie.substring(cookieName.length + 1));
      }
    }
  }
  return null;
}

var SessionAuthentication = function () {
  function SessionAuthentication() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, SessionAuthentication);

    this.csrfToken = getCookie(options.csrfCookieName, options.cookieString);
    this.csrfHeaderName = options.csrfHeaderName;
  }

  _createClass(SessionAuthentication, [{
    key: 'authenticate',
    value: function authenticate(options) {
      options.credentials = 'same-origin';
      if (this.csrfToken && !utils.csrfSafeMethod(options.method)) {
        options.headers[this.csrfHeaderName] = this.csrfToken;
      }
      return options;
    }
  }]);

  return SessionAuthentication;
}();

module.exports = {
  SessionAuthentication: SessionAuthentication
};

},{"../utils":15}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TokenAuthentication = function () {
  function TokenAuthentication() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TokenAuthentication);

    this.token = options.token;
    this.scheme = options.scheme || 'Bearer';
  }

  _createClass(TokenAuthentication, [{
    key: 'authenticate',
    value: function authenticate(options) {
      options.headers['Authorization'] = this.scheme + ' ' + this.token;
      return options;
    }
  }]);

  return TokenAuthentication;
}();

module.exports = {
  TokenAuthentication: TokenAuthentication
};

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var document = require('./document');
var codecs = require('./codecs');
var errors = require('./errors');
var transports = require('./transports');
var utils = require('./utils');

function lookupLink(node, keys) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (node instanceof document.Document) {
        node = node.content[key];
      } else {
        node = node[key];
      }
      if (node === undefined) {
        throw new errors.LinkLookupError('Invalid link lookup: ' + JSON.stringify(keys));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (!(node instanceof document.Link)) {
    throw new errors.LinkLookupError('Invalid link lookup: ' + JSON.stringify(keys));
  }
  return node;
}

var Client = function () {
  function Client() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Client);

    var transportOptions = {
      auth: options.auth || null,
      headers: options.headers || {},
      requestCallback: options.requestCallback,
      responseCallback: options.responseCallback
    };

    this.decoders = options.decoders || [new codecs.CoreJSONCodec(), new codecs.JSONCodec(), new codecs.TextCodec()];
    this.transports = options.transports || [new transports.HTTPTransport(transportOptions)];
  }

  _createClass(Client, [{
    key: 'action',
    value: function action(document, keys) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var link = lookupLink(document, keys);
      var transport = utils.determineTransport(this.transports, link.url);
      return transport.action(link, this.decoders, params);
    }
  }, {
    key: 'get',
    value: function get(url) {
      var link = new document.Link(url, 'get');
      var transport = utils.determineTransport(this.transports, url);
      return transport.action(link, this.decoders);
    }
  }]);

  return Client;
}();

module.exports = {
  Client: Client
};

},{"./codecs":7,"./document":10,"./errors":11,"./transports":14,"./utils":15}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var document = require('../document');
var URL = require('url-parse');

function unescapeKey(key) {
  if (key.match(/__(type|meta)$/)) {
    return key.substring(1);
  }
  return key;
}

function getString(obj, key) {
  var value = obj[key];
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

function getBoolean(obj, key) {
  var value = obj[key];
  if (typeof value === 'boolean') {
    return value;
  }
  return false;
}

function getObject(obj, key) {
  var value = obj[key];
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    return value;
  }
  return {};
}

function getArray(obj, key) {
  var value = obj[key];
  if (value instanceof Array) {
    return value;
  }
  return [];
}

function getContent(data, baseUrl) {
  var excluded = ['_type', '_meta'];
  var content = {};
  for (var property in data) {
    if (data.hasOwnProperty(property) && !excluded.includes(property)) {
      var key = unescapeKey(property);
      var value = primitiveToNode(data[property], baseUrl);
      content[key] = value;
    }
  }
  return content;
}

function primitiveToNode(data, baseUrl) {
  var isObject = data instanceof Object && !(data instanceof Array);

  if (isObject && data._type === 'document') {
    // Document
    var meta = getObject(data, '_meta');
    var relativeUrl = getString(meta, 'url');
    var url = relativeUrl ? URL(relativeUrl, baseUrl).toString() : '';
    var title = getString(meta, 'title');
    var description = getString(meta, 'description');
    var content = getContent(data, url);
    return new document.Document(url, title, description, content);
  } else if (isObject && data._type === 'link') {
    // Link
    var _relativeUrl = getString(data, 'url');
    var _url = _relativeUrl ? URL(_relativeUrl, baseUrl).toString() : '';
    var method = getString(data, 'action') || 'get';
    var _title = getString(data, 'title');
    var _description = getString(data, 'description');
    var fieldsData = getArray(data, 'fields');
    var fields = [];
    for (var idx = 0, len = fieldsData.length; idx < len; idx++) {
      var value = fieldsData[idx];
      var name = getString(value, 'name');
      var required = getBoolean(value, 'required');
      var location = getString(value, 'location');
      var fieldDescription = getString(value, 'fieldDescription');
      var field = new document.Field(name, required, location, fieldDescription);
      fields.push(field);
    }
    return new document.Link(_url, method, 'application/json', fields, _title, _description);
  } else if (isObject) {
    // Object
    var _content = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        _content[key] = primitiveToNode(data[key], baseUrl);
      }
    }
    return _content;
  } else if (data instanceof Array) {
    // Object
    var _content2 = [];
    for (var _idx = 0, _len = data.length; _idx < _len; _idx++) {
      _content2.push(primitiveToNode(data[_idx], baseUrl));
    }
    return _content2;
  }
  // Primitive
  return data;
}

var CoreJSONCodec = function () {
  function CoreJSONCodec() {
    _classCallCheck(this, CoreJSONCodec);

    this.mediaType = 'application/coreapi+json';
  }

  _createClass(CoreJSONCodec, [{
    key: 'decode',
    value: function decode(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var data = text;
      if (options.preloaded === undefined || !options.preloaded) {
        data = JSON.parse(text);
      }
      return primitiveToNode(data, options.url);
    }
  }]);

  return CoreJSONCodec;
}();

module.exports = {
  CoreJSONCodec: CoreJSONCodec
};

},{"../document":10,"url-parse":19}],7:[function(require,module,exports){
'use strict';

var corejson = require('./corejson');
var json = require('./json');
var text = require('./text');

module.exports = {
  CoreJSONCodec: corejson.CoreJSONCodec,
  JSONCodec: json.JSONCodec,
  TextCodec: text.TextCodec
};

},{"./corejson":6,"./json":8,"./text":9}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSONCodec = function () {
  function JSONCodec() {
    _classCallCheck(this, JSONCodec);

    this.mediaType = 'application/json';
  }

  _createClass(JSONCodec, [{
    key: 'decode',
    value: function decode(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return JSON.parse(text);
    }
  }]);

  return JSONCodec;
}();

module.exports = {
  JSONCodec: JSONCodec
};

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextCodec = function () {
  function TextCodec() {
    _classCallCheck(this, TextCodec);

    this.mediaType = 'text/*';
  }

  _createClass(TextCodec, [{
    key: 'decode',
    value: function decode(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return text;
    }
  }]);

  return TextCodec;
}();

module.exports = {
  TextCodec: TextCodec
};

},{}],10:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Document = function Document() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var description = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var content = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  _classCallCheck(this, Document);

  this.url = url;
  this.title = title;
  this.description = description;
  this.content = content;
};

var Link = function Link(url, method) {
  var encoding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'application/json';
  var fields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var title = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var description = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

  _classCallCheck(this, Link);

  if (url === undefined) {
    throw new Error('url argument is required');
  }

  if (method === undefined) {
    throw new Error('method argument is required');
  }

  this.url = url;
  this.method = method;
  this.encoding = encoding;
  this.fields = fields;
  this.title = title;
  this.description = description;
};

var Field = function Field(name) {
  var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var location = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  _classCallCheck(this, Field);

  if (name === undefined) {
    throw new Error('name argument is required');
  }

  this.name = name;
  this.required = required;
  this.location = location;
  this.description = description;
};

module.exports = {
  Document: Document,
  Link: Link,
  Field: Field
};

},{}],11:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParameterError = function (_Error) {
  _inherits(ParameterError, _Error);

  function ParameterError(message) {
    _classCallCheck(this, ParameterError);

    var _this = _possibleConstructorReturn(this, (ParameterError.__proto__ || Object.getPrototypeOf(ParameterError)).call(this, message));

    _this.message = message;
    _this.name = 'ParameterError';
    return _this;
  }

  return ParameterError;
}(Error);

var LinkLookupError = function (_Error2) {
  _inherits(LinkLookupError, _Error2);

  function LinkLookupError(message) {
    _classCallCheck(this, LinkLookupError);

    var _this2 = _possibleConstructorReturn(this, (LinkLookupError.__proto__ || Object.getPrototypeOf(LinkLookupError)).call(this, message));

    _this2.message = message;
    _this2.name = 'LinkLookupError';
    return _this2;
  }

  return LinkLookupError;
}(Error);

var ErrorMessage = function (_Error3) {
  _inherits(ErrorMessage, _Error3);

  function ErrorMessage(message, content) {
    _classCallCheck(this, ErrorMessage);

    var _this3 = _possibleConstructorReturn(this, (ErrorMessage.__proto__ || Object.getPrototypeOf(ErrorMessage)).call(this, message));

    _this3.message = message;
    _this3.content = content;
    _this3.name = 'ErrorMessage';
    return _this3;
  }

  return ErrorMessage;
}(Error);

module.exports = {
  ParameterError: ParameterError,
  LinkLookupError: LinkLookupError,
  ErrorMessage: ErrorMessage
};

},{}],12:[function(require,module,exports){
'use strict';

var auth = require('./auth');
var client = require('./client');
var codecs = require('./codecs');
var document = require('./document');
var errors = require('./errors');
var transports = require('./transports');
var utils = require('./utils');

var coreapi = {
  Client: client.Client,
  Document: document.Document,
  Link: document.Link,
  auth: auth,
  codecs: codecs,
  errors: errors,
  transports: transports,
  utils: utils
};

module.exports = coreapi;

},{"./auth":2,"./client":5,"./codecs":7,"./document":10,"./errors":11,"./transports":14,"./utils":15}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = require('isomorphic-fetch');
var errors = require('../errors');
var utils = require('../utils');
var URL = require('url-parse');
var urlTemplate = require('url-template');

var parseResponse = function parseResponse(response, decoders, responseCallback) {
  return response.text().then(function (text) {
    if (responseCallback) {
      responseCallback(response, text);
    }
    var contentType = response.headers.get('Content-Type');
    var decoder = utils.negotiateDecoder(decoders, contentType);
    var options = { url: response.url };
    return decoder.decode(text, options);
  });
};

var HTTPTransport = function () {
  function HTTPTransport() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HTTPTransport);

    this.schemes = ['http', 'https'];
    this.auth = options.auth || null;
    this.headers = options.headers || {};
    this.fetch = options.fetch || fetch;
    this.FormData = options.FormData || window.FormData;
    this.requestCallback = options.requestCallback;
    this.responseCallback = options.responseCallback;
  }

  _createClass(HTTPTransport, [{
    key: 'buildRequest',
    value: function buildRequest(link, decoders) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var fields = link.fields;
      var method = link.method.toUpperCase();
      var queryParams = {};
      var pathParams = {};
      var formParams = {};
      var fieldNames = [];
      var hasBody = false;

      for (var idx = 0, len = fields.length; idx < len; idx++) {
        var field = fields[idx];

        // Ensure any required fields are included
        if (!params.hasOwnProperty(field.name)) {
          if (field.required) {
            throw new errors.ParameterError('Missing required field: "' + field.name + '"');
          } else {
            continue;
          }
        }

        fieldNames.push(field.name);
        if (field.location === 'query') {
          queryParams[field.name] = params[field.name];
        } else if (field.location === 'path') {
          pathParams[field.name] = params[field.name];
        } else if (field.location === 'form') {
          formParams[field.name] = params[field.name];
          hasBody = true;
        } else if (field.location === 'body') {
          formParams = params[field.name];
          hasBody = true;
        }
      }

      // Check for any parameters that did not have a matching field
      for (var property in params) {
        if (params.hasOwnProperty(property) && !fieldNames.includes(property)) {
          throw new errors.ParameterError('Unknown parameter: "' + property + '"');
        }
      }

      var requestOptions = { method: method, headers: {} };

      Object.assign(requestOptions.headers, this.headers);

      if (hasBody) {
        if (link.encoding === 'application/json') {
          requestOptions.body = JSON.stringify(formParams);
          requestOptions.headers['Content-Type'] = 'application/json';
        } else if (link.encoding === 'multipart/form-data') {
          var form = new this.FormData();

          for (var paramKey in formParams) {
            form.append(paramKey, formParams[paramKey]);
          }
          requestOptions.body = form;
        } else if (link.encoding === 'application/x-www-form-urlencoded') {
          var formBody = [];
          for (var _paramKey in formParams) {
            var encodedKey = encodeURIComponent(_paramKey);
            var encodedValue = encodeURIComponent(formParams[_paramKey]);
            formBody.push(encodedKey + '=' + encodedValue);
          }
          formBody = formBody.join('&');

          requestOptions.body = formBody;
          requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      }

      if (this.auth) {
        requestOptions = this.auth.authenticate(requestOptions);
      }

      var parsedUrl = urlTemplate.parse(link.url);
      parsedUrl = parsedUrl.expand(pathParams);
      parsedUrl = new URL(parsedUrl);
      parsedUrl.set('query', queryParams);

      return {
        url: parsedUrl.toString(),
        options: requestOptions
      };
    }
  }, {
    key: 'action',
    value: function action(link, decoders) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var responseCallback = this.responseCallback;
      var request = this.buildRequest(link, decoders, params);

      if (this.requestCallback) {
        this.requestCallback(request);
      }

      return this.fetch(request.url, request.options).then(function (response) {
        if (response.status === 204) {
          return;
        }
        return parseResponse(response, decoders, responseCallback).then(function (data) {
          if (response.ok) {
            return data;
          } else {
            var title = response.status + ' ' + response.statusText;
            var error = new errors.ErrorMessage(title, data);
            return Promise.reject(error);
          }
        });
      });
    }
  }]);

  return HTTPTransport;
}();

module.exports = {
  HTTPTransport: HTTPTransport
};

},{"../errors":11,"../utils":15,"isomorphic-fetch":16,"url-parse":19,"url-template":21}],14:[function(require,module,exports){
'use strict';

var http = require('./http');

module.exports = {
  HTTPTransport: http.HTTPTransport
};

},{"./http":13}],15:[function(require,module,exports){
'use strict';

var URL = require('url-parse');

var determineTransport = function determineTransport(transports, url) {
  var parsedUrl = new URL(url);
  var scheme = parsedUrl.protocol.replace(':', '');

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = transports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var transport = _step.value;

      if (transport.schemes.includes(scheme)) {
        return transport;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  throw Error('Unsupported scheme in URL: ' + url);
};

var negotiateDecoder = function negotiateDecoder(decoders, contentType) {
  if (contentType === undefined || contentType === null) {
    return decoders[0];
  }

  var fullType = contentType.toLowerCase().split(';')[0].trim();
  var mainType = fullType.split('/')[0] + '/*';
  var wildcardType = '*/*';
  var acceptableTypes = [fullType, mainType, wildcardType];

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = decoders[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var decoder = _step2.value;

      if (acceptableTypes.includes(decoder.mediaType)) {
        return decoder;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  throw Error('Unsupported media in Content-Type header: ' + contentType);
};

var csrfSafeMethod = function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
  );
};

module.exports = {
  determineTransport: determineTransport,
  negotiateDecoder: negotiateDecoder,
  csrfSafeMethod: csrfSafeMethod
};

},{"url-parse":19}],16:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":22}],17:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],18:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],19:[function(require,module,exports){
'use strict';

var required = require('requires-port')
  , lolcation = require('./lolcation')
  , qs = require('querystringify')
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
URL.prototype.set = function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
      url.pathname = value.length && value.charAt(0) !== '/' ? '/' + value : value;

      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
};

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
URL.prototype.toString = function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
};

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;

},{"./lolcation":20,"querystringify":17,"requires-port":18}],20:[function(require,module,exports){
(function (global){
'use strict';

var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 }
  , URL;

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
module.exports = function lolcation(loc) {
  loc = loc || global.location || {};
  URL = URL || require('./');

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./":19}],21:[function(require,module,exports){
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.urltemplate = factory();
    }
}(this, function () {
  /**
   * @constructor
   */
  function UrlTemplate() {
  }

  /**
   * @private
   * @param {string} str
   * @return {string}
   */
  UrlTemplate.prototype.encodeReserved = function (str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, '[').replace(/%5D/g, ']');
      }
      return part;
    }).join('');
  };

  /**
   * @private
   * @param {string} str
   * @return {string}
   */
  UrlTemplate.prototype.encodeUnreserved = function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  /**
   * @private
   * @param {string} operator
   * @param {string} value
   * @param {string} key
   * @return {string}
   */
  UrlTemplate.prototype.encodeValue = function (operator, value, key) {
    value = (operator === '+' || operator === '#') ? this.encodeReserved(value) : this.encodeUnreserved(value);

    if (key) {
      return this.encodeUnreserved(key) + '=' + value;
    } else {
      return value;
    }
  };

  /**
   * @private
   * @param {*} value
   * @return {boolean}
   */
  UrlTemplate.prototype.isDefined = function (value) {
    return value !== undefined && value !== null;
  };

  /**
   * @private
   * @param {string}
   * @return {boolean}
   */
  UrlTemplate.prototype.isKeyOperator = function (operator) {
    return operator === ';' || operator === '&' || operator === '?';
  };

  /**
   * @private
   * @param {Object} context
   * @param {string} operator
   * @param {string} key
   * @param {string} modifier
   */
  UrlTemplate.prototype.getValues = function (context, operator, key, modifier) {
    var value = context[key],
        result = [];

    if (this.isDefined(value) && value !== '') {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        value = value.toString();

        if (modifier && modifier !== '*') {
          value = value.substring(0, parseInt(modifier, 10));
        }

        result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
      } else {
        if (modifier === '*') {
          if (Array.isArray(value)) {
            value.filter(this.isDefined).forEach(function (value) {
              result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
            }, this);
          } else {
            Object.keys(value).forEach(function (k) {
              if (this.isDefined(value[k])) {
                result.push(this.encodeValue(operator, value[k], k));
              }
            }, this);
          }
        } else {
          var tmp = [];

          if (Array.isArray(value)) {
            value.filter(this.isDefined).forEach(function (value) {
              tmp.push(this.encodeValue(operator, value));
            }, this);
          } else {
            Object.keys(value).forEach(function (k) {
              if (this.isDefined(value[k])) {
                tmp.push(this.encodeUnreserved(k));
                tmp.push(this.encodeValue(operator, value[k].toString()));
              }
            }, this);
          }

          if (this.isKeyOperator(operator)) {
            result.push(this.encodeUnreserved(key) + '=' + tmp.join(','));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(','));
          }
        }
      }
    } else {
      if (operator === ';') {
        if (this.isDefined(value)) {
          result.push(this.encodeUnreserved(key));
        }
      } else if (value === '' && (operator === '&' || operator === '?')) {
        result.push(this.encodeUnreserved(key) + '=');
      } else if (value === '') {
        result.push('');
      }
    }
    return result;
  };

  /**
   * @param {string} template
   * @return {function(Object):string}
   */
  UrlTemplate.prototype.parse = function (template) {
    var that = this;
    var operators = ['+', '#', '.', '/', ';', '?', '&'];

    return {
      expand: function (context) {
        return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
          if (expression) {
            var operator = null,
                values = [];

            if (operators.indexOf(expression.charAt(0)) !== -1) {
              operator = expression.charAt(0);
              expression = expression.substr(1);
            }

            expression.split(/,/g).forEach(function (variable) {
              var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
              values.push.apply(values, that.getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });

            if (operator && operator !== '+') {
              var separator = ',';

              if (operator === '?') {
                separator = '&';
              } else if (operator !== '#') {
                separator = operator;
              }
              return (values.length !== 0 ? operator : '') + values.join(separator);
            } else {
              return values.join(',');
            }
          } else {
            return that.encodeReserved(literal);
          }
        });
      }
    };
  };

  return new UrlTemplate();
}));

},{}],22:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        var view = new Uint8Array(this._bodyArrayBuffer)
        var str = String.fromCharCode.apply(null, view)
        return Promise.resolve(str)
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.arrayBuffer) {
      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (typeof input === 'string') {
      this.url = input
    } else {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split('\r\n').forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}]},{},[12])(12)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXV0aC9iYXNpYy5qcyIsImxpYi9hdXRoL2luZGV4LmpzIiwibGliL2F1dGgvc2Vzc2lvbi5qcyIsImxpYi9hdXRoL3Rva2VuLmpzIiwibGliL2NsaWVudC5qcyIsImxpYi9jb2RlY3MvY29yZWpzb24uanMiLCJsaWIvY29kZWNzL2luZGV4LmpzIiwibGliL2NvZGVjcy9qc29uLmpzIiwibGliL2NvZGVjcy90ZXh0LmpzIiwibGliL2RvY3VtZW50LmpzIiwibGliL2Vycm9ycy5qcyIsImxpYi9pbmRleC5qcyIsImxpYi90cmFuc3BvcnRzL2h0dHAuanMiLCJsaWIvdHJhbnNwb3J0cy9pbmRleC5qcyIsImxpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9pc29tb3JwaGljLWZldGNoL2ZldGNoLW5wbS1icm93c2VyaWZ5LmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5naWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlcXVpcmVzLXBvcnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXJsLXBhcnNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3VybC1wYXJzZS9sb2xjYXRpb24uanMiLCJub2RlX21vZHVsZXMvdXJsLXRlbXBsYXRlL2xpYi91cmwtdGVtcGxhdGUuanMiLCJub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0lDQU0sbUI7QUFDSixpQ0FBMkI7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDekIsUUFBTSxXQUFXLFFBQVEsUUFBekI7QUFDQSxRQUFNLFdBQVcsUUFBUSxRQUF6QjtBQUNBLFFBQU0sT0FBTyxPQUFPLElBQVAsQ0FBWSxXQUFXLEdBQVgsR0FBaUIsUUFBN0IsQ0FBYjtBQUNBLFNBQUssSUFBTCxHQUFZLFdBQVcsSUFBdkI7QUFDRDs7OztpQ0FFYSxP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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQmFzaWNBdXRoZW50aWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IG9wdGlvbnMudXNlcm5hbWVcbiAgICBjb25zdCBwYXNzd29yZCA9IG9wdGlvbnMucGFzc3dvcmRcbiAgICBjb25zdCBoYXNoID0gd2luZG93LmJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZClcbiAgICB0aGlzLmF1dGggPSAnQmFzaWMgJyArIGhhc2hcbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZSAob3B0aW9ucykge1xuICAgIG9wdGlvbnMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gdGhpcy5hdXRoXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQmFzaWNBdXRoZW50aWNhdGlvbjogQmFzaWNBdXRoZW50aWNhdGlvblxufVxuIiwiY29uc3QgYmFzaWMgPSByZXF1aXJlKCcuL2Jhc2ljJylcbmNvbnN0IHNlc3Npb24gPSByZXF1aXJlKCcuL3Nlc3Npb24nKVxuY29uc3QgdG9rZW4gPSByZXF1aXJlKCcuL3Rva2VuJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJhc2ljQXV0aGVudGljYXRpb246IGJhc2ljLkJhc2ljQXV0aGVudGljYXRpb24sXG4gIFNlc3Npb25BdXRoZW50aWNhdGlvbjogc2Vzc2lvbi5TZXNzaW9uQXV0aGVudGljYXRpb24sXG4gIFRva2VuQXV0aGVudGljYXRpb246IHRva2VuLlRva2VuQXV0aGVudGljYXRpb25cbn1cbiIsImNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG5mdW5jdGlvbiB0cmltIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKS5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKVxufVxuXG5mdW5jdGlvbiBnZXRDb29raWUgKGNvb2tpZU5hbWUsIGNvb2tpZVN0cmluZykge1xuICBjb29raWVTdHJpbmcgPSBjb29raWVTdHJpbmcgfHwgd2luZG93LmRvY3VtZW50LmNvb2tpZVxuICBpZiAoY29va2llU3RyaW5nICYmIGNvb2tpZVN0cmluZyAhPT0gJycpIHtcbiAgICBjb25zdCBjb29raWVzID0gY29va2llU3RyaW5nLnNwbGl0KCc7JylcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvb2tpZSA9IHRyaW0oY29va2llc1tpXSlcbiAgICAgIC8vIERvZXMgdGhpcyBjb29raWUgc3RyaW5nIGJlZ2luIHdpdGggdGhlIG5hbWUgd2Ugd2FudD9cbiAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIGNvb2tpZU5hbWUubGVuZ3RoICsgMSkgPT09IChjb29raWVOYW1lICsgJz0nKSkge1xuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcoY29va2llTmFtZS5sZW5ndGggKyAxKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuY2xhc3MgU2Vzc2lvbkF1dGhlbnRpY2F0aW9uIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuY3NyZlRva2VuID0gZ2V0Q29va2llKG9wdGlvbnMuY3NyZkNvb2tpZU5hbWUsIG9wdGlvbnMuY29va2llU3RyaW5nKVxuICAgIHRoaXMuY3NyZkhlYWRlck5hbWUgPSBvcHRpb25zLmNzcmZIZWFkZXJOYW1lXG4gIH1cblxuICBhdXRoZW50aWNhdGUgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmNyZWRlbnRpYWxzID0gJ3NhbWUtb3JpZ2luJ1xuICAgIGlmICh0aGlzLmNzcmZUb2tlbiAmJiAhdXRpbHMuY3NyZlNhZmVNZXRob2Qob3B0aW9ucy5tZXRob2QpKSB7XG4gICAgICBvcHRpb25zLmhlYWRlcnNbdGhpcy5jc3JmSGVhZGVyTmFtZV0gPSB0aGlzLmNzcmZUb2tlblxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTZXNzaW9uQXV0aGVudGljYXRpb246IFNlc3Npb25BdXRoZW50aWNhdGlvblxufVxuIiwiY2xhc3MgVG9rZW5BdXRoZW50aWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnRva2VuID0gb3B0aW9ucy50b2tlblxuICAgIHRoaXMuc2NoZW1lID0gb3B0aW9ucy5zY2hlbWUgfHwgJ0JlYXJlcidcbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZSAob3B0aW9ucykge1xuICAgIG9wdGlvbnMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gdGhpcy5zY2hlbWUgKyAnICcgKyB0aGlzLnRva2VuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVG9rZW5BdXRoZW50aWNhdGlvbjogVG9rZW5BdXRoZW50aWNhdGlvblxufVxuIiwiY29uc3QgZG9jdW1lbnQgPSByZXF1aXJlKCcuL2RvY3VtZW50JylcbmNvbnN0IGNvZGVjcyA9IHJlcXVpcmUoJy4vY29kZWNzJylcbmNvbnN0IGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJylcbmNvbnN0IHRyYW5zcG9ydHMgPSByZXF1aXJlKCcuL3RyYW5zcG9ydHMnKVxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJylcblxuZnVuY3Rpb24gbG9va3VwTGluayAobm9kZSwga2V5cykge1xuICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgZG9jdW1lbnQuRG9jdW1lbnQpIHtcbiAgICAgIG5vZGUgPSBub2RlLmNvbnRlbnRba2V5XVxuICAgIH0gZWxzZSB7XG4gICAgICBub2RlID0gbm9kZVtrZXldXG4gICAgfVxuICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuTGlua0xvb2t1cEVycm9yKGBJbnZhbGlkIGxpbmsgbG9va3VwOiAke0pTT04uc3RyaW5naWZ5KGtleXMpfWApXG4gICAgfVxuICB9XG4gIGlmICghKG5vZGUgaW5zdGFuY2VvZiBkb2N1bWVudC5MaW5rKSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuTGlua0xvb2t1cEVycm9yKGBJbnZhbGlkIGxpbmsgbG9va3VwOiAke0pTT04uc3RyaW5naWZ5KGtleXMpfWApXG4gIH1cbiAgcmV0dXJuIG5vZGVcbn1cblxuY2xhc3MgQ2xpZW50IHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHRyYW5zcG9ydE9wdGlvbnMgPSB7XG4gICAgICBhdXRoOiBvcHRpb25zLmF1dGggfHwgbnVsbCxcbiAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyB8fCB7fSxcbiAgICAgIHJlcXVlc3RDYWxsYmFjazogb3B0aW9ucy5yZXF1ZXN0Q2FsbGJhY2ssXG4gICAgICByZXNwb25zZUNhbGxiYWNrOiBvcHRpb25zLnJlc3BvbnNlQ2FsbGJhY2tcbiAgICB9XG5cbiAgICB0aGlzLmRlY29kZXJzID0gb3B0aW9ucy5kZWNvZGVycyB8fCBbbmV3IGNvZGVjcy5Db3JlSlNPTkNvZGVjKCksIG5ldyBjb2RlY3MuSlNPTkNvZGVjKCksIG5ldyBjb2RlY3MuVGV4dENvZGVjKCldXG4gICAgdGhpcy50cmFuc3BvcnRzID0gb3B0aW9ucy50cmFuc3BvcnRzIHx8IFtuZXcgdHJhbnNwb3J0cy5IVFRQVHJhbnNwb3J0KHRyYW5zcG9ydE9wdGlvbnMpXVxuICB9XG5cbiAgYWN0aW9uIChkb2N1bWVudCwga2V5cywgcGFyYW1zID0ge30pIHtcbiAgICBjb25zdCBsaW5rID0gbG9va3VwTGluayhkb2N1bWVudCwga2V5cylcbiAgICBjb25zdCB0cmFuc3BvcnQgPSB1dGlscy5kZXRlcm1pbmVUcmFuc3BvcnQodGhpcy50cmFuc3BvcnRzLCBsaW5rLnVybClcbiAgICByZXR1cm4gdHJhbnNwb3J0LmFjdGlvbihsaW5rLCB0aGlzLmRlY29kZXJzLCBwYXJhbXMpXG4gIH1cblxuICBnZXQgKHVybCkge1xuICAgIGNvbnN0IGxpbmsgPSBuZXcgZG9jdW1lbnQuTGluayh1cmwsICdnZXQnKVxuICAgIGNvbnN0IHRyYW5zcG9ydCA9IHV0aWxzLmRldGVybWluZVRyYW5zcG9ydCh0aGlzLnRyYW5zcG9ydHMsIHVybClcbiAgICByZXR1cm4gdHJhbnNwb3J0LmFjdGlvbihsaW5rLCB0aGlzLmRlY29kZXJzKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDbGllbnQ6IENsaWVudFxufVxuIiwiY29uc3QgZG9jdW1lbnQgPSByZXF1aXJlKCcuLi9kb2N1bWVudCcpXG5jb25zdCBVUkwgPSByZXF1aXJlKCd1cmwtcGFyc2UnKVxuXG5mdW5jdGlvbiB1bmVzY2FwZUtleSAoa2V5KSB7XG4gIGlmIChrZXkubWF0Y2goL19fKHR5cGV8bWV0YSkkLykpIHtcbiAgICByZXR1cm4ga2V5LnN1YnN0cmluZygxKVxuICB9XG4gIHJldHVybiBrZXlcbn1cblxuZnVuY3Rpb24gZ2V0U3RyaW5nIChvYmosIGtleSkge1xuICBjb25zdCB2YWx1ZSA9IG9ialtrZXldXG4gIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICByZXR1cm4gJydcbn1cblxuZnVuY3Rpb24gZ2V0Qm9vbGVhbiAob2JqLCBrZXkpIHtcbiAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBnZXRPYmplY3QgKG9iaiwga2V5KSB7XG4gIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cbiAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIHJldHVybiB7fVxufVxuXG5mdW5jdGlvbiBnZXRBcnJheSAob2JqLCBrZXkpIHtcbiAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBnZXRDb250ZW50IChkYXRhLCBiYXNlVXJsKSB7XG4gIGNvbnN0IGV4Y2x1ZGVkID0gWydfdHlwZScsICdfbWV0YSddXG4gIHZhciBjb250ZW50ID0ge31cbiAgZm9yICh2YXIgcHJvcGVydHkgaW4gZGF0YSkge1xuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiAhZXhjbHVkZWQuaW5jbHVkZXMocHJvcGVydHkpKSB7XG4gICAgICBjb25zdCBrZXkgPSB1bmVzY2FwZUtleShwcm9wZXJ0eSlcbiAgICAgIGNvbnN0IHZhbHVlID0gcHJpbWl0aXZlVG9Ob2RlKGRhdGFbcHJvcGVydHldLCBiYXNlVXJsKVxuICAgICAgY29udGVudFtrZXldID0gdmFsdWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnRcbn1cblxuZnVuY3Rpb24gcHJpbWl0aXZlVG9Ob2RlIChkYXRhLCBiYXNlVXJsKSB7XG4gIGNvbnN0IGlzT2JqZWN0ID0gZGF0YSBpbnN0YW5jZW9mIE9iamVjdCAmJiAhKGRhdGEgaW5zdGFuY2VvZiBBcnJheSlcblxuICBpZiAoaXNPYmplY3QgJiYgZGF0YS5fdHlwZSA9PT0gJ2RvY3VtZW50Jykge1xuICAgIC8vIERvY3VtZW50XG4gICAgY29uc3QgbWV0YSA9IGdldE9iamVjdChkYXRhLCAnX21ldGEnKVxuICAgIGNvbnN0IHJlbGF0aXZlVXJsID0gZ2V0U3RyaW5nKG1ldGEsICd1cmwnKVxuICAgIGNvbnN0IHVybCA9IHJlbGF0aXZlVXJsID8gVVJMKHJlbGF0aXZlVXJsLCBiYXNlVXJsKS50b1N0cmluZygpIDogJydcbiAgICBjb25zdCB0aXRsZSA9IGdldFN0cmluZyhtZXRhLCAndGl0bGUnKVxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZ2V0U3RyaW5nKG1ldGEsICdkZXNjcmlwdGlvbicpXG4gICAgY29uc3QgY29udGVudCA9IGdldENvbnRlbnQoZGF0YSwgdXJsKVxuICAgIHJldHVybiBuZXcgZG9jdW1lbnQuRG9jdW1lbnQodXJsLCB0aXRsZSwgZGVzY3JpcHRpb24sIGNvbnRlbnQpXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QgJiYgZGF0YS5fdHlwZSA9PT0gJ2xpbmsnKSB7XG4gICAgLy8gTGlua1xuICAgIGNvbnN0IHJlbGF0aXZlVXJsID0gZ2V0U3RyaW5nKGRhdGEsICd1cmwnKVxuICAgIGNvbnN0IHVybCA9IHJlbGF0aXZlVXJsID8gVVJMKHJlbGF0aXZlVXJsLCBiYXNlVXJsKS50b1N0cmluZygpIDogJydcbiAgICBjb25zdCBtZXRob2QgPSBnZXRTdHJpbmcoZGF0YSwgJ2FjdGlvbicpIHx8ICdnZXQnXG4gICAgY29uc3QgdGl0bGUgPSBnZXRTdHJpbmcoZGF0YSwgJ3RpdGxlJylcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGdldFN0cmluZyhkYXRhLCAnZGVzY3JpcHRpb24nKVxuICAgIGNvbnN0IGZpZWxkc0RhdGEgPSBnZXRBcnJheShkYXRhLCAnZmllbGRzJylcbiAgICB2YXIgZmllbGRzID0gW11cbiAgICBmb3IgKGxldCBpZHggPSAwLCBsZW4gPSBmaWVsZHNEYXRhLmxlbmd0aDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgICAgbGV0IHZhbHVlID0gZmllbGRzRGF0YVtpZHhdXG4gICAgICBsZXQgbmFtZSA9IGdldFN0cmluZyh2YWx1ZSwgJ25hbWUnKVxuICAgICAgbGV0IHJlcXVpcmVkID0gZ2V0Qm9vbGVhbih2YWx1ZSwgJ3JlcXVpcmVkJylcbiAgICAgIGxldCBsb2NhdGlvbiA9IGdldFN0cmluZyh2YWx1ZSwgJ2xvY2F0aW9uJylcbiAgICAgIGxldCBmaWVsZERlc2NyaXB0aW9uID0gZ2V0U3RyaW5nKHZhbHVlLCAnZmllbGREZXNjcmlwdGlvbicpXG4gICAgICBsZXQgZmllbGQgPSBuZXcgZG9jdW1lbnQuRmllbGQobmFtZSwgcmVxdWlyZWQsIGxvY2F0aW9uLCBmaWVsZERlc2NyaXB0aW9uKVxuICAgICAgZmllbGRzLnB1c2goZmllbGQpXG4gICAgfVxuICAgIHJldHVybiBuZXcgZG9jdW1lbnQuTGluayh1cmwsIG1ldGhvZCwgJ2FwcGxpY2F0aW9uL2pzb24nLCBmaWVsZHMsIHRpdGxlLCBkZXNjcmlwdGlvbilcbiAgfSBlbHNlIGlmIChpc09iamVjdCkge1xuICAgIC8vIE9iamVjdFxuICAgIGxldCBjb250ZW50ID0ge31cbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBjb250ZW50W2tleV0gPSBwcmltaXRpdmVUb05vZGUoZGF0YVtrZXldLCBiYXNlVXJsKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudFxuICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIC8vIE9iamVjdFxuICAgIGxldCBjb250ZW50ID0gW11cbiAgICBmb3IgKGxldCBpZHggPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgICAgY29udGVudC5wdXNoKHByaW1pdGl2ZVRvTm9kZShkYXRhW2lkeF0sIGJhc2VVcmwpKVxuICAgIH1cbiAgICByZXR1cm4gY29udGVudFxuICB9XG4gIC8vIFByaW1pdGl2ZVxuICByZXR1cm4gZGF0YVxufVxuXG5jbGFzcyBDb3JlSlNPTkNvZGVjIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubWVkaWFUeXBlID0gJ2FwcGxpY2F0aW9uL2NvcmVhcGkranNvbidcbiAgfVxuXG4gIGRlY29kZSAodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGRhdGEgPSB0ZXh0XG4gICAgaWYgKG9wdGlvbnMucHJlbG9hZGVkID09PSB1bmRlZmluZWQgfHwgIW9wdGlvbnMucHJlbG9hZGVkKSB7XG4gICAgICBkYXRhID0gSlNPTi5wYXJzZSh0ZXh0KVxuICAgIH1cbiAgICByZXR1cm4gcHJpbWl0aXZlVG9Ob2RlKGRhdGEsIG9wdGlvbnMudXJsKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDb3JlSlNPTkNvZGVjOiBDb3JlSlNPTkNvZGVjXG59XG4iLCJjb25zdCBjb3JlanNvbiA9IHJlcXVpcmUoJy4vY29yZWpzb24nKVxuY29uc3QganNvbiA9IHJlcXVpcmUoJy4vanNvbicpXG5jb25zdCB0ZXh0ID0gcmVxdWlyZSgnLi90ZXh0JylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENvcmVKU09OQ29kZWM6IGNvcmVqc29uLkNvcmVKU09OQ29kZWMsXG4gIEpTT05Db2RlYzoganNvbi5KU09OQ29kZWMsXG4gIFRleHRDb2RlYzogdGV4dC5UZXh0Q29kZWNcbn1cbiIsImNsYXNzIEpTT05Db2RlYyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLm1lZGlhVHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG5cbiAgZGVjb2RlICh0ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBKU09OQ29kZWM6IEpTT05Db2RlY1xufVxuIiwiY2xhc3MgVGV4dENvZGVjIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubWVkaWFUeXBlID0gJ3RleHQvKidcbiAgfVxuXG4gIGRlY29kZSAodGV4dCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVGV4dENvZGVjOiBUZXh0Q29kZWNcbn1cbiIsImNsYXNzIERvY3VtZW50IHtcbiAgY29uc3RydWN0b3IgKHVybCA9ICcnLCB0aXRsZSA9ICcnLCBkZXNjcmlwdGlvbiA9ICcnLCBjb250ZW50ID0ge30pIHtcbiAgICB0aGlzLnVybCA9IHVybFxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnRcbiAgfVxufVxuXG5jbGFzcyBMaW5rIHtcbiAgY29uc3RydWN0b3IgKHVybCwgbWV0aG9kLCBlbmNvZGluZyA9ICdhcHBsaWNhdGlvbi9qc29uJywgZmllbGRzID0gW10sIHRpdGxlID0gJycsIGRlc2NyaXB0aW9uID0gJycpIHtcbiAgICBpZiAodXJsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndXJsIGFyZ3VtZW50IGlzIHJlcXVpcmVkJylcbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWV0aG9kIGFyZ3VtZW50IGlzIHJlcXVpcmVkJylcbiAgICB9XG5cbiAgICB0aGlzLnVybCA9IHVybFxuICAgIHRoaXMubWV0aG9kID0gbWV0aG9kXG4gICAgdGhpcy5lbmNvZGluZyA9IGVuY29kaW5nXG4gICAgdGhpcy5maWVsZHMgPSBmaWVsZHNcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgfVxufVxuXG5jbGFzcyBGaWVsZCB7XG4gIGNvbnN0cnVjdG9yIChuYW1lLCByZXF1aXJlZCA9IGZhbHNlLCBsb2NhdGlvbiA9ICcnLCBkZXNjcmlwdGlvbiA9ICcnKSB7XG4gICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCduYW1lIGFyZ3VtZW50IGlzIHJlcXVpcmVkJylcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5yZXF1aXJlZCA9IHJlcXVpcmVkXG4gICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIERvY3VtZW50OiBEb2N1bWVudCxcbiAgTGluazogTGluayxcbiAgRmllbGQ6IEZpZWxkXG59XG4iLCJjbGFzcyBQYXJhbWV0ZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKVxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSAnUGFyYW1ldGVyRXJyb3InXG4gIH1cbn1cblxuY2xhc3MgTGlua0xvb2t1cEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9ICdMaW5rTG9va3VwRXJyb3InXG4gIH1cbn1cblxuY2xhc3MgRXJyb3JNZXNzYWdlIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvciAobWVzc2FnZSwgY29udGVudCkge1xuICAgIHN1cGVyKG1lc3NhZ2UpXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnRcbiAgICB0aGlzLm5hbWUgPSAnRXJyb3JNZXNzYWdlJ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBQYXJhbWV0ZXJFcnJvcjogUGFyYW1ldGVyRXJyb3IsXG4gIExpbmtMb29rdXBFcnJvcjogTGlua0xvb2t1cEVycm9yLFxuICBFcnJvck1lc3NhZ2U6IEVycm9yTWVzc2FnZVxufVxuIiwiY29uc3QgYXV0aCA9IHJlcXVpcmUoJy4vYXV0aCcpXG5jb25zdCBjbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpXG5jb25zdCBjb2RlY3MgPSByZXF1aXJlKCcuL2NvZGVjcycpXG5jb25zdCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vZG9jdW1lbnQnKVxuY29uc3QgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKVxuY29uc3QgdHJhbnNwb3J0cyA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0cycpXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxuXG5jb25zdCBjb3JlYXBpID0ge1xuICBDbGllbnQ6IGNsaWVudC5DbGllbnQsXG4gIERvY3VtZW50OiBkb2N1bWVudC5Eb2N1bWVudCxcbiAgTGluazogZG9jdW1lbnQuTGluayxcbiAgYXV0aDogYXV0aCxcbiAgY29kZWNzOiBjb2RlY3MsXG4gIGVycm9yczogZXJyb3JzLFxuICB0cmFuc3BvcnRzOiB0cmFuc3BvcnRzLFxuICB1dGlsczogdXRpbHNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlYXBpXG4iLCJjb25zdCBmZXRjaCA9IHJlcXVpcmUoJ2lzb21vcnBoaWMtZmV0Y2gnKVxuY29uc3QgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJylcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuY29uc3QgVVJMID0gcmVxdWlyZSgndXJsLXBhcnNlJylcbmNvbnN0IHVybFRlbXBsYXRlID0gcmVxdWlyZSgndXJsLXRlbXBsYXRlJylcblxuY29uc3QgcGFyc2VSZXNwb25zZSA9IChyZXNwb25zZSwgZGVjb2RlcnMsIHJlc3BvbnNlQ2FsbGJhY2spID0+IHtcbiAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKS50aGVuKHRleHQgPT4ge1xuICAgIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgICByZXNwb25zZUNhbGxiYWNrKHJlc3BvbnNlLCB0ZXh0KVxuICAgIH1cbiAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKVxuICAgIGNvbnN0IGRlY29kZXIgPSB1dGlscy5uZWdvdGlhdGVEZWNvZGVyKGRlY29kZXJzLCBjb250ZW50VHlwZSlcbiAgICBjb25zdCBvcHRpb25zID0ge3VybDogcmVzcG9uc2UudXJsfVxuICAgIHJldHVybiBkZWNvZGVyLmRlY29kZSh0ZXh0LCBvcHRpb25zKVxuICB9KVxufVxuXG5jbGFzcyBIVFRQVHJhbnNwb3J0IHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuc2NoZW1lcyA9IFsnaHR0cCcsICdodHRwcyddXG4gICAgdGhpcy5hdXRoID0gb3B0aW9ucy5hdXRoIHx8IG51bGxcbiAgICB0aGlzLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge31cbiAgICB0aGlzLmZldGNoID0gb3B0aW9ucy5mZXRjaCB8fCBmZXRjaFxuICAgIHRoaXMuRm9ybURhdGEgPSBvcHRpb25zLkZvcm1EYXRhIHx8IHdpbmRvdy5Gb3JtRGF0YVxuICAgIHRoaXMucmVxdWVzdENhbGxiYWNrID0gb3B0aW9ucy5yZXF1ZXN0Q2FsbGJhY2tcbiAgICB0aGlzLnJlc3BvbnNlQ2FsbGJhY2sgPSBvcHRpb25zLnJlc3BvbnNlQ2FsbGJhY2tcbiAgfVxuXG4gIGJ1aWxkUmVxdWVzdCAobGluaywgZGVjb2RlcnMsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3QgZmllbGRzID0gbGluay5maWVsZHNcbiAgICBjb25zdCBtZXRob2QgPSBsaW5rLm1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgbGV0IHF1ZXJ5UGFyYW1zID0ge31cbiAgICBsZXQgcGF0aFBhcmFtcyA9IHt9XG4gICAgbGV0IGZvcm1QYXJhbXMgPSB7fVxuICAgIGxldCBmaWVsZE5hbWVzID0gW11cbiAgICBsZXQgaGFzQm9keSA9IGZhbHNlXG5cbiAgICBmb3IgKGxldCBpZHggPSAwLCBsZW4gPSBmaWVsZHMubGVuZ3RoOyBpZHggPCBsZW47IGlkeCsrKSB7XG4gICAgICBjb25zdCBmaWVsZCA9IGZpZWxkc1tpZHhdXG5cbiAgICAgIC8vIEVuc3VyZSBhbnkgcmVxdWlyZWQgZmllbGRzIGFyZSBpbmNsdWRlZFxuICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoZmllbGQubmFtZSkpIHtcbiAgICAgICAgaWYgKGZpZWxkLnJlcXVpcmVkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5QYXJhbWV0ZXJFcnJvcihgTWlzc2luZyByZXF1aXJlZCBmaWVsZDogXCIke2ZpZWxkLm5hbWV9XCJgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmllbGROYW1lcy5wdXNoKGZpZWxkLm5hbWUpXG4gICAgICBpZiAoZmllbGQubG9jYXRpb24gPT09ICdxdWVyeScpIHtcbiAgICAgICAgcXVlcnlQYXJhbXNbZmllbGQubmFtZV0gPSBwYXJhbXNbZmllbGQubmFtZV1cbiAgICAgIH0gZWxzZSBpZiAoZmllbGQubG9jYXRpb24gPT09ICdwYXRoJykge1xuICAgICAgICBwYXRoUGFyYW1zW2ZpZWxkLm5hbWVdID0gcGFyYW1zW2ZpZWxkLm5hbWVdXG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLmxvY2F0aW9uID09PSAnZm9ybScpIHtcbiAgICAgICAgZm9ybVBhcmFtc1tmaWVsZC5uYW1lXSA9IHBhcmFtc1tmaWVsZC5uYW1lXVxuICAgICAgICBoYXNCb2R5ID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChmaWVsZC5sb2NhdGlvbiA9PT0gJ2JvZHknKSB7XG4gICAgICAgIGZvcm1QYXJhbXMgPSBwYXJhbXNbZmllbGQubmFtZV1cbiAgICAgICAgaGFzQm9keSA9IHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgYW55IHBhcmFtZXRlcnMgdGhhdCBkaWQgbm90IGhhdmUgYSBtYXRjaGluZyBmaWVsZFxuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHBhcmFtcykge1xuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgIWZpZWxkTmFtZXMuaW5jbHVkZXMocHJvcGVydHkpKSB7XG4gICAgICAgIHRocm93IG5ldyBlcnJvcnMuUGFyYW1ldGVyRXJyb3IoYFVua25vd24gcGFyYW1ldGVyOiBcIiR7cHJvcGVydHl9XCJgKVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZXF1ZXN0T3B0aW9ucyA9IHttZXRob2Q6IG1ldGhvZCwgaGVhZGVyczoge319XG5cbiAgICBPYmplY3QuYXNzaWduKHJlcXVlc3RPcHRpb25zLmhlYWRlcnMsIHRoaXMuaGVhZGVycylcblxuICAgIGlmIChoYXNCb2R5KSB7XG4gICAgICBpZiAobGluay5lbmNvZGluZyA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShmb3JtUGFyYW1zKVxuICAgICAgICByZXF1ZXN0T3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSBlbHNlIGlmIChsaW5rLmVuY29kaW5nID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpIHtcbiAgICAgICAgbGV0IGZvcm0gPSBuZXcgdGhpcy5Gb3JtRGF0YSgpXG5cbiAgICAgICAgZm9yIChsZXQgcGFyYW1LZXkgaW4gZm9ybVBhcmFtcykge1xuICAgICAgICAgIGZvcm0uYXBwZW5kKHBhcmFtS2V5LCBmb3JtUGFyYW1zW3BhcmFtS2V5XSlcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0T3B0aW9ucy5ib2R5ID0gZm9ybVxuICAgICAgfSBlbHNlIGlmIChsaW5rLmVuY29kaW5nID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykge1xuICAgICAgICBsZXQgZm9ybUJvZHkgPSBbXVxuICAgICAgICBmb3IgKGxldCBwYXJhbUtleSBpbiBmb3JtUGFyYW1zKSB7XG4gICAgICAgICAgY29uc3QgZW5jb2RlZEtleSA9IGVuY29kZVVSSUNvbXBvbmVudChwYXJhbUtleSlcbiAgICAgICAgICBjb25zdCBlbmNvZGVkVmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoZm9ybVBhcmFtc1twYXJhbUtleV0pXG4gICAgICAgICAgZm9ybUJvZHkucHVzaChlbmNvZGVkS2V5ICsgJz0nICsgZW5jb2RlZFZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGZvcm1Cb2R5ID0gZm9ybUJvZHkuam9pbignJicpXG5cbiAgICAgICAgcmVxdWVzdE9wdGlvbnMuYm9keSA9IGZvcm1Cb2R5XG4gICAgICAgIHJlcXVlc3RPcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRoKSB7XG4gICAgICByZXF1ZXN0T3B0aW9ucyA9IHRoaXMuYXV0aC5hdXRoZW50aWNhdGUocmVxdWVzdE9wdGlvbnMpXG4gICAgfVxuXG4gICAgbGV0IHBhcnNlZFVybCA9IHVybFRlbXBsYXRlLnBhcnNlKGxpbmsudXJsKVxuICAgIHBhcnNlZFVybCA9IHBhcnNlZFVybC5leHBhbmQocGF0aFBhcmFtcylcbiAgICBwYXJzZWRVcmwgPSBuZXcgVVJMKHBhcnNlZFVybClcbiAgICBwYXJzZWRVcmwuc2V0KCdxdWVyeScsIHF1ZXJ5UGFyYW1zKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogcGFyc2VkVXJsLnRvU3RyaW5nKCksXG4gICAgICBvcHRpb25zOiByZXF1ZXN0T3B0aW9uc1xuICAgIH1cbiAgfVxuXG4gIGFjdGlvbiAobGluaywgZGVjb2RlcnMsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3QgcmVzcG9uc2VDYWxsYmFjayA9IHRoaXMucmVzcG9uc2VDYWxsYmFja1xuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmJ1aWxkUmVxdWVzdChsaW5rLCBkZWNvZGVycywgcGFyYW1zKVxuXG4gICAgaWYgKHRoaXMucmVxdWVzdENhbGxiYWNrKSB7XG4gICAgICB0aGlzLnJlcXVlc3RDYWxsYmFjayhyZXF1ZXN0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZldGNoKHJlcXVlc3QudXJsLCByZXF1ZXN0Lm9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjA0KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlUmVzcG9uc2UocmVzcG9uc2UsIGRlY29kZXJzLCByZXNwb25zZUNhbGxiYWNrKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gcmVzcG9uc2Uuc3RhdHVzICsgJyAnICsgcmVzcG9uc2Uuc3RhdHVzVGV4dFxuICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBlcnJvcnMuRXJyb3JNZXNzYWdlKHRpdGxlLCBkYXRhKVxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEhUVFBUcmFuc3BvcnQ6IEhUVFBUcmFuc3BvcnRcbn1cbiIsImNvbnN0IGh0dHAgPSByZXF1aXJlKCcuL2h0dHAnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSFRUUFRyYW5zcG9ydDogaHR0cC5IVFRQVHJhbnNwb3J0XG59XG4iLCJjb25zdCBVUkwgPSByZXF1aXJlKCd1cmwtcGFyc2UnKVxuXG5jb25zdCBkZXRlcm1pbmVUcmFuc3BvcnQgPSBmdW5jdGlvbiAodHJhbnNwb3J0cywgdXJsKSB7XG4gIGNvbnN0IHBhcnNlZFVybCA9IG5ldyBVUkwodXJsKVxuICBjb25zdCBzY2hlbWUgPSBwYXJzZWRVcmwucHJvdG9jb2wucmVwbGFjZSgnOicsICcnKVxuXG4gIGZvciAobGV0IHRyYW5zcG9ydCBvZiB0cmFuc3BvcnRzKSB7XG4gICAgaWYgKHRyYW5zcG9ydC5zY2hlbWVzLmluY2x1ZGVzKHNjaGVtZSkpIHtcbiAgICAgIHJldHVybiB0cmFuc3BvcnRcbiAgICB9XG4gIH1cblxuICB0aHJvdyBFcnJvcihgVW5zdXBwb3J0ZWQgc2NoZW1lIGluIFVSTDogJHt1cmx9YClcbn1cblxuY29uc3QgbmVnb3RpYXRlRGVjb2RlciA9IGZ1bmN0aW9uIChkZWNvZGVycywgY29udGVudFR5cGUpIHtcbiAgaWYgKGNvbnRlbnRUeXBlID09PSB1bmRlZmluZWQgfHwgY29udGVudFR5cGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGVjb2RlcnNbMF1cbiAgfVxuXG4gIGNvbnN0IGZ1bGxUeXBlID0gY29udGVudFR5cGUudG9Mb3dlckNhc2UoKS5zcGxpdCgnOycpWzBdLnRyaW0oKVxuICBjb25zdCBtYWluVHlwZSA9IGZ1bGxUeXBlLnNwbGl0KCcvJylbMF0gKyAnLyonXG4gIGNvbnN0IHdpbGRjYXJkVHlwZSA9ICcqLyonXG4gIGNvbnN0IGFjY2VwdGFibGVUeXBlcyA9IFtmdWxsVHlwZSwgbWFpblR5cGUsIHdpbGRjYXJkVHlwZV1cblxuICBmb3IgKGxldCBkZWNvZGVyIG9mIGRlY29kZXJzKSB7XG4gICAgaWYgKGFjY2VwdGFibGVUeXBlcy5pbmNsdWRlcyhkZWNvZGVyLm1lZGlhVHlwZSkpIHtcbiAgICAgIHJldHVybiBkZWNvZGVyXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgRXJyb3IoYFVuc3VwcG9ydGVkIG1lZGlhIGluIENvbnRlbnQtVHlwZSBoZWFkZXI6ICR7Y29udGVudFR5cGV9YClcbn1cblxuY29uc3QgY3NyZlNhZmVNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIHRoZXNlIEhUVFAgbWV0aG9kcyBkbyBub3QgcmVxdWlyZSBDU1JGIHByb3RlY3Rpb25cbiAgcmV0dXJuICgvXihHRVR8SEVBRHxPUFRJT05TfFRSQUNFKSQvLnRlc3QobWV0aG9kKSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRldGVybWluZVRyYW5zcG9ydDogZGV0ZXJtaW5lVHJhbnNwb3J0LFxuICBuZWdvdGlhdGVEZWNvZGVyOiBuZWdvdGlhdGVEZWNvZGVyLFxuICBjc3JmU2FmZU1ldGhvZDogY3NyZlNhZmVNZXRob2Rcbn1cbiIsIi8vIHRoZSB3aGF0d2ctZmV0Y2ggcG9seWZpbGwgaW5zdGFsbHMgdGhlIGZldGNoKCkgZnVuY3Rpb25cbi8vIG9uIHRoZSBnbG9iYWwgb2JqZWN0ICh3aW5kb3cgb3Igc2VsZilcbi8vXG4vLyBSZXR1cm4gdGhhdCBhcyB0aGUgZXhwb3J0IGZvciB1c2UgaW4gV2VicGFjaywgQnJvd3NlcmlmeSBldGMuXG5yZXF1aXJlKCd3aGF0d2ctZmV0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gc2VsZi5mZXRjaC5iaW5kKHNlbGYpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBTaW1wbGUgcXVlcnkgc3RyaW5nIHBhcnNlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVGhlIHF1ZXJ5IHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIHBhcnNlZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeSkge1xuICB2YXIgcGFyc2VyID0gLyhbXj0/Jl0rKT0/KFteJl0qKS9nXG4gICAgLCByZXN1bHQgPSB7fVxuICAgICwgcGFydDtcblxuICAvL1xuICAvLyBMaXR0bGUgbmlmdHkgcGFyc2luZyBoYWNrLCBsZXZlcmFnZSB0aGUgZmFjdCB0aGF0IFJlZ0V4cC5leGVjIGluY3JlbWVudHNcbiAgLy8gdGhlIGxhc3RJbmRleCBwcm9wZXJ0eSBzbyB3ZSBjYW4gY29udGludWUgZXhlY3V0aW5nIHRoaXMgbG9vcCB1bnRpbCB3ZSd2ZVxuICAvLyBwYXJzZWQgYWxsIHJlc3VsdHMuXG4gIC8vXG4gIGZvciAo