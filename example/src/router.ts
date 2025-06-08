import { HomePage } from './pages/Home'
import { AboutPage } from './pages/About'
import { NotFoundPage } from './pages/NotFound'
import { WasmPage } from './pages/Wasm';
import { ReactivePage } from './pages/Reactive';
import { P5Page } from './pages/P5';
import { Router } from '@salernoelia/propa';

export const router = new Router(false, true);


export function routes() {

    router.addRoute('/', () => HomePage());
    router.addRoute('/reactive', () => ReactivePage());
    router.addRoute('/about', () => AboutPage());
    router.addRoute('/wasm', () => WasmPage());
    router.addRoute('/p5', () => P5Page());
    router.addRoute('/404', () => NotFoundPage());

}