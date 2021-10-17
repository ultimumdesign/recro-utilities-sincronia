/* eslint-disable camelcase  */
import { gs, sn_ws } from '@nuvolo/servicenow-types'

/**
 * JanimalzzHttp class exported in the x_1234_ecm_utiliti scope
 * @example const client = new x_1234_ecm_utiliti.JanimalzzHttp()
 * @class JanimalzzHttp
 */
class JanimalzzHttp {
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
  constructor (options = {}) {
    this.options = options
  }

  /**
   * Primary http method for class
   * @param {Object} [optionsOverride={}] an options object to merge/override for the request
   * @return {Object|String} = options.parseJSON && request.headers['Content-Type] === 'application/json' ? object : 'string'
   */
  httpRequest (optionsOverride = {}) {
    const mergedHeaders = this.options.headers
      ? optionsOverride.headers
        ? { ...this.options.headers, ...optionsOverride.headers }
        : this.options.headers
      : optionsOverride.headers ? optionsOverride.headers : null
    const options = {
      ...this.options,
      ...optionsOverride,
      headers: mergedHeaders
    }
    try {
      if (options.cookie) {
        options.headers = {
          ...options.headers,
          Cookie: options.cookie
        }
      }
      const path = options.path && options.pathParams
        ? Object.keys(options.pathParams).reduce((acc, key) => {
          return acc.replace(`:${key}`, options.pathParams[key])
        }, options.path)
        : options.path ? options.path : ''
      const qs = options.qs
        ? Object.keys(options.qs).reduce((acc, key) => {
          acc.push(`${key}=${options.qs[key]}`)
          return acc
        }, []).join('&')
        : options.queryString
          ? gs.urlEncode(options.queryString)
          : ''
      const endpoint = `${options.baseURL}${path}${qs ? '?' + qs : qs}`

      /** request */
      const request = new sn_ws.RESTMessageV2()
      request.setHttpMethod(options.method)
      request.setEndpoint(endpoint)
      if (options.auth) {
        request.setBasicAuth(options.auth.username, options.auth.password)
      }
      if (options.headers) {
        Object.keys(options.headers).forEach(key => {
          request.setRequestHeader(key, options.headers[key])
        })
      }
      if (options.body) {
        const body = typeof options.body === 'object'
          ? JSON.stringify(options.body)
          : options.body
        request.setRequestBody(body)
      }

      /** response */
      const response = request.execute()
      const httpResponseStatus = response.getStatusCode()
      const httpResponseBody = response.getBody()
      const httpResponseContentType = response.getHeader('Content-Type')
      const httpResponseHeaders = response.getHeaders()

      this.options.cookie = httpResponseHeaders['Set-Cookie']
        ? httpResponseHeaders['Set-Cookie'].split(';')[0]
        : null

      gs.debug('http response status_code: ' + httpResponseStatus)
      gs.debug('http response content-type: ' + httpResponseContentType)

      this.validateStatus(httpResponseStatus, httpResponseBody)
      if (httpResponseContentType === 'application/json' && options.parseJSON) {
        return JSON.parse(httpResponseBody)
      }
      return httpResponseBody
    } catch (err) {
      gs.error(err)
    }
  }

  /**
   * this.httpRequest response validation function
   * overwrite this class method to provide your own validation function
   * @param {Integer} status http response status code
   * @param {String} body the response body
   */
  validateStatus (status, body) {
    if (!(status >= 200 && status < 300)) {
      throw new Error(`ERROR ${status}: ${body}`)
    }
  }
}

export default JanimalzzHttp
