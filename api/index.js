<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Nghe tiếng Nhật liên tục → Dịch sang tiếng Việt</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    button { padding: 10px 20px; font-size: 1.2em; cursor: pointer; }
    #result, #translated { margin-top: 20px; font-size: 1.2em; }
  </style>
</head>
<body>
  <h1>Nghe tiếng Nhật liên tục → Dịch</h1>
  <button id="toggleBtn">Bắt đầu nghe</button>
  <div id="result">Nhận dạng (tiếng Nhật) sẽ hiển thị ở đây.</div>
  <div id="translated">Dịch (tiếng Việt) sẽ hiển thị ở đây.</div>

  <script>
    const toggleBtn = document.getElementById('toggleBtn');
    const resultDiv = document.getElementById('result');
    const translatedDiv = document.getElementById('translated');

    const BACKEND_URL = 'https://your-backend-domain.vercel.app/api/gemini';  // Thay bằng URL backend của bạn

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech API.');
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let listening = false;

      recognition.onstart = () => {
        toggleBtn.textContent = 'Đang nghe… Bấm để dừng';
      };
      recognition.onend = () => {
        if (listening) {
          recognition.start();
        } else {
          toggleBtn.textContent = 'Bắt đầu nghe';
        }
      };
      recognition.onerror = (event) => {
        console.error('Lỗi nhận dạng:', event.error);
        resultDiv.textContent = 'Lỗi: ' + event.error;
      };
      recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        resultDiv.textContent = 'Nhận dạng: ' + transcript;

        try {
          const resp = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: transcript })
          });
          const json = await resp.json();
          if (json.error) {
            translatedDiv.textContent = 'Lỗi dịch: ' + json.error;
          } else {
            translatedDiv.textContent = 'Dịch: ' + json.result;
          }
        } catch (err) {
          console.error('Lỗi gọi backend:', err);
          translatedDiv.textContent = 'Lỗi kết nối backend';
        }
      };

      toggleBtn.onclick = () => {
        if (!listening) {
          recognition.start();
          listening = true;
          toggleBtn.textContent = 'Đang nghe… Bấm để dừng';
        } else {
          recognition.stop();
          listening = false;
          toggleBtn.textContent = 'Bắt đầu nghe';
        }
      };
    }
  </script>
</body>
</html>
