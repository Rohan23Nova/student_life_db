import React, { useState, useEffect } from 'react';
import { messagingAPI } from '../services/api';
import '../styles/Messages.css';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messagingAPI.getConversations();
      setConversations(response.data.conversations);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setLoading(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const response = await messagingAPI.getMessages(user.user_id);
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await messagingAPI.sendMessage(selectedUser.user_id, newMessage);
      setNewMessage('');
      handleSelectUser(selectedUser);
    } catch (err) {
      alert('Failed to send message');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="messages-container">
      <h1>Messages</h1>
      
      <div className="messages-grid">
        <div className="conversations-list">
          <h3>Conversations</h3>
          {conversations.map(conv => (
            <div 
              key={conv.user_id} 
              className="conversation-item"
              onClick={() => handleSelectUser(conv)}
            >
              <p><strong>{conv.first_name} {conv.last_name}</strong></p>
              <p className="college">{conv.college}</p>
              {conv.unread_count > 0 && (
                <span className="unread">{conv.unread_count}</span>
              )}
            </div>
          ))}
        </div>

        <div className="chat-box">
          {selectedUser ? (
            <>
              <h3>{selectedUser.first_name} {selectedUser.last_name}</h3>
              <div className="messages-list">
                {messages.map(msg => (
                  <div key={msg.id} className="message">
                    <p>{msg.content}</p>
                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <p>Select a conversation</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;