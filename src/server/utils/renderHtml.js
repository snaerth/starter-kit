import serialize from 'serialize-javascript';

export default (html, preloadedState) => {
    return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>express-mongodb-react-redux-universal-starter</title>
                <meta name="description" content="just another react + webpack boilerplate">
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Arapey|Montserrat:700" rel="stylesheet">
                <link href="/styles.css" rel="stylesheet" type="text/css">
                <script src="/vendor.js" defer></script>
                <script src="/app.js" defer></script>
                <script>document.documentElement.className = 'js';</script>
            </head>
        <body class="loading">
            <div id="app">${html}</div>
            <script>window.__PRELOADED_STATE__ = ${preloadedState ? serialize(preloadedState): preloadedState}</script>
            <script>
            (function() {
                document.addEventListener("DOMContentLoaded", function() {
                var minTime = 1000;
                var now = new Date();
                var next = new Date();
                var timeDiff = next.getTime() - now.getTime();

                if (timeDiff < minTime) {
                    var delay = minTime - timeDiff;

                    setTimeout(function() {
                    document.body.classList.remove('loading');
                    }, delay);
                } else {
                    document.body.classList.remove('loading');
                }
                });
            })();
            </script>
        </body>
    </html>`;
};