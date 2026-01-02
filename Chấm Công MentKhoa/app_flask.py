from flask import Flask, send_from_directory, render_template_string
import os

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    # Đảm bảo trả về index.html
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    # Cho phép truy cập các file tĩnh (js, css, ...)
    return send_from_directory('.', filename)

if __name__ == '__main__':
    # Chạy trên tất cả các IP, port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
