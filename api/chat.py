from http.server import BaseHTTPRequestHandler
import json
import os
import google.generativeai as genai
from .prompts import SYSTEM_PROMPT

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode('utf-8'))
            animal_name = data.get('animal_name', '').strip()
            breed_type = data.get('breed_type', '').strip()
            details = data.get('details', '').strip()

            if not animal_name:
                self.send_error_response(400, '동물의 이름을 입력해 주세요.')
                return

            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key:
                raise ValueError("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.")

            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(
                model_name='gemini-2.5-flash',
                system_instruction=SYSTEM_PROMPT
            )

            user_content = f"이름: {animal_name}\n품종/나이: {breed_type}\n특징 및 사연: {details}"
            response = model.generate_content(user_content)

            # UTF-8 바이트 변환 및 Content-Length 명시
            response_payload = json.dumps({'reply': response.text}, ensure_ascii=False).encode('utf-8')

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(response_payload)))
            self.end_headers()
            self.wfile.write(response_payload)

        except Exception as e:
            self.send_error_response(500, str(e))

    def send_error_response(self, status_code, message):
        error_payload = json.dumps({'error': message}, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(error_payload)))
        self.end_headers()
        self.wfile.write(error_payload)