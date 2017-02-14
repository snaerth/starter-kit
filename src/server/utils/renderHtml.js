import serialize from 'serialize-javascript';

export default (html, preloadedState, assets) => {
    return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Starter kit</title>
                <meta name="description" content="just another react + webpack boilerplate">
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Arapey|Montserrat:700" rel="stylesheet">
                <link href="${assets ? assets.main.css : '/styles.css'}" rel="stylesheet" type="text/css">
                <script>document.documentElement.className = 'js';</script>
            </head>
        <body class="loading">
            <div id="app">${process.env.NODE_ENV === 'production' ? html : `<div>${html}</div>`}</div>
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
            <script defer src="${ assets ? assets.vendor.js : '/vendor.js' }"></script>
            <script defer src="${ assets ? assets.main.js : '/main.js' }" ></script>
        </body>
    </html>`;
};