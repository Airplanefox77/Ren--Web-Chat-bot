const chatForm = document.getElementById('chat-form');
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender;
  msg.textContent = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;
  addMessage('user', input);

  userInput.value = '';
  addMessage('ren', '...');

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input })
  });
  const data = await res.json();

  // Remove "..." and add Ren's actual reply
  chatLog.lastChild.remove();
  addMessage('ren', data.reply);
});