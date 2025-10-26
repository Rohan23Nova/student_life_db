import React, { useState, useEffect } from 'react';
import { messagingAPI } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';
import '../styles/Messages.css';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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

    setSending(true);
    try {
      await messagingAPI.sendMessage(selectedUser.user_id, newMessage);
      setNewMessage('');
      handleSelectUser(selectedUser);
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="messages-loading">
        <Spinner size="lg" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-layout">
        {/* Conversations Sidebar */}
        <Card className="conversations-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Messages</h2>
            <Button variant="primary" size="sm">+ New</Button>
          </div>
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="empty-conversations">
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.user_id}
                  className={`conversation-item ${selectedUser?.user_id === conv.user_id ? 'active' : ''}`}
                  onClick={() => handleSelectUser(conv)}
                >
                  <div className="conversation-avatar">
                    {getInitials(conv.first_name, conv.last_name)}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <h4 className="conversation-name">
                        {conv.first_name} {conv.last_name}
                      </h4>
                      {conv.unread_count > 0 && (
                        <span className="unread-badge">{conv.unread_count}</span>
                      )}
                    </div>
                    <p className="conversation-college">{conv.college}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Chat Box */}
        <Card className="chat-box">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {getInitials(selectedUser.first_name, selectedUser.last_name)}
                  </div>
                  <div>
                    <h3 className="chat-user-name">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h3>
                    <p className="chat-user-college">{selectedUser.college}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">⋮</Button>
              </div>

              {/* Messages List */}
              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="empty-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="message-bubble">
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">
                        {new Date(msg.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="message-input-form">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-input"
                />
                <Button type="submit" variant="primary" isLoading={sending}>
                  {sending ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-icon">💬</div>
              <h3>Select a Conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Messages;