
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const menuItems = [
  { title: 'Inicio', path: '/', icon: 'home' },
  { title: 'Recetas', path: '/recetas', icon: 'food' },
  { title: 'Ingredientes', path: '/ingredientes', icon: 'leaf' },
  { title: 'Mi alacena', path: '/alacena', icon: 'basket' },
  { title: 'Favoritos', path: '/favoritos', icon: 'heart' },
  { title: 'Mi perfil', path: '/perfil', icon: 'user' },
]

function MenuIcon({ name, className = 'h-6 w-6' }) {
  const iconProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'home') {
    return (
      <svg {...iconProps}>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-7h6v7" />
      </svg>
    )
  }

  if (name === 'food') {
    return (
      <svg {...iconProps}>
        <path d="M3 11h18" />
        <path d="M4 11a8 8 0 0 1 16 0" />
        <path d="M5 11v2a7 7 0 0 0 14 0v-2" />
        <path d="M8 17h8" />
        <path d="M7 21h10" />
        <path d="M7 4 5 2M17 4l2-2" />
      </svg>
    )
  }

  if (name === 'leaf') {
    return (
      <svg {...iconProps}>
        <path d="M20 4c-9 0-15 3-15 10a6 6 0 0 0 6 6c7 0 10-7 9-16Z" />
        <path d="M4 21c3-6 7-9 13-13" />
        <path d="M10 14c-1-2-1-4-1-5" />
      </svg>
    )
  }

  if (name === 'basket') {
    return (
      <svg {...iconProps}>
        <path d="m4 10 2 10h12l2-10H4Z" />
        <path d="m8 10 4-7 4 7" />
        <path d="M9 13v4M12 13v4M15 13v4" />
        <path d="M3 10h18" />
      </svg>
    )
  }

  if (name === 'heart') {
    return (
      <svg {...iconProps}>
        <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
      </svg>
    )
  }

  if (name === 'user') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    )
  }

  if (name === 'chef') {
    return (
      <svg {...iconProps}>
        <path d="M6 13a4 4 0 1 1 1-7.9 5 5 0 0 1 10 0A4 4 0 1 1 18 13v6H6v-6Z" />
        <path d="M9 19v2h6v-2" />
        <path d="M9 13v3M15 13v3" />
      </svg>
    )
  }

  if (name === 'logout') {
    return (
      <svg {...iconProps}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </svg>
    )
  }

  return null
}

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path + '/'))

  const renderMenuItems = () =>
    menuItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setMenuOpen(false)}
        className={`flex shrink-0 items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
          isActive(item.path)
            ? 'bg-[#96E6B3] text-[#173B32] shadow-md'
            : 'text-[#E5F2E9] hover:bg-[#245747] hover:text-white'
        }`}
      >
        <span className="flex w-6 items-center justify-center">
          <MenuIcon name={item.icon} />
        </span>
        <span className="font-semibold">{item.title}</span>
      </Link>
    ))

  const renderUserInfo = () => (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#96E6B3] font-bold text-[#173B32]">
        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
      </div>

      <div className="min-w-0">
        <p className="truncate font-bold text-white">
          {user?.userName || 'Usuario'}
        </p>
        <p className="text-xs text-[#B9D8C5]">FoodMatch</p>
      </div>
    </div>
  )

  const renderLogoutButton = () => (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#FF7557]/40 bg-[#173B32] px-3 py-2 text-sm font-semibold text-[#FFB19D] transition hover:border-[#FF7557] hover:bg-[#FF7557] hover:text-[#173B32]"
    >
      <MenuIcon name="logout" className="h-4 w-4" />
      Cerrar sesión
    </button>
  )

  return (
    <>
      {/* Menú lateral para computadoras */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col overflow-y-auto border-r border-[#31594C] bg-[#173B32] px-5 py-6 md:flex">
        <Link to="/" className="mb-10 flex shrink-0 items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00A878] text-white shadow-md">
            <MenuIcon name="chef" className="h-8 w-8" />
          </span>

          <span className="text-2xl font-extrabold tracking-tight text-white">
            Food<span className="text-[#FF7557]">Match</span>
          </span>
        </Link>

        <p className="mb-4 shrink-0 px-3 text-xs font-bold uppercase tracking-widest text-[#96E6B3]">
          Tu espacio
        </p>

        <nav className="flex shrink-0 flex-col gap-2">
          {renderMenuItems()}
        </nav>

        <div className="mt-auto shrink-0 rounded-2xl border border-[#31594C] bg-[#245747] p-4">
          {renderUserInfo()}
          {renderLogoutButton()}
        </div>
      </aside>

      {/* Menú adaptable para celulares */}
      <header className="sticky top-0 z-50 border-b border-[#31594C] bg-[#173B32] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00A878] text-white">
              <MenuIcon name="chef" className="h-7 w-7" />
            </span>

            <span className="text-xl font-extrabold tracking-tight text-white">
              Food<span className="text-[#FF7557]">Match</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#96E6B3]/30 text-[#96E6B3] transition hover:bg-[#245747]"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-4 border-t border-[#31594C] pt-4">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-[#96E6B3]">
              Tu espacio
            </p>

            <nav className="flex flex-col gap-2">
              {renderMenuItems()}
            </nav>

            <div className="mt-4 rounded-2xl border border-[#31594C] bg-[#245747] p-4">
              {renderUserInfo()}
              {renderLogoutButton()}
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Navbar
