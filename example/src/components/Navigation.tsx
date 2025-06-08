import { h } from '@salernoelia/propa';
import { Router } from '@salernoelia/propa';
import { Button } from './Button';

const router = new Router();


export function Navigation() {


    return (
        <div style="display: flex; flex-direction: row; gap: 1rem;">
            <Button onClick={() => router.navigate('/extern')}>Extern</Button>
            <Button onClick={() => router.navigate('/reactive')}>Reactive</Button>
            <Button onClick={() => router.navigate('/about')}>About</Button>
        </div>
    );
}