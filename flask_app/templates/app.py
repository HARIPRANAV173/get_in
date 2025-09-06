from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import qrcode
import io
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)

attendance_records = []  # In-memory storage
active_qr = {}

# ✅ Endpoint: Live Attendance
@app.route("http://127.0.0.1:5000/api/attendance/live", methods=["GET"])
def get_live_attendance():
    return jsonify(attendance_records)

# ✅ Endpoint: Generate QR Code
@app.route("http://127.0.0.1:5000/api/generate_qr", methods=["POST"])
def generate_qr():
    global active_qr
    data = request.json

    subject = data["subject"]
    class_id = data["code"]
    expiry = data["expiry"]

    active_qr = {
        "subject": subject,
        "code": class_id,
        "expiry": expiry
    }

    # Create QR payload
    qr_payload = {
        "subject": subject,
        "classId": class_id,
        "timestamp": int(time.time() * 1000)  # ms since epoch
    }

    # Generate QR Code
    img = qrcode.make(str(qr_payload))

    # Save QR to memory buffer
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")

# ✅ Endpoint: Mark Attendance
@app.route("http://127.0.0.1:5000/api/mark_attendance", methods=["POST"])
def mark_attendance():
    data = request.json
    record = {
        "studentId": data["studentId"],
        "name": data["name"],
        "subject": data["subject"],
        "classId": data["classId"],
        "status": data["status"],
        "time": datetime.now().strftime("%H:%M:%S"),
    }
    attendance_records.append(record)
    print("Attendance Received:", record)
    return jsonify({"status": "success", "record": record})

if __name__ == "__main__":
    app.run(debug=True)