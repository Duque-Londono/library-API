'use client'

import { useState, useEffect } from 'react'

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

export default function Cart({ isOpen, onClose }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    loadCart()
  }, [isOpen])

  const loadCart = () => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      setCartItems(JSON.parse(cart))
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
    
    alert(`¡Compra realizada! Total: $${getTotalPrice()} USD\n\nGracias por tu compra 📚`)
    clearCart()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center md:justify-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-l-3xl md:rounded-r-none w-full md:w-96 h-[80vh] md:h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="text-2xl font-bold text-gray-800">
              Carrito ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📚</span>
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-2">
                Agrega libros para comenzar tu compra
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.key}
                  className="bg-gray-50 rounded-xl p-4 flex gap-4 hover:bg-gray-100 transition-all"
                >
                  <div className="w-16 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${item.cover_i}-S.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📖</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2">
                      {item.author_name?.[0] || 'Autor desconocido'}
                    </p>
                    <p className="text-purple-600 font-bold text-sm">
                      ${item.price.toFixed(2)} USD
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="text-red-500 hover:text-red-700 text-xl self-start"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-purple-600">
                ${getTotalPrice()} USD
              </span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Finalizar Compra
            </button>
            
            <button
              onClick={clearCart}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  )
}