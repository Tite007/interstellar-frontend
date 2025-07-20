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
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { Button } from '@heroui/button'
import { MessagesSquare, X } from 'lucide-react'

import './custom.scss'

export default function ChatBox() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const messageListRef = useRef(null)

  // Scroll to bottom using direct DOM manipulation
  useEffect(() => {
    if (messageListRef.current && isOpen) {
      const scrollContainer = messageListRef.current
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
        console.log('Scrolled to bottom, height:', scrollContainer.scrollHeight)
      })
    }
  }, [messages, loading, isOpen])

  const formatBusinessResponse = (data) => {
    if (!data) return 'No data available.'
    if (data.bcg_analysis && data.strategic_advice) {
      let message = '<h3>BCG Matrix Analysis</h3><ul>'
      data.bcg_analysis.forEach((item) => {
        message += `<li><strong>${item.bcg_category}</strong>: ${item.name}</li>`
      })
      message += '</ul>'
      message += '<h4>Strategic Advice</h4>'
      message += `<p>${data.strategic_advice.replace(/\n/g, '<br>')}</p>`
      return message
    }
    if (data.top_products && data.top_products_by_city && data.insights) {
      let message = '<h3>Top Sold Products</h3><ul>'
      data.top_products.forEach((item) => {
        message += `<li>${item.productName}: ${item.totalSold} sold, $${item.totalRevenue.toFixed(2)} revenue</li>`
      })
      message += '</ul><h3>Top Products by City</h3><ul>'
      data.top_products_by_city.forEach((item) => {
        message += `<li>${item.city} - ${item.productName}: ${item.totalSold} sold, $${item.totalRevenue.toFixed(2)} revenue</li>`
      })
      message += '</ul><h4>Insights & Recommendations</h4>'
      message += `<p>${data.insights.replace(/\n/g, '<br>')}</p>`
      return message
    }
    return data.answer || JSON.stringify(data, null, 2).replace(/\n/g, '<br>')
  }

  const handleSendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = {
      message: text,
      sentTime: new Date().toLocaleTimeString(),
      sender: 'Admin',
      direction: 'outgoing',
      position: 'single',
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/ask-business-intel`,
        { question: text },
        { headers: { 'Content-Type': 'application/json' } },
      )
      const responseData = response.data.data || response.data

      const botMessage = {
        message: formatBusinessResponse(responseData),
        sentTime: new Date().toLocaleTimeString(),
        sender: 'Business Intel',
        direction: 'incoming',
        position: 'single',
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error('Error:', err)
      const errorMessage = {
        message: `Error: ${err.response?.data?.error || 'Something went wrong.'}`,
        sentTime: new Date().toLocaleTimeString(),
        sender: 'Business Intel',
        direction: 'incoming',
        position: 'single',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4  z-50">
      <Button
        endContent={<MessagesSquare size={20} strokeWidth={1.5} />}
        onPress={() => setIsOpen(!isOpen)}
        className="bg-redBranding text-white px-4 py-2 rounded-full shadow-md hover:bg-softRed flex items-center gap-2"
      >
        {isOpen ? 'Close Chat' : 'Business Insights'}
      </Button>

      {isOpen && (
        <>
          <div className="chat-backdrop" onClick={() => setIsOpen(false)} />
          <div className={`chat-container ${isOpen ? 'open' : ''}`}>
            <div className="chat-header">
              <div className="flex items-center gap-2">
                <MessagesSquare size={20} strokeWidth={1.5} />
                <h2>Business Insights</h2>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <MainContainer>
              <ChatContainer>
                <MessageList
                  ref={messageListRef}
                  typingIndicator={
                    loading ? <TypingIndicator content="Analyzing..." /> : null
                  }
                  scrollBehavior="auto" // Changed to "auto" for instant scrolling
                >
                  {messages.length === 0 && (
                    <Message
                      model={{
                        message: 'Ask me about sales, products, or trends!',
                        sender: 'Business Intel',
                        direction: 'incoming',
                        position: 'single',
                        type: 'html',
                      }}
                    />
                  )}
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
                <MessageInput
                  placeholder="Ask about top products, sales, etc."
                  value={input}
                  onChange={(val) => setInput(val)}
                  onSend={handleSendMessage}
                  disabled={loading}
                  sendDisabled={loading || !input.trim()}
                  attachButton={false}
                  autoFocus
                />
              </ChatContainer>
            </MainContainer>
            {error && (
              <div className="error-alert">
                <span>{error}</span>
                <button onClick={() => setError(null)}>✕</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
