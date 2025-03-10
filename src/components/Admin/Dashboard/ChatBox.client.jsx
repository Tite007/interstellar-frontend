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

const customStyles = `
  .chat-link { color: #1e90ff; text-decoration: underline; font-weight: 500; }
  .chat-link:hover { color: #ff4500; text-decoration: underline; }
  .cs-message__content { line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
`

export default function ChatBox() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const messageListRef = useRef(null)

  useEffect(() => {
    if (messageListRef.current && isOpen) {
      messageListRef.current.scrollToBottom()
    }
  }, [messages, loading, isOpen])

  const formatBusinessResponse = (data) => {
    if (!data) return 'No data available.'

    // Handle BCG Matrix response
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

    // Handle Top Products by City response
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

    // Fallback for generic responses
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
        'http://localhost:3001/ai/ask-business-intel',
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
    <div className="fixed bottom-4 right-4 z-50">
      <style>{customStyles}</style>
      <Button
        endContent={<MessagesSquare size={20} strokeWidth={1.5} />}
        onPress={() => setIsOpen(!isOpen)}
        className="bg-redBranding text-white px-4 py-2 rounded-full shadow-md hover:bg-softRed flex items-center gap-2"
      >
        {isOpen ? 'Close Chat' : 'Business Insights'}
      </Button>
      {isOpen && (
        <div className="w-[500px] bg-white rounded-lg shadow-lg mt-2 relative">
          <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessagesSquare size={20} strokeWidth={1.5} />
              <h2 className="text-xl font-semibold">Business Insights</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <MainContainer style={{ height: '600px' }}>
            <ChatContainer>
              <MessageList
                ref={messageListRef}
                typingIndicator={
                  loading ? <TypingIndicator content="Analyzing..." /> : null
                }
                scrollBehavior="smooth"
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
          {error && <p className="text-red-500 text-sm p-2">{error}</p>}
        </div>
      )}
    </div>
  )
}
