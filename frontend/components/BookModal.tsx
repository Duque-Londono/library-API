'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Book {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

interface BookDetails {
  title: string
  description?: string | { value: string }
  subjects?: string[]
  covers?: number[]
}

interface BookModalProps {
  book: Book
  onClose: () => void
  onAddToCart: () => void
}

export default function BookModal({ book, onClose, onAddToCart }: BookModalProps) {
  const [details, setDetails] = useState<BookDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const workId = book.key.replace('/works/', '')
        const response = await axios.get(`${API_URL}/api/books/${workId}`)
        setDetails(response.data)
      } catch (error) {
        console.error('Error al cargar detalles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [book])

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null

  const getDescription = () => {
    if (!details?.description) return 'No hay descripción disponible.'
    if (typeof details.description === 'string') return details.description
    return details.description.value || 'No hay descripción disponible.'
  }

  const getBookPrice = () => {
    return (Math.random() * (29.99 - 9.99) + 9.99).toFixed(2)
  }

  const handleAddToCart = () => {
    const cart = localStorage.getItem('cart')
    const cartItems = cart ? JSON.parse(cart) : []
    
    const existingItem = cartItems.find((item: any) => item.key === book.key)
    if (existingItem) {
      alert('Este libro ya está en tu carrito 📚')
      return
    }
    
    const newItem = {
      ...book,
      price: parseFloat(getBookPrice())
    }
    
    cartItems.push(newItem)
    localStorage.setItem('cart', JSON.stringify(cartItems))
    
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
      onAddToCart()
      onClose()
    }, 1000)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando detalles...</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all z-10"
              >
                ✕
              </button>
              
              <div className="flex flex-col md:flex-row gap-6 p-8">
                <div className="md:w-1/3">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="w-full rounded-lg shadow-xl"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-8xl">📖</span>
                    </div>
                  )}
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    {book.title}
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <p className="text-gray-600">
                      <span className="font-semibold">Autor:</span>{' '}
                      {book.author_name?.join(', ') || 'Desconocido'}
                    </p>
                    {book.first_publish_year && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Año de publicación:</span>{' '}
                        {book.first_publish_year}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-purple-600">
                      ${getBookPrice()} USD
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full py-3 rounded-xl font-semibold mb-6 transition-all ${
                      isAdding
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                    }`}
                  >
                    {isAdding ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
                  </button>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                      Descripción
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {getDescription()}
                    </p>
                  </div>

                  {details?.subjects && details.subjects.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                        Géneros
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {details.subjects.slice(0, 8).map((subject, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}