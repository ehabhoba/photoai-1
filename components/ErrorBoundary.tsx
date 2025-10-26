/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Replaced constructor with class property for state initialization to resolve component typing issues.
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="bg-black text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-permanent-marker text-red-500">Oops! Something went wrong.</h1>
            <p className="mt-4 text-neutral-300">An unexpected error occurred. Please try refreshing the page.</p>
            {this.state.error && (
                <pre className="mt-4 p-4 bg-neutral-800 text-red-400 rounded-md max-w-lg text-left text-sm overflow-auto">
                    {this.state.error.toString()}
                </pre>
            )}
            <button
                onClick={() => window.location.reload()}
                className="mt-8 font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)]"
            >
                Refresh Page
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
