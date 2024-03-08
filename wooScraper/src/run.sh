cd /wooScrap
echo it\'s working

gunicorn -b 0.0.0.0:21337 -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 endpoint:app
