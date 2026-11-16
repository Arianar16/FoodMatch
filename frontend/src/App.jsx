
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import Ingredients from './pages/Ingredients'
import Pantry from './pages/Pantry'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/recetas" element={<Recipes />} />
          <Route path="/recetas/nueva" element={<CreateRecipe />} />
          <Route path="/recetas/:id" element={<RecipeDetail />} />
          <Route path="/ingredientes" element={<Ingredients />} />
          <Route path="/alacena" element={<Pantry />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
