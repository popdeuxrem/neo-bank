import React from 'react'

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    State
> {
    constructor(props: any) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('Page error:', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-zinc-950 flex 
                    items-center justify-center p-6">
                    <div className="max-w-md w-full text-center space-y-4">
                        <div className="w-16 h-16 bg-rose-500/20 
                            rounded-2xl flex items-center justify-center 
                            mx-auto">
                            <span className="text-rose-400 text-2xl">!</span>
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                            Page Error
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            {this.state.error?.message ?? 
                                'Something went wrong loading this page.'}
                        </p>
                        <div className="bg-zinc-900 rounded-xl p-4 
                            text-left text-xs font-mono text-zinc-500 
                            overflow-auto max-h-40">
                            {this.state.error?.stack}
                        </div>
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-2.5 bg-indigo-600 
                                hover:bg-indigo-500 text-white rounded-xl 
                                text-sm font-medium transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
