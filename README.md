# sans-server-express

Express middleware that will send requests through a sans-server instance.

```js
const express = require('express');
const SansServer = require('sans-server');
const ssMiddleware = require('sans-server-express');

const app = express();
const sansServer = SansServer();

// sans-server will process the request and respond accordingly
app.use(ssMiddleware(sansServer));

// middleware that follows will be reached if sans-server did not fulfill the request
app.use(function(req, res, next) {
    res.send('Sans Server did not provide a response');
});

app.listen(3000);
```