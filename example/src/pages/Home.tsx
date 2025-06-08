import { h } from '@salernoelia/propa';
import { ComponentLifecycle } from '@salernoelia/propa';
import { reactive } from '@salernoelia/propa';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/Button';

export function HomePage() {
    const welcomeMessage = reactive('Welcome to Propa Framework');
    const currentTime = reactive(new Date().toLocaleTimeString());

    ComponentLifecycle.onMount(() => {
        const timer = setInterval(() => {
            currentTime.value = new Date().toLocaleTimeString();
        }, 1000);

        return () => clearInterval(timer);
    });

    const updateWelcome = () => {
        welcomeMessage.value = `Updated at ${new Date().toLocaleTimeString()}`;
    };

    return (
        <div className="min-h-screen">
            <Navigation />

            <div className="max-w-4xl mx-auto py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Propa</h1>
                    <p className="text-xl text-white mb-2">{welcomeMessage}</p>
                    <p className="text-sm text-white mb-6">{currentTime}</p>

                    <Button onClick={updateWelcome}>
                        Update Message
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">🎨 Graphics & Canvas</h3>
                        <p className="text-white">Built-in p5.js integration for graphics and animations</p>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">⚡ WebAssembly</h3>
                        <p className="text-white">Type-safe WASM module loading for performance-critical operations</p>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">🔄 Reactive State</h3>
                        <p className="text-white">Smart reactivity with batched DOM updates</p>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">📦 Zero Dependencies</h3>
                        <p className="text-white">Pure TypeScript implementation with minimal overhead</p>
                    </div>
                </div>
            </div>
        </div>
    );
}