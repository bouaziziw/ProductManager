import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <app-header></app-header>
      <main class="flex-grow pt-8 pb-16">
        <router-outlet></router-outlet>
      </main>
      <footer class="bg-white border-t border-gray-100 mt-auto py-8">
        <div class="container mx-auto px-4 text-center">
          <p class="text-sm text-gray-500 font-medium tracking-wide">&copy; {{ currentYear }} ProductManager App. Built with Angular & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}
