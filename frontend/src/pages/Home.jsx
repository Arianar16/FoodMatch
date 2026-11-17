
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/useAuth'

function HomeIcon({ name, className = 'h-7 w-7' }) {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'food') {
    return (
      <svg {...props}>
        <path d="M3 11h18" />
        <path d="M4 11a8 8 0 0 1 16 0" />
        <path d="M5 11v2a7 7 0 0 0 14 0v-2" />
        <path d="M8 17h8M7 21h10" />
      </svg>
    )
  }

  if (name === 'leaf') {
    return (
      <svg {...props}>
        <path d="M20 4c-9 0-15 3-15 10a6 6 0 0 0 6 6c7 0 10-7 9-16Z" />
        <path d="M4 21c3-6 7-9 13-13" />
      </svg>
    )
  }

  if (name === 'basket') {
    return (
      <svg {...props}>
        <path d="m4 10 2 10h12l2-10H4Z" />
        <path d="m8 10 4-7 4 7M3 10h18" />
        <path d="M9 13v4M12 13v4M15 13v4" />
      </svg>
    )
  }

  if (name === 'heart') {
    return (
      <svg {...props}>
        <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
      </svg>
    )
  }

  if (name === 'user') {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    )
  }

  return null
}

function Home() {
  const { user } = useAuth()

  const sections = [
    {
      title: 'Recetas',
      description: 'Explorá preparaciones y descubrí nuevos platos.',
      path: '/recetas',
      icon: 'food',
    },
    {
      title: 'Ingredientes',
      description: 'Conocé los ingredientes disponibles.',
      path: '/ingredientes',
      icon: 'leaf',
    },
    {
      title: 'Mi alacena',
      description: 'Organizá lo que tenés en casa.',
      path: '/alacena',
      icon: 'basket',
    },
    {
      title: 'Favoritos',
      description: 'Guardá las recetas que más te gustan.',
      path: '/favoritos',
      icon: 'heart',
    },
    {
      title: 'Mi perfil',
      description: 'Consultá y actualizá tus datos.',
      path: '/perfil',
      icon: 'user',
    },
  ]

  return (
    <div className="min-h-screen bg-[#96E6B3]">
      <Navbar />

      <div className="ml-64 min-h-screen">
        <header className="flex items-center justify-between border-b border-[#31594C]/15 bg-[#FFF3D6] px-10 py-5">
          <div>
            <p className="text-sm text-[#64756D]">
              Tu espacio de alimentación
            </p>
            <p className="font-semibold text-[#173B32]">
              Bienvenido a FoodMatch
            </p>
          </div>

          <Link
            to="/perfil"
            className="flex items-center gap-3 rounded-full border border-[#31594C]/20 bg-white/60 py-2 pl-2 pr-4 transition hover:border-[#00A878]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00A878] font-bold text-white">
              {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
            </span>

            <span className="text-sm font-semibold text-[#173B32]">
              {user?.userName || 'Mi perfil'}
            </span>
          </Link>
        </header>

        <main className="mx-auto max-w-7xl px-10 py-10">
          <section>
            <p className="text-sm font-semibold tracking-widest text-[#176044]">
              TU DÍA, TU ELECCIÓN
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#173B32]">
              ¡Hola, {user?.userName || 'bienvenido'}!
              <span className="text-[#FF7557]">.</span>
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-[#31594C]">
              Descubrí recetas, organizá tus ingredientes y encontrá
              nuevas ideas para disfrutar de la comida.
            </p>
          </section>

          <section className="mt-10">
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.18em] text-[#A63D2B]">
                EMPEZÁ POR ACÁ
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#173B32]">
                ¿Qué te gustaría cocinar hoy?
              </h2>
            </div>

            <Link
              to="/recetas"
              className="group relative flex min-h-67.5 overflow-hidden rounded-3xl border border-[#31594C]/20 bg-[#173B32] shadow-lg shadow-[#173B32]/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative z-10 flex max-w-xl flex-col justify-center p-8 sm:p-10">
                <span className="w-fit rounded-full bg-[#96E6B3]/15 px-4 py-2 text-xs font-bold tracking-widest text-[#96E6B3]">
                  COCINAR
                </span>

                <h3 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Convertí tus ingredientes en algo delicioso.
                </h3>

                <p className="mt-4 max-w-md leading-7 text-[#E5F2E9]">
                  Explorá recetas y encontrá nuevas ideas para preparar
                  tus próximas comidas.
                </p>

                <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-bold text-white transition group-hover:bg-[#008F67]">
                  Explorar recetas
                  <span>→</span>
                </span>
              </div>

              <div className="absolute -right-12 -top-12 h-72 w-72 rounded-full border-35 border-white/10" />
              <div className="absolute -bottom-24 right-12 h-80 w-80 rounded-full bg-[#96E6B3]/15 blur-2xl" />

              <div className="absolute bottom-8 right-10 hidden text-[#96E6B3] transition duration-300 group-hover:scale-110 md:block">
                <svg
                  viewBox="0 0 120 120"
                  className="h-36 w-36 lg:h-44 lg:w-44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M60 17c-8 0-14 6-14 14 0 2 1 4 2 6-8-2-16 4-16 13 0 7 5 12 12 13-5 5-5 13 0 18 4 4 9 5 14 3v13h34V84c5-2 8-7 8-12 0-6-4-11-9-13 7-2 11-8 9-15-2-7-9-11-16-9 2-8-5-18-14-18Z" />
                  <path d="M42 65h36M48 76h24M54 87h12" />
                  <path d="M60 17v-8M36 28l-6-6M84 28l6-6" />
                  <path d="M25 96c9-5 17-5 25 0M70 96c8-5 16-5 25 0" />
                </svg>
              </div>
            </Link>
          </section>

          <section className="mt-12 pb-10">
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.18em] text-[#176044]">
                TUS HERRAMIENTAS
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#173B32]">
                Explorá FoodMatch
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sections.map((section) => (
                <Link
                  key={section.path}
                  to={section.path}
                  className="group rounded-2xl border border-[#E9E0D1] bg-[#FFF3D6] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#00A878] hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00A878]/15 text-[#176044] transition group-hover:bg-[#00A878]/25">
                    <HomeIcon name={section.icon} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#173B32]">
                    {section.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#64756D]">
                    {section.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#008F67] transition group-hover:gap-3">
                    Explorar
                    <span>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Home
