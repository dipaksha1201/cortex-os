import { FileText } from "lucide-react"
import styles from '../styles/ProjectHeader.module.css'

export function MemoryHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.iconContainer}>
                <FileText className={styles.icon} />
            </div>
            <h1 className={styles.title}>Memory Library</h1>
        </header>
    )
}
