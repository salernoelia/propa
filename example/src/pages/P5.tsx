import { h } from '@salernoelia/propa';
import { Navigation } from '../components/Navigation';
import { BouncingBall, CircleFollowMouse } from '../components/P5';


export function P5Page() {

    return (
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <Navigation />
            <BouncingBall />
            <CircleFollowMouse />
        </div>
    );
}