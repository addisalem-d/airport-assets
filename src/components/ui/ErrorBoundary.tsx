import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 48, textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠</div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Something went wrong</h2>
          <p style={{ fontSize: 13, color: '#aaa', margin: '0 0 20px' }}>{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{ padding: '8px 18px', background: '#4f7cff', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}