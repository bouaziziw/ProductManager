import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Products Inventory</h1>
          <p class="text-sm text-gray-500 mt-1">Manage your store's catalog</p>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="store.loading()" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="store.error()" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
             <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ store.error() }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!store.loading() && store.products().length === 0" class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
        <div class="mt-6">
          <a routerLink="/products/new" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Product
          </a>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let product of store.products()" class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col group overflow-hidden">
          <div class="p-6 flex-grow relative">
            <div class="absolute top-4 right-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 ring-1 ring-inset ring-indigo-500/10">
                {{ product.price | currency }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2 pr-12">{{ product.name }}</h2>
            <p class="text-gray-500 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center">
              <span class="inline-flex items-center justify-center h-6 px-2 rounded-md text-xs font-semibold" 
                    [ngClass]="{
                      'bg-emerald-100 text-emerald-700': product.stock > 10, 
                      'bg-amber-100 text-amber-700': product.stock > 0 && product.stock <= 10, 
                      'bg-rose-100 text-rose-700': product.stock === 0
                    }">
                {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
              </span>
            </div>
          </div>
          <div class="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-gray-50 transition-colors duration-200">
            <a [routerLink]="['/products', product.id]" class="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors duration-200">View Details</a>
            <div class="flex space-x-1">
              <a [routerLink]="['/products', product.id, 'edit']" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
              </a>
              <button (click)="deleteProduct(product.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  store = inject(ProductStore);

  ngOnInit() {
    this.store.loadProducts();
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.store.deleteProduct(id);
    }
  }
}
