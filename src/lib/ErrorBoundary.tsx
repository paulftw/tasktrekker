"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-text-muted">
            <p className="text-sm">Something went wrong.</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="text-sm underline hover:text-text"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
