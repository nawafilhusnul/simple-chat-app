const socket = io()

const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
let sendButton = document.getElementById('send-button')

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  sendMessage()
})

messageForm.addEventListener('change', e => {
  onTypingFeedback(nameInput.value)
})

socket.on('clients-total', data => {
  clientsTotal.innerText = `Total Client : ${data}`
})

function sendMessage() {
  if (messageInput.value === '') return
  const timeNow = new Date()
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: timeNow.toLocaleString(),
  }

  socket.emit('message', data)
  addMessageToUI(true, data)
  messageInput.value = ''
}

socket.on('chat-message', (data) => {
  removeIsTypingFeedback()
  addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
  console.log(data)
  const element = `
  <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
    <p class="message">
      ${data.message}
      <span>${data.name} 👁️ ${data.dateTime}
    </p>
  </li>
  `
  messageContainer.innerHTML += element
  scrollToBottom()
}

function addOnTypingToUI(data) {
  console.log(data)
  const element = `
  <li class="message-feedback">
    <p class="feedback" id="feedback">
      ${data}
    </p>
  </li>
  `
  messageContainer.innerHTML += element
  scrollToBottom()
}

function onTypingFeedback(name) {
  socket.emit('is-typing', `${name} is typing a message ...`)
}

function removeIsTypingFeedback() {
  messageContainer.removeChild(messageContainer.lastElementChild)
}

socket.on('is-typing', (data) => {
  addOnTypingToUI(data)
})

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}