import { FileText } from "lucide-react"
import styles from '../styles/ProjectHeader.module.css'

export function ProjectHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.iconContainer}>
        <FileText className={styles.icon} />
      </div>
      <h1 className={styles.title}>Dipak's Workspace</h1>
    </header>
  )
}
