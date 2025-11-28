"use client";

/**
 * Error Boundary Component
 *
 * Catches and displays errors from child components with user-friendly messages.
 * Provides recovery options for users.
 *
 * Requirements: 1.5, 6.5
 */

import React, { Component, type ReactNode } from "react";
import { HauntedLayout } from "./haunted-layout";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });

    // Navigate to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <HauntedLayout>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-shadowGray/80 backdrop-blur-sm rounded-lg border-2 border-hauntedOrange/30 p-8 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">👻</div>
                <h1 className="text-3xl font-creepster text-hauntedOrange mb-2">
                  Oops! Something Went Wrong
                </h1>
                <p className="text-ghostWhite/80">
                  The spirits have encountered an unexpected error. Don't worry, your progress is
                  safe!
                </p>
              </div>

              <div className="mb-6 p-4 bg-darkVoid/50 rounded border border-bloodRed/30">
                <p className="text-sm text-ghostWhite/60">
                  An error occurred while loading the application. This might be a temporary issue.
                </p>
              </div>

              <button
                onClick={this.handleReset}
                className="w-full px-6 py-3 bg-hauntedOrange hover:bg-hauntedOrange/80 text-darkVoid font-bold rounded-lg transition-all duration-300 hover:shadow-haunted"
                type="button"
              >
                Go Home and Try Again
              </button>
            </div>
          </div>
        </HauntedLayout>
      );
    }

    return this.props.children;
  }
}
