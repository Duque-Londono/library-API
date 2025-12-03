'use client'

import { useState } from 'react'

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

export default function BookCard({ book, onClick, onAddToCart }: BookCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : '/placeholder-book.png'

  // Generar precio aleatorio entre $9.99 y $29.99
  const getBookPrice = () => {
    return (Math.random() * (29.99 - 9.99) + 9.99).toFixed(2)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const cart = localStorage.getItem('cart')
    const cartItems = cart ? JSON.parse(cart) : []
    
    // Verificar si ya está en el carrito
    const existingItem = cartItems.find((item: any) => item.key === book.key)
    if (existingItem) {
      alert('Este libro ya está en tu carrito 📚')
      return
    }
    
    // Agregar al carrito con precio
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
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
      <div
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="h-64 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
          {book.cover_i ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-6xl">📖</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-1">
            {book.author_name?.[0] || 'Autor desconocido'}
          </p>
          {book.first_publish_year && (
            <p className="text-gray-500 text-xs mb-3">
              {book.first_publish_year}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-purple-600 font-bold text-lg">
              ${getBookPrice()} USD
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2 rounded-lg font-semibold transition-all ${
            isAdding
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {isAdding ? '✓ Agregado' : '🛒 Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}