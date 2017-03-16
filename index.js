/**
 *  @license
 *    Copyright 2016 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';

module.exports = function(sansServer) {

    // if this middleware is reached then resolve the request without a response
    sansServer.use(function(req, res, next) {
        req.resolve();
    });

    return function (req, res, next) {

        // generate a request object
        const request = {
            body: req.body,
            headers: req.headers,
            method: req.method,
            path: req.url.split('?')[0],
            query: req.query
        };

        // process the request
        sansServer(request)
            .then(response => {
                if (!response) return next();
    
                if (response.error) console.error(response.error.stack);
        
                // translate response cookies into Express response cookies
                Object.keys(response.cookies).forEach(function(key) {
                    const cookie = response.cookies[key];
                    res.cookie(key, cookie.value, cookie.options);
                });

                // put response headers into express response headers
                Object.keys(response.headers).forEach(function(key) {
                    res.set(key, response.headers[key]);
                });
        
                // set Express status code
                res.status(response.statusCode);
        
                // use Express to send the response
                res.send(response.body);
            })
    };
};