import { useState } from 'react'
import styles from './styles/Navbar.module.css'

interface NavbarProps {
  onToggle: (collapsed: boolean) => void;
}

export function Navbar({ onToggle }: NavbarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onToggle(newCollapsed)
  }

  return (
    <nav className={`${styles.navbar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        {!collapsed && <span>Cortex</span>}
        <button 
          className={styles.toggleButton} 
          onClick={handleToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <div className={styles.navContent}>
        {/* Add navigation items here if needed */}
      </div>
    </nav>
  )
}
