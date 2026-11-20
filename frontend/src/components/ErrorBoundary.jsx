import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Terjadi Kendala Tampilan</h2>
          <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
            Komponen ini mengalami galat rendering sementara: {this.state.error?.message || 'Galat tidak diketahui'}.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Muat Ulang Komponen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
