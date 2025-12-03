'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'


const API_URL = 'http://localhost:3000' 

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
      setLoading(true)
      try {
        
        const workId = book.key.replace('/works/', '')

        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        setDetails({
            title: book.title,
            description: { value: "Esta es una descripción detallada y profunda del libro. Explora los temas de la justicia social, el crecimiento personal y el impacto de las decisiones en la vida de la comunidad. Es una lectura esencial para comprender las complejidades del mundo moderno."},
            subjects: ["Ficción", "Drama", "Misterio", "Literatura Contemporánea", "Filosofía", "Sociedad"],
        })

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
    : 'https://placehold.co/200x300/1A202C/3182CE?text=BOOK'

  const getDescription = () => {
    if (!details?.description) return 'No hay descripción disponible.'
    if (typeof details.description === 'string') return details.description
    return details.description.value || 'No hay descripción disponible.'
  }

  const getBookPrice = () => {
    // Generar precio aleatorio entre $9.99 y $29.99
    return (Math.random() * (29.99 - 9.99) + 9.99).toFixed(2)
  }

  const handleAddToCart = () => {
    const cart = localStorage.getItem('cart')
    const cartItems = cart ? JSON.parse(cart) : []
    
    const existingItem = cartItems.find((item: any) => item.key === book.key)
    if (existingItem) {
      // Replaced alert with console message as per instructions
      console.log('Este libro ya está en tu carrito 📚')
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
      className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-gray-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700 transform transition-all duration-300 scale-95 md:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-500 transition-all z-10 text-xl font-bold"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
          
          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
              <p className="text-blue-300 mt-6 text-lg font-semibold">Cargando detalles del universo...</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-48 h-72 md:w-full md:aspect-[2/3] bg-gray-700 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/200x300/1A202C/3182CE?text=BOOK'
                    }}
                  />
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="text-4xl font-extrabold text-white mb-2 leading-tight">
                  {book.title}
                </h2>
                
                <p className="text-blue-400 text-lg font-semibold mb-6">
                  {book.author_name?.join(', ') || 'Autor desconocido'}
                </p>

                <div className="flex flex-wrap items-center justify-between mb-8 p-4 bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-2">
                        <span className="text-xl text-yellow-400">💰</span>
                        <p className="text-3xl font-bold text-yellow-400">
                            ${getBookPrice()} USD
                        </p>
                    </div>
                    {book.first_publish_year && (
                        <p className="text-gray-400 text-sm">
                            <span className="font-semibold">Año:</span>{' '}
                            {book.first_publish_year}
                        </p>
                    )}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all duration-300 uppercase tracking-wider ${
                    isAdding
                      ? 'bg-green-600 text-white shadow-lg shadow-green-700/50'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-700/50'
                  }`}
                >
                  {isAdding ? '✓ Agregado con Éxito' : '🚀 Agregar a la Colección'}
                </button>

                <div className="mb-8">
                  <h3 className="font-bold text-blue-300 mb-3 text-xl border-b border-gray-600 pb-1">
                    Sinopsis
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-base overflow-y-auto max-h-36">
                    {getDescription()}
                  </p>
                </div>

                {details?.subjects && details.subjects.length > 0 && (
                  <div>
                    <h3 className="font-bold text-blue-300 mb-3 text-xl border-b border-gray-600 pb-1">
                      Géneros
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.subjects.slice(0, 10).map((subject, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-blue-300 border border-blue-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-900 transition-colors"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}