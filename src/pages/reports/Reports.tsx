import styles from './Reports.module.css'

const REPORTS = [
  { title: 'Asset Inventory Report',      desc: 'Full list of all assets with status, location and value.',         icon: '📦', tag: 'Assets'      },
  { title: 'Maintenance Summary',         desc: 'Open, completed and overdue tickets grouped by priority.',         icon: '🔧', tag: 'Maintenance'  },
  { title: 'Location Utilization',        desc: 'Asset count and distribution across all airport zones.',           icon: '📍', tag: 'Locations'    },
  { title: 'User Activity Log',           desc: 'Login history and actions performed by each system user.',         icon: '👤', tag: 'Users'        },
  { title: 'Asset Value Summary',         desc: 'Total purchase value and depreciation breakdown by category.',     icon: '💰', tag: 'Finance'      },
  { title: 'Overdue Maintenance Alerts',  desc: 'All tickets past their scheduled date requiring immediate action.', icon: '⚠️', tag: 'Alerts'       },
]

export default function Reports() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Reports</h1>
          <p>Generate and export system reports</p>
        </div>
      </div>

      <div className={styles.grid}>
        {REPORTS.map((r, i) => (
          <div key={i} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={styles.cardTop}>
              <span className={styles.icon}>{r.icon}</span>
              <span className={styles.tag}>{r.tag}</span>
            </div>
            <div className={styles.title}>{r.title}</div>
            <div className={styles.desc}>{r.desc}</div>
            <button className={styles.btn}>Generate report</button>
          </div>
        ))}
      </div>
    </div>
  )
}