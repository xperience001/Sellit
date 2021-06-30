import React from 'react'
import './App.css'
import CategorySidebar from './components/CategorySidebar'
import ProductCard from './components/ProductCard'

function App() {
  return (
    <div className="App h-screen grid grid-cols-3">
      <CategorySidebar />
      <ProductCard />
    </div>
  )
}

export default App
