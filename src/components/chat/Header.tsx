import styles from './styles/Header.module.css'

interface HeaderProps {
  isNavCollapsed: boolean;
}

export function Header({ isNavCollapsed }: HeaderProps) {
  const userName = "Dipak" // Replace with actual user name
  const userInitial = userName.charAt(0)

  return (
    <header 
      className={styles.header}
      style={{ 
        width: isNavCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 280px)'
      }}
    >
      <div className={styles.headerTitle}>Cortex</div>
      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          {userInitial}
        </div>
        <span className={styles.userName}>{userName}</span>
      </div>
    </header>
  )
}
