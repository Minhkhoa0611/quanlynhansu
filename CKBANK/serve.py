# Sửa lại để chạy Flask bình thường nếu livereload không hoạt động, và thêm chỉ dẫn lỗi livereload.

from flask import Flask, send_from_directory
try:
    from livereload import Server
    HAS_LIVERELOAD = True
except ImportError:
    HAS_LIVERELOAD = False
import socket

app = Flask(__name__, static_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'bank-qr.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

def get_ip():
    try:
        # Lấy IP LAN của máy
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

if __name__ == '__main__':
    # Để chạy trên WiFi (các thiết bị cùng mạng truy cập được), phải dùng host='0.0.0.0'
    # Truy cập: http://<ip_wifi_cua_may_ban>:8000/ từ thiết bị khác cùng mạng WiFi
    ip = get_ip()
    print(f"\nTruy cập trên máy này: http://localhost:8000/")
    print(f"Truy cập từ thiết bị khác cùng WiFi: http://{ip}:8000/\n")
    if HAS_LIVERELOAD:
        server = Server(app.wsgi_app)
        server.watch('bank-qr.html')
        server.watch('*.css')
        server.watch('*.js')
        server.serve(host='0.0.0.0', port=8000, debug=True)
    else:
        print("Lưu ý: livereload chưa được cài đặt, chỉ chạy Flask server bình thường.")
        app.run(host='0.0.0.0', port=8000, debug=True)
