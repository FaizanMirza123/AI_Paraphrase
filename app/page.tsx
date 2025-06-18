'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Copy, RefreshCw, Wand2, AlertCircle, FileText } from 'lucide-react'

export default function Home() {
  const [text, setText] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextSelect = useCallback(() => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selected = text.substring(start, end)
      setSelectedText(selected.trim())
    }
  }, [text])

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selected = text.substring(start, end)
      
      if (selected.trim().length > 0) {
        setSelectedText(selected.trim())
        setContextMenuPosition({ x: e.clientX, y: e.clientY })
        setShowContextMenu(true)
      }
    }
  }, [text])

  const hideContextMenu = useCallback(() => {
    setShowContextMenu(false)
  }, [])

  const paraphraseText = async (textToParaphrase: string) => {
    setIsLoading(true)
    setError('')
    setShowContextMenu(false)
    
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
      
      if (selectedText && textareaRef.current) {
        // Replace selected text with paraphrased version
        const start = textareaRef.current.selectionStart
        const end = textareaRef.current.selectionEnd
        const newText = text.substring(0, start) + data.paraphrasedText + text.substring(end)
        setText(newText)
        setSelectedText('')
      }
    } catch (err) {
      setError('Failed to paraphrase text. Please try again.')
      console.error('Paraphrase error:', err)
    } finally {
      setIsLoading(false)
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

  // Hide context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      hideContextMenu()
    }

    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showContextMenu, hideContextMenu])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
              <Wand2 className="h-8 w-8 text-purple-600" />
              AI Paraphrase Tool
            </h1>
            <p className="text-gray-600 text-lg">
              Powered by Google Gemini 2.0 Flash - Select text and right-click to paraphrase
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {/* Main Text Area */}
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="main-text" className="block text-sm font-medium text-gray-700 mb-2">
                Your Text
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="main-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onSelect={handleTextSelect}
                  onMouseUp={handleTextSelect}
                  onKeyUp={handleTextSelect}
                  onContextMenu={handleRightClick}
                  placeholder="Type or paste your text here... Select any portion and right-click to paraphrase it!"
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 leading-relaxed text-base"
                />
                
                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-3 text-purple-600">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="font-medium">AI is paraphrasing...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(text)}
                disabled={!text.trim()}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                title="Copy all text"
              >
                <Copy className="h-5 w-5" />
                Copy All
              </button>
              
              <button
                onClick={() => setText('')}
                disabled={!text.trim()}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                title="Clear all text"
              >
                <FileText className="h-5 w-5" />
                Clear
              </button>
            </div>
          </div>

          {/* Context Menu */}
          {showContextMenu && (
            <div
              className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px]"
              style={{
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
              }}
            >
              <button
                onClick={paraphraseSelection}
                disabled={!selectedText || isLoading}
                className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="h-4 w-4 text-purple-600" />
                Paraphrase
              </button>
              <button
                onClick={() => copyToClipboard(selectedText)}
                disabled={!selectedText}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="h-4 w-4 text-gray-600" />
                Copy
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              How to Use
            </h3>
            <ol className="space-y-2 text-gray-600">
              <li className="flex gap-2">
                <span className="font-medium text-purple-600">1.</span>
                Type or paste your text in the field above
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-purple-600">2.</span>
                Select the text you want to paraphrase
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-purple-600">3.</span>
                Right-click on the selected text
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-purple-600">4.</span>
                Choose "Paraphrase" from the context menu
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-purple-600">5.</span>
                The selected text will be replaced with the paraphrased version
              </li>            </ol>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Powered by Google Gemini 2.0 Flash API • Built for Vercel deployment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
