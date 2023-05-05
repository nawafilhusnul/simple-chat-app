const socket = io()
const usersSocket = io('/users')
const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const data = {
  _id: "6454ccfdce7766c9ca78c91a",
  user_id: "6454ccfd4bb05d6abcebcffc",
  driver_id: "6454ccfd06b5ff32e08b78e1",
  role: "user"
}

if (data.role === "user") {
  usersSocket.emit('init', data)
}

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

  usersSocket.emit('message', data)
  addMessageToUI(true, data)
  messageInput.value = ''
}

usersSocket.on('chat-message', (data) => {
  removeIsTypingFeedback()
  addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
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
  usersSocket.emit('is-typing', `${name} is typing a message ...`)
}

function removeIsTypingFeedback() {
  messageContainer.removeChild(messageContainer.lastElementChild)
}

usersSocket.on('is-typing', (data) => {
  addOnTypingToUI(data)
})

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}