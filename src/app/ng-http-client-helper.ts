import { HttpClient, HttpParams } from '@angular/common/http';
// @ts-ignore
import { fromPromise } from 'devextreme/core/utils/deferred';

export function sendRequestFactory(httpClient: HttpClient) {
  const URLENCODED = 'application/x-www-form-urlencoded';
  const CONTENT_TYPE = 'Content-Type';

  let nonce = Date.now();

  function assignResponseProps(xhrSurrogate: any, response: any) {
    function getResponseHeader(name: string) {
      return response.headers.get(name);
    }

    function makeResponseText() {
      const body = 'error' in response ? response.error : response.body;

      if (typeof body !== 'string' || String(getResponseHeader(CONTENT_TYPE)).indexOf('application/json') === 0) {
          return JSON.stringify(body);
      }

      return body;
    }

    Object.assign(xhrSurrogate, {
      status: response.status,
      statusText: response.statusText,
      getResponseHeader,
      responseText: makeResponseText()
    });

    return xhrSurrogate;
  }

  function getAcceptHeader(options: any) {
    const dataType: string = options.dataType;

    const acceptHeader = options?.accepts?.[dataType] || {
      'json': 'application/json, text/javascript',
      'text': 'text/plain',
      'xml': 'application/xml, text/xml',
      'html': 'text/html',
      'script': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
    }[dataType];

    return acceptHeader ? acceptHeader + ',*/*;q=0.01' : '*/*';
}

    return (options: any) => {
        const method = (options.method || 'get').toLowerCase();
        const isGet = method === 'get';
        const headers = { ...options.headers };
        const data = options.data;
        const upload = options.upload;
        const beforeSend = options.beforeSend;
        const xhrFields = options.xhrFields;
        let promiseResolve: (...values: unknown[]) => void;
        let promiseReject: (...values: unknown[]) => void;
        const promise = new Promise((resolve, reject) => {
            promiseResolve = resolve;
            promiseReject = reject;
        });

        if (options.cache === false && isGet && data) {
            data._ = nonce++;
        }

        if (!headers.Accept) {
            headers.Accept = getAcceptHeader(options);
        }

        if (!upload && !isGet && !headers[CONTENT_TYPE]) {
            headers[CONTENT_TYPE] = options.contentType || URLENCODED + ';charset=utf-8';
        }

        let params;
        let body;

        if (isGet) {
            params = data;
        } else {
            if (!upload && typeof data === 'object' && headers[CONTENT_TYPE].indexOf(URLENCODED) === 0) {
                body = new HttpParams();
                // tslint:disable-next-line:forin
                for (const key in data) {
                    body = body.set(key, data[key]);
                }
                body = body.toString();
            } else {
                body = data;
            }
        }

        const xhrSurrogate = { };

        if (beforeSend) {
            beforeSend(xhrSurrogate);
        }

        httpClient
            .request(
                method,
                options.url,
                {
                    params,
                    body,
                    responseType: options.dataType,
                    headers,
                    withCredentials: xhrFields && xhrFields.withCredentials,
                    observe: 'response'
                }
            )
            .subscribe(
                (response) => promiseResolve(response.body, 'success', assignResponseProps(xhrSurrogate, response)),
                (response) => promiseReject(assignResponseProps(xhrSurrogate, response))
            );


        return fromPromise(promise);
    };
}
