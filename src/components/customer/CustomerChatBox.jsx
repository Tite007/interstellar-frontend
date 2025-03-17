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

  // Scroll to bottom when messages change, loading changes, or chat opens
  useEffect(() => {
    if (messageListRef.current && isOpen) {
      const scrollContainer = messageListRef.current
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      })
    }
  }, [messages, loading, isOpen])

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
          timeout: 60000, // 1 minute
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

  const clearChat = () => {
    sessionStorage.removeItem(`chatMessages_${userId}`)
    const welcomeMessage = {
      message: `Hello ${userName}! I'm here to help with your orders or products. What can I assist you with today?`,
      sentTime: new Date().toLocaleTimeString(),
      sender: 'Support Bot',
      direction: 'incoming',
      position: 'single',
    }
    setMessages([welcomeMessage])
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="chat-backdrop" onClick={() => setIsOpen(false)} />
      )}
      <Button
        endContent={<MessagesSquare size={20} strokeWidth={1.5} />}
        onPress={() => setIsOpen(!isOpen)}
        className="bg-redBranding text-white px-4 py-2 rounded-full shadow-md hover:bg-softRed flex items-center gap-2"
        aria-label={isOpen ? 'Close chat window' : 'Open customer support chat'}
      >
        {isOpen ? 'Close Chat' : 'Customer Support'}
      </Button>
      {isOpen && (
        <div className={`chat-container ${isOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <MessagesSquare size={20} strokeWidth={1.5} />
              <h2 className="text-xl font-semibold">Customer Support</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} aria-label="Clear chat history">
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat window"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
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
              <div className="suggested-questions">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="suggested-button"
                    disabled={loading}
                    aria-label={`Ask: ${question}`}
                  >
                    {question}
                  </button>
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
          {error && (
            <div className="error-alert">
              <p>{error}</p>
              <button onClick={() => setError(null)} aria-label="Dismiss error">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
