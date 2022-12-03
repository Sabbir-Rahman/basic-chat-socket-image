import React, { useState, useRef, useEffect } from 'react';
import immer from 'immer'
import Chat from './components/Chat';
import Form from './components/UsernameForm';
import './App.css'

const initialMessageState = {
  general: [],
  random: [],
  jokes: [],
  javascript: []
}

function App() {
  const [username, setUsername] = useState("")
  const [connected, setConnected] = useState(false)
  const [currentChat, setCurrentChat] = useState({ isChannel: true, chatName: 'general', receiverId: ''})
  const [connectedRooms, setConnectedRooms] = useState(['general'])
  const [allUsers, setAllUsers] =useState([])
  const [messages, setMessages] = useState(initialMessageState)
  const [message, setMessage] = useRef()
  const socketRef = useRef()

  let body

  function handleMessageChange (e) {
    setMessage(e.target.value)
  }

  function handleChange () {

  }

  function sendMessage () {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel
    }
    socketRef.current.emit('send message', payload)
    const newMessage = immer(messages, draft => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message
      })
    })
    setMessages(newMessage)
  }

  function roomJoinCallback(incommingMessages,room) {
    const newMessages = immer(messages, draft => {
      draft[room] = incommingMessages
    })
    setMessages(newMessages)
  }

  function joinRoom (room) {
    const newConnectedRooms = immer(connectedRooms, draft=> {
      draft.push(room)
    })

    // here callback returns the messages
    socketRef.current.emit("join room", room, (messages) => roomJoinCallback(messages,room))
    setConnectedRooms(newConnectedRooms)
  }

  function toggleChat (currentChat) {
    if(!messages[currentChat.chatName]) {
      const newMessages = immer(message, draft => {
        draft[currentChat.chatName] = []
      })
      setMessages(newMessages)
    }
    setCurrentChat(currentChat)
  }

  function connect () {

  }

  if (connected) {
    body = (
      <Chat 
        message={message}
        handleMessageChange = {handleMessageChange}
        sendMessage = {sendMessage}
        yourId = { socketRef.current? socketRef.current.id : ""}
        allUsers = {allUsers}
        joinRoom = {joinRoom}
        connectedRooms = {connectedRooms}
        currentChat = {currentChat}
        toggleChat = {toggleChat}
        messages = {messages[currentChat.chatName]}
      />
    )
  } else {
    body = (
      <Form username={username} onChange={handleChange} connect={connect} />
    )
  }

  return (
    <div className="App">
      {body}
    </div>
  );
}

export default App;
