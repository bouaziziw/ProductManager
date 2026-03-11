import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  // Using a mock API endpoint, could be swapped easily with real URL
  private apiUrl = '/api/products'; 
  
  // Mock data for demo purposes simulating a backend database
  private mockProducts: Product[] = [
    { id: 1, name: 'Premium Wireless Headphones', price: 299.99, description: 'High-quality noise-canceling headphones with 30-hour battery life.', stock: 45 },
    { id: 2, name: 'Ergonomic Desk Chair', price: 199.50, description: 'Comfortable mesh chair with lumbar support for long working hours.', stock: 12 },
    { id: 3, name: 'Mechanical Keyboard', price: 129.99, description: 'RGB mechanical keyboard with tactile cherry MX brown switches.', stock: 0 },
    { id: 4, name: '4K Ultra HD Monitor', price: 349.00, description: '27-inch 4K IPS display perfect for gaming and productivity.', stock: 8 }
  ];

  getProducts(): Observable<Product[]> {
    // In a real app: return this.http.get<Product[]>(this.apiUrl);
    return of([...this.mockProducts]).pipe(delay(500));
  }

  getProductById(id: number): Observable<Product> {
    // In a real app: return this.http.get<Product>(`${this.apiUrl}/${id}`);
    const product = this.mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return of({...product}).pipe(delay(300));
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    // In a real app: return this.http.post<Product>(this.apiUrl, product);
    const newProduct = { ...product, id: Math.max(...this.mockProducts.map(p => p.id), 0) + 1 };
    this.mockProducts.push(newProduct);
    return of({...newProduct}).pipe(delay(400));
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    // In a real app: return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.mockProducts[index] = { ...this.mockProducts[index], ...product };
    return of({...this.mockProducts[index]}).pipe(delay(400));
  }

  deleteProduct(id: number): Observable<void> {
    // In a real app: return this.http.delete<void>(`${this.apiUrl}/${id}`);
    this.mockProducts = this.mockProducts.filter(p => p.id !== id);
    return of(undefined).pipe(delay(400));
  }
}
