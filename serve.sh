#!/bin/bash
cd /Users/florah/Desktop/pte
exec /usr/bin/python3 -c "
import http.server, socketserver, os
os.chdir('/Users/florah/Desktop/pte')
handler = http.server.SimpleHTTPRequestHandler
class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True
httpd = ReusableTCPServer(('', 3000), handler)
print('Serving on port 3000')
httpd.serve_forever()
"
