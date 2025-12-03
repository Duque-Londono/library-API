'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import BookCard from '@/components/BookCard'
import BookModal from '@/components/BookModal'
import Cart from '@/components/Cart'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Book {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

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
    if (!token) {
      router.push('/login')
    } else {
      setEmail(userEmail || '')
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
      const response = await axios.get(`${API_URL}/api/books/search`, {
        params: { q: searchTerm }
      })
      setBooks(response.data.docs || [])
    } catch (error) {
      console.error('Error al buscar libros:', error)
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-gray-800">BookSearch</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm hidden md:block">{email}</span>
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-purple-100 hover:bg-purple-200 text-purple-600 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca libros por título, autor, ISBN..."
              className="flex-1 px-6 py-4 rounded-xl border-2 border-white bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-gray-800 placeholder-gray-500 shadow-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? '🔍' : 'Buscar'}
            </button>
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Buscando libros...</p>
          </div>
        )}

        {!loading && books.length === 0 && searchTerm && (
          <div className="text-center py-12 bg-white/90 rounded-xl backdrop-blur-sm">
            <p className="text-gray-600 text-lg">No se encontraron resultados</p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <div>
            <p className="text-white text-lg mb-6 font-semibold">
              {books.length} resultados encontrados
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={updateCartCount}
        />
      )}

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}