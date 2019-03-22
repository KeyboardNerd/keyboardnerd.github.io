docker run -t -p 127.0.0.1:8443:8443 -v "${PWD}:/root/project" quay.io/keyboardnerd/dev:code-server-latest code-server --allow-http --no-auth
