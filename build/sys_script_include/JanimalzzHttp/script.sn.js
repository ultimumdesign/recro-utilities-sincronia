"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable camelcase  */

/**
 * JanimalzzHttp class exported in the x_1234_ecm_utiliti scope
 * @example const client = new x_1234_ecm_utiliti.JanimalzzHttp()
 * @class JanimalzzHttp
 */
var JanimalzzHttp = /*#__PURE__*/function () {
  /**
   * Class constructor for instance http options *optional to instantiate
   * @param {Object} [options={}] http request options
   * @param {String} options.baseURL eg. https://google.com *REQUIRED before final call
   * @param {String} options.method eg. GET, POST, PUT, DELETE *REQUIRED before final call
   * @param {String} options.path eg. /api/v1/items (if path param is required ':key' eg. /api/v1/:namespace/item)
   * @param {Object} options.pathParams an object map with the replace values for the corresponding defined path params
   * eg. with path /api/v1/:namespace/item a valid pathParams object = options.pathParams = { namespace: 'default' }
   * @param {Object} options.qs an object map with the key and values representing corresponding query string values
   * eg. a query string with '?id=2&name=john' = options.qs = { id: 2, name: 'john' }
   * @param {Object} options.headers an object map with the key and values for the corresponding request headers
   * eg. options.headers = { 'Content-Type': 'application/json' }. Note: If headers are populated when an instance of
   * the class is spawned and additional headers are passed to the method options override any duplicates will be overwritten and
   * new keys will be merged into the object
   * @param {Object} options.auth an optional object map used for basic auth with the key and values for
   * the username and password. eg. options.auth = { username: 'john', password: 'somefakepassword' }
   * @param {Boolean} options.parseJSON an optional switch to return JSON responses as parsed JS objects
   * (returns raw resp body by default)
   *
   */
  function JanimalzzHttp() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, JanimalzzHttp);

    this.options = options;
  }
  /**
   * Primary http method for class
   * @param {Object} [optionsOverride={}] an options object to merge/override for the request
   * @return {Object|String} = options.parseJSON && request.headers['Content-Type] === 'application/json' ? object : 'string'
   */


  _createClass(JanimalzzHttp, [{
    key: "httpRequest",
    value: function httpRequest() {
      var optionsOverride = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var mergedHeaders = this.options.headers ? optionsOverride.headers ? _objectSpread(_objectSpread({}, this.options.headers), optionsOverride.headers) : this.options.headers : optionsOverride.headers ? optionsOverride.headers : null;

      var options = _objectSpread(_objectSpread(_objectSpread({}, this.options), optionsOverride), {}, {
        headers: mergedHeaders
      });

      try {
        if (options.cookie) {
          options.headers = _objectSpread(_objectSpread({}, options.headers), {}, {
            Cookie: options.cookie
          });
        }

        var path = options.path && options.pathParams ? Object.keys(options.pathParams).reduce(function (acc, key) {
          return acc.replace(":".concat(key), options.pathParams[key]);
        }, options.path) : options.path ? options.path : '';
        var qs = options.qs ? Object.keys(options.qs).reduce(function (acc, key) {
          acc.push("".concat(key, "=").concat(options.qs[key]));
          return acc;
        }, []).join('&') : options.queryString ? gs.urlEncode(options.queryString) : '';
        var endpoint = "".concat(options.baseURL).concat(path).concat(qs ? '?' + qs : qs);
        /** request */

        var request = new sn_ws.RESTMessageV2();
        request.setHttpMethod(options.method);
        request.setEndpoint(endpoint);

        if (options.auth) {
          request.setBasicAuth(options.auth.username, options.auth.password);
        }

        if (options.headers) {
          Object.keys(options.headers).forEach(function (key) {
            request.setRequestHeader(key, options.headers[key]);
          });
        }

        if (options.body) {
          var body = _typeof(options.body) === 'object' ? JSON.stringify(options.body) : options.body;
          request.setRequestBody(body);
        }
        /** response */


        var response = request.execute();
        var httpResponseStatus = response.getStatusCode();
        var httpResponseBody = response.getBody();
        var httpResponseContentType = response.getHeader('Content-Type');
        var httpResponseHeaders = response.getHeaders();
        this.options.cookie = httpResponseHeaders['Set-Cookie'] ? httpResponseHeaders['Set-Cookie'].split(';')[0] : null;
        gs.debug('http response status_code: ' + httpResponseStatus);
        gs.debug('http response content-type: ' + httpResponseContentType);
        this.validateStatus(httpResponseStatus, httpResponseBody);

        if (httpResponseContentType === 'application/json' && options.parseJSON) {
          return JSON.parse(httpResponseBody);
        }

        return httpResponseBody;
      } catch (err) {
        gs.error(err);
      }
    }
    /**
     * this.httpRequest response validation function
     * overwrite this class method to provide your own validation function
     * @param {Integer} status http response status code
     * @param {String} body the response body
     */

  }, {
    key: "validateStatus",
    value: function validateStatus(status, body) {
      if (!(status >= 200 && status < 300)) {
        throw new Error("ERROR ".concat(status, ": ").concat(body));
      }
    }
  }]);

  return JanimalzzHttp;
}();