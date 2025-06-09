import { h, when } from "@salernoelia/propa";
import { ComponentLifecycle } from '@salernoelia/propa';
import { reactive } from '@salernoelia/propa';
import { Navigation } from "../components/Navigation";
import { Button } from "../components/Button";

export function AboutPage() {
    const stats = reactive({
        components: 0,
        linesOfCode: 0,
        buildTime: 0
    });

    const showDetails = reactive(false);

    ComponentLifecycle.onMount(() => {
        setTimeout(() => {
            stats.value = {
                components: 7,
                linesOfCode: 850,
                buildTime: 45
            };
        }, 300);
    });

    const toggleDetails = () => {
        showDetails.value = !showDetails.value;
    };

    return (
        <div className="min-h-screen">
            <Navigation />

            <div className="max-w-3xl mx-auto py-12">
                <h1 className="text-3xl font-bold text-white mb-8">About Propa</h1>

                <div className="bg-gray-800 rounded-lg border p-8 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">What is Propa?</h2>
                    <p className="text-white leading-relaxed">
                        Propa is a minimal TypeScript framework designed for developers who want modern
                        reactive patterns without the complexity of larger frameworks. It provides just
                        enough structure for productive development while maintaining direct access to
                        browser APIs.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">{stats.value.components}</div>
                        <div className="text-sm text-white">Components</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">{stats.value.linesOfCode}</div>
                        <div className="text-sm text-white">Lines of Code</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">{stats.value.buildTime}ms</div>
                        <div className="text-sm text-white">Build Time</div>
                    </div>
                </div>

                <Button onClick={toggleDetails}>
                    {showDetails.value ? 'Hide' : 'Show'} Technical Details
                </Button>

                {when(showDetails, (
                    <div className="mt-6 bg-gray-800 rounded-lg border p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Technical Specifications</h3>
                        <ul className="space-y-2 text-white">
                            <li><strong>Runtime:</strong> Zero dependencies, pure TypeScript</li>
                            <li><strong>Reactivity:</strong> Batched updates using requestAnimationFrame</li>
                            <li><strong>Routing:</strong> Hash-based navigation with lifecycle management</li>
                            <li><strong>JSX:</strong> Compile-time transformation to native DOM operations</li>
                            <li><strong>WebAssembly:</strong> Type-safe module loading and execution</li>
                            <li><strong>P5.js:</strong> Integrated wrapper for creative coding</li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}