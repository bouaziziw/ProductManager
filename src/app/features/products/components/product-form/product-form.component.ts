import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-indigo-600 px-6 py-5 border-b border-indigo-700">
          <h2 class="text-2xl font-bold text-white tracking-wide">{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h2>
          <p class="text-indigo-100 text-sm mt-1 opacity-80">{{ isEditMode ? 'Update product details below' : 'Fill out the information to create a new product' }}</p>
        </div>
        
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="px-8 py-8">
          
          <div *ngIf="store.error()" class="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow-sm">
            <p class="text-sm text-red-700 font-medium">{{ store.error() }}</p>
          </div>

          <!-- Name -->
          <div class="mb-7">
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Product Name <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              id="name" 
              formControlName="name" 
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              [ngClass]="{'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50': isFieldInvalid('name')}"
              placeholder="e.g. Premium Wireless Headphones"
            >
            <p *ngIf="isFieldInvalid('name')" class="mt-2 text-sm text-red-600 font-medium">Product name is required (min 3 chars).</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-7 mb-7">
            <!-- Price -->
            <div>
              <label for="price" class="block text-sm font-semibold text-gray-700 mb-2">Price ($) <span class="text-red-500">*</span></label>
              <div class="relative rounded-xl shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm font-semibold">$</span>
                </div>
                <input 
                  type="number" 
                  step="0.01" 
                  id="price" 
                  formControlName="price" 
                  class="appearance-none block w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 bg-white"
                  [ngClass]="{'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50': isFieldInvalid('price')}"
                  placeholder="0.00"
                >
              </div>
              <p *ngIf="isFieldInvalid('price')" class="mt-2 text-sm text-red-600 font-medium">Valid price is required.</p>
            </div>

            <!-- Stock -->
            <div>
              <label for="stock" class="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity <span class="text-red-500">*</span></label>
              <input 
                type="number" 
                id="stock" 
                formControlName="stock" 
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                [ngClass]="{'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50': isFieldInvalid('stock')}"
                placeholder="0"
              >
              <p *ngIf="isFieldInvalid('stock')" class="mt-2 text-sm text-red-600 font-medium">Stock must be 0 or greater.</p>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-10">
            <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              id="description" 
              formControlName="description" 
              rows="5" 
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              placeholder="Tell us about the product features, specifications, etc..."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
            <a routerLink="/products" class="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
              Cancel
            </a>
            <button 
              type="submit" 
              [disabled]="productForm.invalid || store.loading()"
              class="inline-flex justify-center items-center px-8 py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg *ngIf="store.loading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditMode ? 'Update Product' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  store = inject(ProductStore);

  productId: number | null = null;
  isEditMode = false;

  productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: [''],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProductData();
      }
    });
  }

  async loadProductData() {
    if (this.productId) {
      await this.store.loadProductById(this.productId);
      const product = this.store.selectedProduct();
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          description: product.description,
          stock: product.stock
        });
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = this.productForm.getRawValue();

    try {
      if (this.isEditMode && this.productId) {
        await this.store.updateProduct(this.productId, formData);
      } else {
        await this.store.createProduct(formData);
      }
      this.router.navigate(['/products']);
    } catch (e) {
      // Error is handled in store, form just stays open
    }
  }
}
