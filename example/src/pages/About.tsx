import { h } from "@salernoelia/propa";
import { ComponentLifecycle } from '@salernoelia/propa';

export function AboutPage() {

    ComponentLifecycle.onMount(() => {
        console.log('Component is mounted');
    });
    ComponentLifecycle.onUnmount(() => {
        console.log('Component is unmounting - cleanup here');
    });

    return (
        <div>
            <h1>About</h1>
            <p>This is the about page</p>
            <a href="#/">Home</a>
        </div>
    );
}