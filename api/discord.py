import os
import json
import requests
from http.server import BaseHTTPRequestHandler
from dotenv import load_dotenv

load_dotenv()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            body = json.loads(post_data.decode('utf-8'))
            animal_name = body.get('animalName', '댕냥이')
            content = body.get('content', '')
            
            webhook_url = os.environ.get('DISCORD_WEBHOOK_URL')
            if not webhook_url:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "DISCORD_WEBHOOK_URL이 설정되지 않았습니다."}).encode('utf-8'))
                return

            # 디스코드 임베드(포토카드 스타일) 페이로드
            discord_payload = {
                "username": "발자국 다꾸 연구소 🐾",
                "avatar_url": "https://raw.githubusercontent.com/love4xox/Pawprint-Lab/main/assets/icons/favicon.svg",
                "embeds": [
                    {
                        "title": f"🎀 [{animal_name}] 뽀짝 다이어리 페이지 발행!",
                        "description": content[:2000],  # 디스코드 임베드 최대 글자수 안전 처리
                        "color": 16737655,  # 따뜻한 다꾸 핑크 (#FF4D87)
                        "footer": {
                            "text": "Pawprint Diary ✨ 평생 가족을 만나는 따뜻한 기록"
                        }
                    }
                ]
            }

            res = requests.post(webhook_url, json=discord_payload)
            
            if res.status_code in [200, 204]:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "성공적으로 전송되었습니다."}).encode('utf-8'))
            else:
                self.send_response(res.status_code)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"디스코드 오류 ({res.status_code})"}).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))