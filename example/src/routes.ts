import { HomePage } from './pages/Home'
import { AboutPage } from './pages/About'
import { NotFoundPage } from './pages/NotFound'
import { Router } from '@salernoelia/propa';
import { ExternPage } from './pages/Extern';
import { ReactivePage } from './pages/Reactive';

export function routes() {
    const router = new Router();

    // Home page
    router.addRoute('/', () => {
        return HomePage();
    });
    router.addRoute('/reactive', () => {
        return ReactivePage();
    });

    // About page
    router.addRoute('/about', () => {
        return AboutPage();
    });

    router.addRoute('/extern', () => {
        return ExternPage();
    });

    // 404 page
    router.addRoute('/404', () => {
        return NotFoundPage();
    });

    // Initialize router
    router.navigate('/');
}