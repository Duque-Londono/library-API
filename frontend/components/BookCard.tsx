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
    : 'https://placehold.co/128x192/1A202C/3182CE?text=BOOK' // Placeholder oscuro

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
      // Replaced alert with console message as per instructions
      console.log('Este libro ya está en tu carrito 📚')
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