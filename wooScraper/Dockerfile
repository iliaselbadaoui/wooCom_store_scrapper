FROM debian:bullseye

RUN apt-get update -y
RUN apt-get install python3.10 python3-pip -y
RUN apt-get update -y
RUN apt-get install -y fonts-liberation libasound2 libu2f-udev xdg-utils
RUN apt-get update -y
RUN pip install gunicorn gevent gevent-websocket python-socketio pandas requests PySocks bs4

ADD src /wooScrap
EXPOSE 21337


ENTRYPOINT ["/bin/bash", "/wooScrap/run.sh"]