import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Send, Bot, User } from 'lucide-react';

interface AIAssistantProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m here to help you with the attendance system. You can ask me about:\n\n• How to mark attendance\n• Understanding attendance reports\n• QR code scanning\n• Notification settings\n• System features\n\nWhat would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const commonQuestions = [
    'How do I scan QR codes?',
    'Why can\'t I use saved QR images?',
    'How is attendance calculated?',
    'How do I mark students absent?',
    'What does OD mean?',
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('qr') || lowerMessage.includes('scan')) {
      return 'QR codes can only be scanned using the app\'s built-in camera for security reasons. Here\'s how:\n\n1. Go to the "Scan QR" section\n2. Click "Start Camera Scan"\n3. Point your camera at the QR code\n4. Wait for automatic detection\n\nNote: Screenshots or saved images won\'t work to prevent attendance fraud.';
    }
    
    if (lowerMessage.includes('attendance') && lowerMessage.includes('calculate')) {
      return 'Attendance is calculated as:\n\n(Present + Late classes) ÷ Total classes × 100\n\nThe system considers:\n• Present: Full attendance\n• Late: Counted as present\n• Absent: Not counted\n• OD (Official Duty): Doesn\'t affect percentage\n• Medical: Doesn\'t affect percentage';
    }
    
    if (lowerMessage.includes('mark') && lowerMessage.includes('absent')) {
      return 'To mark students absent (Teachers only):\n\n1. Go to "Overview" → "Mark Attendance"\n2. Select the subject\n3. Click "Absent" for each student\n4. Or use "Mark All Absent" for quick selection\n5. Click "Save Attendance"\n\nYou can also mark: Present, Late, OD (Official Duty), or Medical leave.';
    }
    
    if (lowerMessage.includes('od')) {
      return 'OD stands for "Official Duty" - this is used when students are absent for college-authorized activities like:\n\n• Sports competitions\n• Cultural events\n• Academic competitions\n• Field trips\n• Seminars\n\nOD attendance doesn\'t negatively impact the student\'s attendance percentage.';
    }
    
    if (lowerMessage.includes('notification')) {
      return 'Notifications are sent for:\n\n• Student absences (to parents)\n• Low attendance warnings\n• QR code generation (to students)\n• Missed periods alerts\n\nYou can manage notification settings in the Settings panel under "Notification Preferences".';
    }
    
    return 'I understand you\'re asking about the attendance system. Here are some things I can help with:\n\n• QR code scanning and generation\n• Attendance marking and calculation\n• Understanding different attendance types\n• Notification system\n• System navigation\n\nCould you please be more specific about what you\'d like to know?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Settings
          </button>
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-5 w-5 text-blue-600" />
                ) : (
                  <Bot className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Bot className="h-5 w-5 text-green-600" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {commonQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about the attendance system..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Help Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <MessageCircle className="h-6 w-6 text-blue-600 mt-1" />
          <div className="ml-4">
            <h4 className="text-lg font-medium text-blue-900">Tips for using AI Assistant</h4>
            <ul className="text-blue-700 mt-2 space-y-1 text-sm">
              <li>• Ask specific questions about features you don't understand</li>
              <li>• Use simple, clear language for best results</li>
              <li>• The AI can help with troubleshooting common issues</li>
              <li>• For technical problems, contact support directly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;