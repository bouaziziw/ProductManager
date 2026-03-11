import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductStore } from './product.store';
import { ProductService } from '../services/product.service';
import { of, throwError } from 'rxjs';
import { Product } from '../models/product.model';

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Product A', price: 10, description: 'Desc A', stock: 5 },
  { id: 2, name: 'Product B', price: 20, description: 'Desc B', stock: 0 },
];

describe('ProductStore', () => {
  let store: ProductStore;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductService', [
      'getProducts', 'getProductById', 'createProduct', 'updateProduct', 'deleteProduct'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductStore,
        { provide: ProductService, useValue: spy }
      ]
    });

    store = TestBed.inject(ProductStore);
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  it('should be created with initial empty state', () => {
    expect(store).toBeTruthy();
    expect(store.products()).toEqual([]);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  describe('loadProducts()', () => {
    it('should load products and update state on success', fakeAsync(() => {
      productServiceSpy.getProducts.and.returnValue(of(MOCK_PRODUCTS));
      store.loadProducts();
      tick();
      expect(store.products()).toEqual(MOCK_PRODUCTS);
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBeNull();
    }));

    it('should set an error message on failure', fakeAsync(() => {
      productServiceSpy.getProducts.and.returnValue(throwError(() => new Error('Network error')));
      store.loadProducts();
      tick();
      expect(store.products()).toEqual([]);
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBe('Network error');
    }));
  });

  describe('loadProductById()', () => {
    it('should set selectedProduct on success', fakeAsync(() => {
      productServiceSpy.getProductById.and.returnValue(of(MOCK_PRODUCTS[0]));
      store.loadProductById(1);
      tick();
      expect(store.selectedProduct()).toEqual(MOCK_PRODUCTS[0]);
      expect(store.loading()).toBeFalse();
    }));
  });

  describe('createProduct()', () => {
    it('should add a new product to the state', fakeAsync(() => {
      productServiceSpy.getProducts.and.returnValue(of(MOCK_PRODUCTS));
      store.loadProducts();
      tick();

      const newProduct: Product = { id: 3, name: 'Product C', price: 30, description: 'Desc C', stock: 10 };
      productServiceSpy.createProduct.and.returnValue(of(newProduct));
      store.createProduct({ name: 'Product C', price: 30, description: 'Desc C', stock: 10 });
      tick();

      expect(store.products().length).toBe(3);
      expect(store.products()).toContain(newProduct);
    }));
  });

  describe('updateProduct()', () => {
    it('should update the product in the state list', fakeAsync(() => {
      productServiceSpy.getProducts.and.returnValue(of(MOCK_PRODUCTS));
      store.loadProducts();
      tick();

      const updated: Product = { ...MOCK_PRODUCTS[0], name: 'Updated A' };
      productServiceSpy.updateProduct.and.returnValue(of(updated));
      store.updateProduct(1, { name: 'Updated A' });
      tick();

      const found = store.products().find(p => p.id === 1);
      expect(found?.name).toBe('Updated A');
    }));
  });

  describe('deleteProduct()', () => {
    it('should remove the product from the state list', fakeAsync(() => {
      productServiceSpy.getProducts.and.returnValue(of(MOCK_PRODUCTS));
      store.loadProducts();
      tick();

      productServiceSpy.deleteProduct.and.returnValue(of(undefined));
      store.deleteProduct(1);
      tick();

      expect(store.products().length).toBe(1);
      expect(store.products().find(p => p.id === 1)).toBeUndefined();
    }));
  });
});
