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

  // Clases para la animación de entrada/salida
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