'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const useRouter = () => ({
  push: (path: string) => {
    window.location.href = path;
  },
})

const API_URL = 'https://openlibrary.org'

interface Book {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

interface BookCardProps {
  book: Book
  onClick: () => void
  onAddToCart: () => void
}

function BookCard({ book, onClick, onAddToCart }: BookCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://placehold.co/128x192/1A202C/3182CE?text=BOOK'

  const getBookPrice = () => {
    return (Math.random() * (29.99 - 9.99) + 9.99).toFixed(2)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const cart = localStorage.getItem('cart')
    const cartItems = cart ? JSON.parse(cart) : []
    
    const existingItem = cartItems.find((item: any) => item.key === book.key)
    if (existingItem) {
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
    setTimeout(() => setIsAdding(false), 1000)
    
    onAddToCart()
  }

  return (
    <div className="bg-gray-800 text-gray-200 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:shadow-blue-900/50 transform hover:scale-[1.02]">
      <div
        onClick={onClick}
        className="cursor-pointer p-4 flex flex-col items-stretch h-full"
      >
        <div className="flex justify-center mb-4">
          <div className="w-32 h-48 bg-gray-700 rounded-lg shadow-lg overflow-hidden flex items-center justify-center flex-shrink-0">
            {book.cover_i ? (
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/128x192/1A202C/3182CE?text=BOOK'
                }}
              />
            ) : (
              <div className="text-4xl text-gray-400">📖</div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-extrabold text-white text-lg mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-blue-400 text-sm font-medium mb-1 line-clamp-1">
            {book.author_name?.[0] || 'Autor desconocido'}
          </p>
          {book.first_publish_year && (
            <p className="text-gray-500 text-xs mb-3">
              Publicado: {book.first_publish_year}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 font-bold text-xl">
              ${getBookPrice()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
            isAdding
              ? 'bg-green-600 text-white shadow-md shadow-green-900/50'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/50'
          }`}
        >
          {isAdding ? '✓ Agregado' : '🛒 Añadir a Carrito'}
        </button>
      </div>
    </div>
  )
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

function BookModal({ book, onClose, onAddToCart }: BookModalProps) {
  const [details, setDetails] = useState<BookDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      try {
        const workId = book.key.replace('/works/', '')
        const response = await axios.get(`https://openlibrary.org/works/${workId}.json`)
        
        // Mapear la respuesta de la API a la interfaz BookDetails
        setDetails({
            title: response.data.title,
            description: response.data.description,
            subjects: response.data.subjects,
            covers: response.data.covers,
        })

      } catch (error) {
        console.error('Error al cargar detalles:', error)
         // Usar datos mock en caso de error (para que la vista no se rompa)
        setDetails({
            title: book.title,
            description: { value: "No se pudieron cargar los detalles completos. Esta es una descripción de ejemplo: Explora los temas de la justicia social, el crecimiento personal y el impacto de las decisiones." },
            subjects: ["Ficción", "Drama", "Misterio", "Literatura"],
        })
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
    return (Math.random() * (29.99 - 9.99) + 9.99).toFixed(2)
  }

  const handleAddToCart = () => {
    const cart = localStorage.getItem('cart')
    const cartItems = cart ? JSON.parse(cart) : []
    
    const existingItem = cartItems.find((item: any) => item.key === book.key)
    if (existingItem) {
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

              <div className="md:w-2/3 overflow-y-auto max-h-[70vh]">
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
                  <p className="text-gray-300 leading-relaxed text-base">
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

interface CartItem {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  price: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

function Cart({ isOpen, onClose }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (isOpen) {
        loadCart()
    }
  }, [isOpen])

  const loadCart = () => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      setCartItems(JSON.parse(cart))
    } else {
      setCartItems([])
    }
  }

  const removeFromCart = (key: string) => {
    const updatedCart = cartItems.filter(item => item.key !== key)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    
    console.log(`¡Compra realizada! Total: $${getTotalPrice()} USD. Gracias por tu compra 📚`)
    clearCart()
    onClose()
  }

  const drawerClasses = `
    fixed inset-y-0 right-0 w-full md:w-96 h-full flex flex-col shadow-2xl transition-transform duration-500 ease-in-out
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
  `

  if (!isOpen && cartItems.length === 0) return null

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${isOpen ? 'bg-black bg-opacity-60 backdrop-blur-sm' : 'pointer-events-none bg-transparent'}`}
      onClick={onClose}
    >
      <div
        className={drawerClasses}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-900 text-gray-200 h-full flex flex-col border-l border-blue-700/50">
          
          <div className="p-6 border-b border-gray-700 flex justify-between items-center shadow-lg bg-gray-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl text-blue-400">🛒</span>
              <h2 className="text-2xl font-extrabold text-white">
                Tu Carrito ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-700 text-gray-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all text-xl font-bold"
              aria-label="Cerrar carrito"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-7xl mb-4 block">🌌</span>
                <p className="text-blue-400 text-xl font-semibold">Tu carrito está vacío</p>
                <p className="text-gray-500 text-sm mt-2">
                  Agrega libros para empezar tu aventura de lectura
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.key}
                    className="bg-gray-800 rounded-xl p-4 flex gap-4 border border-gray-700 hover:border-blue-500 transition-all shadow-md"
                  >
                    <div className="w-16 h-20 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                      {item.cover_i ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${item.cover_i}-S.jpg`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/64x80/1A202C/3182CE?text=BOOK'
                          }}
                        />
                      ) : (
                        <span className="text-2xl text-gray-400">📖</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-blue-300 text-xs mb-2 line-clamp-1">
                        {item.author_name?.[0] || 'Autor desconocido'}
                      </p>
                      <p className="text-yellow-400 font-extrabold text-lg">
                        ${item.price.toFixed(2)} USD
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-red-500 hover:text-white bg-gray-700 p-2 rounded-full w-8 h-8 flex items-center justify-center transition-colors self-start"
                      aria-label={`Eliminar ${item.title}`}
                    >
                      <span className="text-sm">🗑️</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-700 space-y-4 bg-gray-900/90 backdrop-blur-sm">
              <div className="flex justify-between items-center text-xl">
                <span className="font-extrabold text-white uppercase tracking-wider">Total:</span>
                <span className="text-3xl font-extrabold text-yellow-400">
                  ${getTotalPrice()}
                </span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-700/50"
              >
                FINALIZAR COMPRA
              </button>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-700 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all text-sm"
              >
                Vaciar Carrito
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        /* Custom Scrollbar for better dark mode look */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937; /* Gray-800 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3b82f6; /* Blue-500 */
          border-radius: 20px;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  )
}
// Componente 4: Dashboard (API FIX)
export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [email, setEmail] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userEmail = localStorage.getItem('email')
    
    // Si no hay token, redirigir al login
    if (!token) {
      router.push('/login')
    } else {
      setEmail(userEmail || 'user@example.com')
      updateCartCount()
    }
  }, [router])

  useEffect(() => {
    updateCartCount()
  }, [isCartOpen])

  const updateCartCount = () => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      const items = JSON.parse(cart)
      setCartCount(items.length)
    } else {
      setCartCount(0)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/search.json`, {
        params: { q: searchTerm, limit: 12 } // Añadimos 'limit' para mejor rendimiento
      })
      
      setBooks(response.data.docs || [])
      
    } catch (error) {
      console.error('Error al buscar libros:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    router.push('/login') 
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
      
      <header className="bg-gray-800 shadow-xl sticky top-0 z-40 border-b border-blue-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl text-blue-400">📖</span>
            <h1 className="text-3xl font-extrabold text-white tracking-wider">BookPulse</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:block border-r border-gray-700 pr-4">{email}</span>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-700/30"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-800">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-md shadow-red-700/30"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-5xl font-extrabold text-center mb-4 text-white">
          Encuentra tu Próxima Lectura
        </h2>
        <p className="text-xl text-center mb-12 text-blue-300">
          Explora millones de títulos y autores en nuestra biblioteca.
        </p>

        <form onSubmit={handleSearch} className="mb-16">
          <div className="flex gap-4 p-2 bg-gray-800 rounded-2xl shadow-2xl shadow-gray-700/50 border border-gray-700">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca libros por título, autor, ISBN..."
              className="flex-1 px-6 py-4 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              ) : (
                <>
                  <span className="text-xl">🔍</span>
                  Buscar
                </>
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-pulse text-2xl text-blue-400">Buscando libros en el cosmos...</div>
          </div>
        )}

        {!loading && searchTerm && (
          <div className="pt-4">
            {books.length === 0 ? (
                <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg">
                    <span className="text-6xl mb-4 block">😔</span>
                    <p className="text-gray-400 text-xl font-semibold">No se encontraron títulos para "{searchTerm}"</p>
                    <p className="text-gray-500 text-sm mt-2">Intenta con una búsqueda diferente.</p>
                </div>
            ) : (
                <div>
                    <p className="text-gray-400 text-lg mb-8 font-semibold">
                      <span className="text-blue-400 font-extrabold">{books.length}</span> resultados de la búsqueda: "{searchTerm}"
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {books.map((book) => (
                        <BookCard
                          key={book.key}
                          book={book}
                          onClick={() => setSelectedBook(book)}
                          onAddToCart={updateCartCount}
                        />
                      ))}
                    </div>
                </div>
            )}
          </div>
        )}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={updateCartCount}
        />
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}