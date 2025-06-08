import { h } from '@salernoelia/propa';
import { reactive } from '@salernoelia/propa';

interface CounterProps {
    initialValue?: number;
    label?: string;
    onValueChange?: (value: number) => void;
}

export function Counter(props: CounterProps) {
    const count = reactive(props.initialValue || 0);

    const increment = () => {
        count.value++;
        props.onValueChange?.(count.value);
    };

    const decrement = () => {
        count.value--;
        props.onValueChange?.(count.value);
    };

    return (
        <div className="counter">
            {props.label && <label>{props.label}</label>}
            <button onClick={decrement}>-</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
        </div>
    );
}