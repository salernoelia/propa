import { h } from '@salernoelia/propa';
import { ComponentLifecycle } from '@salernoelia/propa';
import { Navigation } from '../components/Navigation';
import { BouncingBall, CircleFollowMouse } from '../components/P5';



export function HomePage() {

    ComponentLifecycle.onMount(() => {

    });

    return (
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <Navigation />
            <BouncingBall />
            <CircleFollowMouse />
        </div>
    );
}