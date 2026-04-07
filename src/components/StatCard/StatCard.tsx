import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div
        className={styles.accent}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <div
            className={styles.iconWrapper}
            style={{
              backgroundColor: `${color}1a`,
              color,
            }}
          >
            <span className={styles.icon}>{icon}</span>
          </div>
        </div>
        <div className={styles.stats}>
          <span className={styles.value}>{value}</span>
          <span className={styles.title}>{title}</span>
        </div>
      </div>
    </div>
  );
}