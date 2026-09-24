import { useState, useEffect } from "react";
import Peer from "peerjs";

export default function App() {
  const [myPeerId, changeMyPeerId] = useState("Connection to Peer server...");
  const [anotherPeerId, changeAnotherPeerId] = useState("")
  const [myPeer, changeMyPeer] = useState(null)
  const [myMessage, changeMyMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const peer = new Peer(undefined, {
      secure: true
    })
    changeMyPeer(peer)
    peer.on("open", (id) => {
      changeMyPeerId(id)
    })
    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        setMessages((prev) => [...prev, { from: "them", text: data }])
      })
    })
  }, [])

  function sendMessage() {
    const conn = myPeer.connect(anotherPeerId)
    conn.on("open", () => {
      conn.send(myMessage)
      setMessages((prev) => [...prev, { from: "me", text: myMessage }])
    })
  }

  return (

    <div className="name-of-project">
      P2P project v.0.1

      <div className="my-peer-id">
        <p>{myPeerId}</p>
        <div className="input-another-id">
          <input type="text" placeholder="Enter another ID"
            value={anotherPeerId} onChange={(e) => changeAnotherPeerId(e.target.value)} />
        </div>
        <div className="input-message">
          <input type="text" placeholder="Enter message" value={myMessage} onChange={(e) => changeMyMessage(e.target.value)} />
        </div>
        <button onClick={sendMessage}>Send message</button>
      </div>

      <div className="chat-field">
        <h3>Chat:</h3>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.from === "me" ? "You" : "Peer"}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>

  )
}
