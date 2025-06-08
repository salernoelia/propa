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
        <div style={{ color: 'white' }}>
            <Navigation />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1>Reactive State Demo</h1>
                <p>Explore Propa's reactive state management with automatic DOM updates.</p>

                <div style={{ padding: '2rem', borderRadius: '8px', margin: '2rem 0' }}>
                    <h2 style={{ textAlign: 'center' }}>{message}</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Text Input (updates message above):
                        </label>
                        <input
                            id="text-input"
                            type="text"
                            placeholder="Start typing..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Button onClick={handleButtonClick}>
                            Click Me ({clickCount})
                        </Button>

                        <Button onClick={resetDemo}>
                            Reset Demo
                        </Button>
                    </div>

                    <div>
                        <h3>Counter Component:</h3>
                        <Counter
                            initialValue={10}
                            label="Interactive Counter:"
                            onValueChange={(value) => console.log('Counter changed:', value)}
                        />
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '4px' }}>
                        <h4>Reactive Values:</h4>
                        <ul style={{ margin: '0.5rem 0' }}>
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