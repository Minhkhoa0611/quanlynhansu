from flask import Flask, send_from_directory
from livereload import Server

app = Flask(__name__, static_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'bank-qr.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    # Tự động reload khi file HTML thay đổi
    server = Server(app.wsgi_app)
    server.watch('bank-qr.html')
    server.watch('*.css')
    server.watch('*.js')
    server.serve(host='0.0.0.0', port=8000, debug=True)
