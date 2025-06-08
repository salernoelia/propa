import { h } from '@salernoelia/propa';
import { router } from '../router';
import { Button } from './Button';

export function Navigation() {
    return (
        <div className="flex gap-4 p-4">
            <Button onClick={() => router.navigate('/')}>Home</Button>
            <Button onClick={() => router.navigate('/p5')}>P5</Button>
            <Button onClick={() => router.navigate('/wasm')}>WASM</Button>
            <Button onClick={() => router.navigate('/reactive')}>Reactive</Button>
            <Button onClick={() => router.navigate('/about')}>About</Button>
        </div>
    );
}