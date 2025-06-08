import { h } from '@salernoelia/propa';

interface ButtonProps {
    children?: string;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export function Button(props: ButtonProps) {
    const component = (
        <button
            onClick={props.onClick}
            className={props.className}
            type={props.type || 'button'}
        >
            {props.children}
        </button>
    );

    return component;
}