import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { MessageCircle, Send, Plus, User, Search } from 'lucide-react';

interface Chat {
  id: number;
  title: string;
  created_at: string;
  last_message?: string;
  last_message_time?: string;
}

interface Message {
  id: string;
  content: string;
  chat_id: string;
  sender_name?: string;
  sender_id?: string;
  created_at: string;
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const response = await api.get('/chats/chats/');
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const response = await api.get(`/messages/messages?chat_id=${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/chats/chats/', {
        title: newChatName,
        is_group: false,
      });
      setNewChatName('');
      setIsDialogOpen(false);
      fetchChats();
      setSelectedChatId(response.data.id);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId) return;

    try {
      await api.post('/messages/messages', {
        chat_id: selectedChatId?.toString(),
        sender_id: user?.id?.toString(),
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedChatId);
      fetchChats(); // Refresh to update last message
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredChats = chats.filter(chat =>
    chat?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Chats</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
              <Plus size={20} className="mr-2" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
              <DialogDescription>
                Start a new conversation with fellow alumni.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateChat} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="chat_name" className="text-sm font-medium">
                  Chat Name
                </label>
                <Input
                  id="chat_name"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="Enter chat name"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
                Create Chat
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>Conversations</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              {filteredChats.length > 0 ? (
                <div className="space-y-1">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b ${
                        selectedChatId === chat.id ? 'bg-[#ADD8E6] bg-opacity-30' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#90EE90] rounded-full flex items-center justify-center">
                          <MessageCircle className="text-black" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-black truncate">{chat.title}</h4>
                            {chat.last_message_time && (
                              <span className="text-xs text-gray-500">
                                {formatTime(chat.last_message_time)}
                              </span>
                            )}
                          </div>
                          {chat.last_message && (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {chat.last_message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No chats found</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader>
                <CardTitle>{selectedChat.title}</CardTitle>
                <CardDescription>
                  Chat created on {new Date(selectedChat.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[450px]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.length > 0 ? (
                        <>
                          {messages.map((message) => {
                            const isOwnMessage = message.sender_id === user?.id;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                  <div
                                    className={`p-3 rounded-lg ${
                                      isOwnMessage
                                        ? 'bg-[#90EE90] text-black'
                                        : 'bg-gray-100 text-black'
                                    }`}
                                  >
                                    {!isOwnMessage && (
                                      <div className="flex items-center space-x-2 mb-1">
                                        <User size={14} />
                                        <span className="text-xs font-medium">
                                          {message.sender_name || 'Unknown User'}
                                        </span>
                                      </div>
                                    )}
                                    <p className="text-sm">{message.content}</p>
                                    <div className={`text-xs mt-1 ${
                                      isOwnMessage ? 'text-gray-700' : 'text-gray-500'
                                    }`}>
                                      {formatTime(message.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
                          <p className="text-gray-600">No messages yet. Start the conversation!</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black"
                      >
                        <Send size={16} />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a chat to start messaging</h3>
                <p className="text-gray-500">
                  Choose a conversation from the sidebar or create a new one.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#90EE90] text-black">
          <CardHeader>
            <CardTitle>Active Chats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{chats.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#ADD8E6] text-black">
          <CardHeader>
            <CardTitle>Messages Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {messages.filter(msg => 
                new Date(msg.created_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardHeader>
            <CardTitle>Chat Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Be respectful and professional</li>
              <li>• Keep conversations relevant</li>
              <li>• No spam or promotional content</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chats;