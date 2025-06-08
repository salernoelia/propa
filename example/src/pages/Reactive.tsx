import { h } from '@salernoelia/propa';
import { setupCounter } from '../counter';
import { ComponentLifecycle } from '@salernoelia/propa';
import { reactive } from '@salernoelia/propa';
import { Router } from '@salernoelia/propa';
import { AboutPage } from './About';
import { Button } from '../components/Button';
import { Counter } from '../components/Counter';

const router = new Router();


export function ReactivePage() {
    const num = reactive(50);
    const text = reactive('aa');

    ComponentLifecycle.onMount(() => {
        setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
        const inputInput = document.querySelector<HTMLInputElement>('#input')!;

        inputInput.addEventListener('input', () => {
            console.log(inputInput.value)
            text.value = inputInput.value;
        })
    });

    const page = (
        <div>
            <h1>Homey</h1>
            <button id="counter" type="button"></button>

            <Button
                onClick={() => num.value++}
                className="request-button"
            >
                Request
            </Button>

            <Counter
                initialValue={10}
                label="My Counter:"
                onValueChange={(value) => console.log('Counter changed:', value)}
            />

            <Button onClick={() => console.log('Hello clicked!')}>
                Hello
            </Button>

            <Button onClick={() => router.navigate('/extern')}>Extern</Button>

            <h2>{num}</h2>
            <AboutPage></AboutPage>
            <input id="input" type="text"></input>
            <h2>{text}</h2>
            <h2>{num}</h2>
            <a href="#/about">About</a>
        </div>
    );

    return page;
}