'use client'

import { useState, useRef } from 'react'
import { Copy, RefreshCw, Wand2, AlertCircle } from 'lucide-react'

export default function Home() {
  const [text, setText] = useState('')
  const [paraphrasedText, setParaphrasedText] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showParaphraseButton, setShowParaphraseButton] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selected = text.substring(start, end)
      
      if (selected.trim().length > 0) {
        setSelectedText(selected)
        setShowParaphraseButton(true)
        
        // Calculate button position relative to selection
        const rect = textareaRef.current.getBoundingClientRect()
        setButtonPosition({
          x: rect.left + (start + end) / 2 * 8, // Approximate character width
          y: rect.top - 50
        })
      } else {
        setShowParaphraseButton(false)
      }
    }
  }

  const paraphraseText = async (textToParaphrase: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToParaphrase }),
      })

      if (!response.ok) {
        throw new Error('Failed to paraphrase text')
      }

      const data = await response.json()
      
      if (selectedText) {
        // Replace selected text with paraphrased version
        const newText = text.replace(selectedText, data.paraphrasedText)
        setText(newText)
        setSelectedText('')
        setShowParaphraseButton(false)
      } else {
        setParaphrasedText(data.paraphrasedText)
      }
    } catch (err) {
      setError('Failed to paraphrase text. Please try again.')
      console.error('Paraphrase error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const paraphraseFullText = () => {
    if (text.trim()) {
      paraphraseText(text)
    }
  }

  const paraphraseSelection = () => {
    if (selectedText.trim()) {
      paraphraseText(selectedText)
    }
  }

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const replaceOriginalText = () => {
    setText(paraphrasedText)
    setParaphrasedText('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
              <Wand2 className="h-8 w-8 text-purple-600" />
              AI Paraphrase Tool
            </h1>
            <p className="text-gray-600 text-lg">
              Powered by Google Gemini 2.0 Flash - Select text to paraphrase or transform entire content
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Original Text
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    id="input-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onSelect={handleTextSelect}
                    onMouseUp={handleTextSelect}
                    onKeyUp={handleTextSelect}
                    placeholder="Type or paste your text here... Select any portion to paraphrase it instantly!"
                    className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 leading-relaxed"
                  />
                  
                  {/* Floating Paraphrase Button */}
                  {showParaphraseButton && (
                    <button
                      onClick={paraphraseSelection}
                      disabled={isLoading}
                      className="fixed z-10 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg shadow-lg transition-all duration-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                      style={{
                        left: buttonPosition.x,
                        top: buttonPosition.y,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      Paraphrase
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={paraphraseFullText}
                  disabled={!text.trim() || isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Paraphrasing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      Paraphrase All
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => copyToClipboard(text)}
                  disabled={!text.trim()}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  title="Copy original text"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 mb-2">
                Paraphrased Text
              </label>
              <div className="relative">
                <textarea
                  id="output-text"
                  value={paraphrasedText}
                  readOnly
                  placeholder="Paraphrased text will appear here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none text-gray-700 leading-relaxed"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-3 text-purple-600">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="font-medium">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={replaceOriginalText}
                  disabled={!paraphrasedText.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Replace Original
                </button>
                
                <button
                  onClick={() => copyToClipboard(paraphrasedText)}
                  disabled={!paraphrasedText.trim()}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  title="Copy paraphrased text"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <Wand2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Smart Selection</h3>
              <p className="text-gray-600 text-sm">Select any text portion to paraphrase it instantly without affecting the rest</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <RefreshCw className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Full Text Mode</h3>
              <p className="text-gray-600 text-sm">Transform entire documents while maintaining meaning and context</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <Copy className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Easy Copy</h3>
              <p className="text-gray-600 text-sm">One-click copy functionality for both original and paraphrased content</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Powered by Google Gemini 2.0 Flash API • Built for Vercel deployment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
