'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import './custom.scss'
import { Button } from '@heroui/button'
import { MessagesSquare, X } from 'lucide-react'

export default function CustomerChatBox({
  userId,
  orderNumber,
  productId,
  userName = 'Customer',
}) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0) // Track scroll position
  const messageListRef = useRef(null)
  const sendTimeoutRef = useRef(null)

  // Load messages from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem(`chatMessages_${userId}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      const welcomeMessage = {
        message: `Hello ${userName}! I'm here to help with your orders or products. What can I assist you with today?`,
        sentTime: new Date().toLocaleTimeString(),
        sender: 'Support Bot',
        direction: 'incoming',
        position: 'single',
      }
      setMessages([welcomeMessage])
    }
  }, [userId, userName])

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`chatMessages_${userId}`, JSON.stringify(messages))
    }
  }, [messages, userId])

  // Handle scroll position when closing the chat
  const handleCloseChat = () => {
    if (messageListRef.current) {
      setScrollPosition(messageListRef.current.scrollTop) // Save scroll position
    }
    setIsOpen(false)
  }

  // Restore scroll position or scroll to bottom when messages change, loading changes, or chat opens
  useEffect(() => {
    if (messageListRef.current && isOpen) {
      const scrollContainer = messageListRef.current
      requestAnimationFrame(() => {
        // If there are new messages or loading state changes, scroll to bottom
        if (messages.length > 0 || loading) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        } else {
          // Otherwise, restore the previous scroll position
          scrollContainer.scrollTop = scrollPosition
        }
      })
    }
  }, [messages, loading, isOpen, scrollPosition])

  // Debounce message sending to prevent rapid API calls
  const debounceSendMessage = (text) => {
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current)
    }
    sendTimeoutRef.current = setTimeout(() => handleSendMessage(text), 500)
  }

  const handleSendMessage = async (text) => {
    if (!text.trim() || text.length > 500) {
      setError('Message must be between 1 and 500 characters.')
      return
    }

    const userMessage = {
      message: text,
      sentTime: new Date().toLocaleTimeString(),
      sender: 'Customer',
      direction: 'outgoing',
      position: 'single',
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const lastCustomerMessage = messages
        .slice()
        .reverse()
        .find((msg) => msg.sender === 'Customer')
      const previousQuestion = lastCustomerMessage
        ? lastCustomerMessage.message
        : null

      const payload = {
        question: text,
        previous_question: previousQuestion,
      }
      if (userId) payload.userId = userId
      if (productId) payload.productId = productId

      const orderKeywords = /tracking|order|package|shipment|\b\d{3,}\b/i
      if (orderKeywords.test(text)) {
        if (orderNumber) payload.orderNumber = orderNumber
        const orderMatch = text.match(/\b\d{3,}\b/)
        if (orderMatch) payload.orderNumber = orderMatch[0]
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        throw new Error('Request timed out. Please try again.')
      }, 10000)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/ask`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        },
      )
      clearTimeout(timeoutId)

      const responseData = response.data.data
      const botMessage = {
        message: responseData.answer || 'No response from AI',
        sentTime: new Date().toLocaleTimeString(),
        sender: 'Support Bot',
        direction: 'incoming',
        position: 'single',
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error('Error:', err)
      const errorMessage = {
        message: `Error: ${err.message || 'Something went wrong. Please try again or rephrase your question.'}`,
        sentTime: new Date().toLocaleTimeString(),
        sender: 'Support Bot',
        direction: 'incoming',
        position: 'single',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const suggestedQuestions = [
    'Where is my order?',
    'Do you have this product in stock?',
    'What is your return policy?',
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        endContent={<MessagesSquare size={20} strokeWidth={1.5} />}
        onPress={() => setIsOpen(!isOpen)}
        className="bg-redBranding text-white px-4 py-2 rounded-full shadow-md hover:bg-softRed flex items-center gap-2"
        aria-label={isOpen ? 'Close chat window' : 'Open customer support chat'}
      >
        {isOpen ? 'Close Chat' : 'Customer Support'}
      </Button>
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <MessagesSquare size={20} strokeWidth={1.5} />
              <h2 className="text-xl font-semibold">Customer Support</h2>
            </div>
            <button
              onClick={handleCloseChat}
              onTouchEnd={handleCloseChat} // Ensure touch support
              aria-label="Close chat window"
              className="focus:outline-none"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <MainContainer className="cs-main-container">
            <ChatContainer className="cs-chat-container">
              <MessageList
                ref={messageListRef}
                typingIndicator={
                  loading ? (
                    <TypingIndicator content="Support Bot is processing..." />
                  ) : null
                }
                className="cs-message-list"
              >
                {messages.map((msg, index) => (
                  <Message
                    key={index}
                    model={{
                      ...msg,
                      type: 'html',
                      payload: msg.message,
                    }}
                  />
                ))}
              </MessageList>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    onPress={() => handleSendMessage(question)}
                    className="text-sm bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1"
                    disabled={loading}
                    aria-label={`Ask: ${question}`}
                  >
                    {question}
                  </Button>
                ))}
              </div>
              <MessageInput
                placeholder="Ask about tracking, stock, etc. (e.g., 'Where is my order?')"
                value={input}
                onChange={(val) => setInput(val)}
                onSend={debounceSendMessage}
                disabled={loading}
                sendDisabled={loading || !input.trim()}
                attachButton={false}
                autoFocus
                aria-label="Type your message here"
                className="cs-message-input"
              />
            </ChatContainer>
          </MainContainer>
          {error && <p className="text-red-500 text-sm p-2">{error}</p>}
        </div>
      )}
    </div>
  )
}
