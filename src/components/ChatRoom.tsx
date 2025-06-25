
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isOnline: boolean;
}

interface User {
  username: string;
  isOnline: boolean;
  lastSeen: Date;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "TraderJoe",
      message: "Good morning everyone! EUR/USD looking bullish today 📈",
      timestamp: new Date(Date.now() - 300000),
      isOnline: true
    },
    {
      id: "2",
      username: "ForexMaster",
      message: "I'm seeing strong resistance at 1.0850 level",
      timestamp: new Date(Date.now() - 240000),
      isOnline: true
    },
    {
      id: "3",
      username: "CryptoKing",
      message: "Bitcoin breaking above 45K! 🚀",
      timestamp: new Date(Date.now() - 180000),
      isOnline: false
    },
    {
      id: "4",
      username: "MarketAnalyst",
      message: "Fed meeting today - expecting volatility in USD pairs",
      timestamp: new Date(Date.now() - 120000),
      isOnline: true
    }
  ]);

  const [onlineUsers] = useState<User[]>([
    { username: "TraderJoe", isOnline: true, lastSeen: new Date() },
    { username: "ForexMaster", isOnline: true, lastSeen: new Date() },
    { username: "CryptoKing", isOnline: false, lastSeen: new Date(Date.now() - 600000) },
    { username: "MarketAnalyst", isOnline: true, lastSeen: new Date() },
    { username: "PipHunter", isOnline: true, lastSeen: new Date() },
    { username: "GoldBull", isOnline: false, lastSeen: new Date(Date.now() - 1800000) }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [currentUser] = useState("You");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: currentUser,
        message: newMessage,
        timestamp: new Date(),
        isOnline: true
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onlineCount = onlineUsers.filter(user => user.isOnline).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-500" />
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            {onlineCount} online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chat Messages */}
        <Card className="lg:col-span-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Live Discussion</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 px-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col gap-1",
                      message.username === currentUser ? "items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">{message.username}</span>
                      {message.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      <span>{formatTime(message.timestamp)}</span>
                    </div>
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-3 py-2 rounded-lg",
                        message.username === currentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      )}
                    >
                      {message.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Users */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Online Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div
                    key={user.username}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          user.isOnline ? "bg-green-500" : "bg-gray-400"
                        )}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </span>
                    </div>
                    {!user.isOnline && (
                      <span className="text-xs text-gray-500">
                        {formatTime(user.lastSeen)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Guidelines */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Chat Guidelines</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Keep discussions related to trading and markets</li>
            <li>• Be respectful to all community members</li>
            <li>• No spam or promotional content</li>
            <li>• Share insights and learn from others</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatRoom;
