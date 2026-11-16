
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {
  const sections = [
    {
      title: 'Recetas',
      description: 'Descubrí comidas y aprendé nuevas preparaciones.',
      path: '/recetas',
      icon: '🍽️',
    },
    {
      title: 'Ingredientes',
      description: 'Explorá los ingredientes disponibles.',
      path: '/ingredientes',
      icon: '🥕',
    },
    {
      title: 'Mi alacena',
      description: 'Organizá los ingredientes que tenés en casa.',
      path: '/alacena',
      icon: '🧺',
    },
    {
      title: 'Favoritos',
      description: 'Encontrá las recetas que guardaste.',
      path: '/favoritos',
      icon: '❤️',
    },
    {
      title: 'Mi perfil',
      description: 'Consultá y modificá tus datos personales.',
      path: '/perfil',
      icon: '👤',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div>
          <h1 className="text-3xl font-bold text-white">
            ¡Bienvenido a FoodMatch!
          </h1>

          <p className="mt-3 text-gray-400">
            Encontrá recetas, organizá tus ingredientes y descubrí
            nuevas comidas.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-6">
            Explorá FoodMatch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((section) => (
              <Link
                key={section.path}
                to={section.path}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-emerald-500 hover:bg-slate-800 transition"
              >
                <span className="text-4xl">
                  {section.icon}
                </span>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  {section.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-emerald-400">
                  Explorar →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
