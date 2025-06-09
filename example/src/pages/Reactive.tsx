import { h } from '@salernoelia/propa';
import { ComponentLifecycle } from '@salernoelia/propa';
import { reactive } from '@salernoelia/propa';
import { Button } from '../components/Button';
import { Counter } from '../components/Counter';
import { Navigation } from '../components/Navigation';

export function ReactivePage() {
    const message = reactive('Type something below...');
    const clickCount = reactive(0);
    const inputValue = reactive('');

    ComponentLifecycle.onMount(() => {
        const inputElement = document.querySelector<HTMLInputElement>('#text-input')!;

        inputElement.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            inputValue.value = target.value;
            message.value = target.value || 'Type something below...';
        });
    });

    const handleButtonClick = () => {
        clickCount.value++;
        message.value = `Button clicked ${clickCount.value} times!`;
    };

    const resetDemo = () => {
        clickCount.value = 0;
        inputValue.value = '';
        message.value = 'Type something below...';

        const inputElement = document.querySelector<HTMLInputElement>('#text-input')!;
        inputElement.value = '';
    };

    return (
        <div className="text-white">
            <Navigation />

            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Reactive State Demo</h1>
                <p className="mb-6">Explore Propa's reactive state management with automatic DOM updates.</p>

                <div className="p-8 rounded-lg my-8 border border-gray-700">
                    <h2 className="text-2xl text-center">{message}</h2>
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="text-input" className="block mb-2 font-bold">
                            Text Input (updates message above):
                        </label>
                        <input
                            id="text-input"
                            type="text"
                            placeholder="Start typing..."
                            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-500"
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <Button onClick={handleButtonClick}>
                            Click Me ({clickCount})
                        </Button>

                        <Button onClick={resetDemo}>
                            Reset Demo
                        </Button>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">Counter Component:</h3>
                        <Counter
                            initialValue={10}
                            label="Interactive Counter:"
                            onValueChange={(value) => console.log('Counter changed:', value)}
                        />
                    </div>

                    <div className="mt-8 p-4 rounded border border-gray-700">
                        <h4 className="text-lg font-semibold mb-2">Reactive Values:</h4>
                        <ul className="my-2 list-disc list-inside">
                            <li>Input Value: "{inputValue}"</li>
                            <li>Click Count: {clickCount}</li>
                            <li>Message: "{message}"</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}