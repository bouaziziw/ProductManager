import { Injectable, computed, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { firstValueFrom } from 'rxjs';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  private productService = inject(ProductService);

  // Initial State using Angular Signals
  private state = signal<ProductState>({
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
  });

  // Selectors (computed signals)
  readonly products = computed(() => this.state().products);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly selectedProduct = computed(() => this.state().selectedProduct);

  // Actions
  async loadProducts() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    try {
      const products = await firstValueFrom(this.productService.getProducts());
      this.state.update(s => ({ ...s, products, loading: false }));
    } catch (err: any) {
      this.state.update(s => ({ ...s, loading: false, error: err.message || 'Failed to load products' }));
    }
  }

  async loadProductById(id: number) {
    this.state.update(s => ({ ...s, loading: true, error: null, selectedProduct: null }));
    try {
      const product = await firstValueFrom(this.productService.getProductById(id));
      this.state.update(s => ({ ...s, selectedProduct: product, loading: false }));
    } catch (err: any) {
      this.state.update(s => ({ ...s, loading: false, error: err.message || 'Failed to load product' }));
    }
  }

  async createProduct(product: Omit<Product, 'id'>) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    try {
      const newProduct = await firstValueFrom(this.productService.createProduct(product));
      this.state.update(s => ({ 
        ...s, 
        products: [...s.products, newProduct],
        loading: false 
      }));
    } catch (err: any) {
      this.state.update(s => ({ ...s, loading: false, error: err.message || 'Failed to create product' }));
      throw err; // Re-throw to be handled by the component form
    }
  }

  async updateProduct(id: number, product: Partial<Product>) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    try {
      const updatedProduct = await firstValueFrom(this.productService.updateProduct(id, product));
      this.state.update(s => ({ 
        ...s, 
        products: s.products.map(p => p.id === id ? updatedProduct : p),
        selectedProduct: s.selectedProduct?.id === id ? updatedProduct : s.selectedProduct,
        loading: false 
      }));
    } catch (err: any) {
      this.state.update(s => ({ ...s, loading: false, error: err.message || 'Failed to update product' }));
      throw err;
    }
  }

  async deleteProduct(id: number) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    try {
      await firstValueFrom(this.productService.deleteProduct(id));
      this.state.update(s => ({ 
        ...s, 
        products: s.products.filter(p => p.id !== id),
        loading: false 
      }));
    } catch (err: any) {
      this.state.update(s => ({ ...s, loading: false, error: err.message || 'Failed to delete product' }));
      throw err;
    }
  }
}
