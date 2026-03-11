import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts()', () => {
    it('should return the list of initial mock products', (done) => {
      service.getProducts().subscribe(products => {
        expect(products).toBeTruthy();
        expect(products.length).toBe(4);
        done();
      });
    });

    it('should return an array of Product objects', (done) => {
      service.getProducts().subscribe(products => {
        products.forEach(p => {
          expect(p.id).toBeDefined();
          expect(p.name).toBeDefined();
          expect(p.price).toBeDefined();
          expect(p.stock).toBeDefined();
        });
        done();
      });
    });
  });

  describe('getProductById()', () => {
    it('should return a product that matches the given id', (done) => {
      service.getProductById(1).subscribe(product => {
        expect(product).toBeTruthy();
        expect(product.id).toBe(1);
        done();
      });
    });

    it('should throw an error for a non-existent id', () => {
      expect(() => service.getProductById(9999)).toThrowError('Product not found');
    });
  });

  describe('createProduct()', () => {
    it('should create a new product and assign a unique id', (done) => {
      const newProduct: Omit<Product, 'id'> = {
        name: 'Test Product',
        price: 99.99,
        description: 'A test product',
        stock: 5
      };
      service.createProduct(newProduct).subscribe(product => {
        expect(product).toBeTruthy();
        expect(product.id).toBeGreaterThan(0);
        expect(product.name).toBe('Test Product');
        done();
      });
    });

    it('should add the new product to the list', (done) => {
      const newProduct: Omit<Product, 'id'> = {
        name: 'Another Product',
        price: 49.99,
        description: 'Another test',
        stock: 10
      };
      service.createProduct(newProduct).subscribe(() => {
        service.getProducts().subscribe(products => {
          const found = products.find(p => p.name === 'Another Product');
          expect(found).toBeTruthy();
          done();
        });
      });
    });
  });

  describe('updateProduct()', () => {
    it('should update the name of an existing product', (done) => {
      service.updateProduct(1, { name: 'Updated Name' }).subscribe(updated => {
        expect(updated.name).toBe('Updated Name');
        expect(updated.id).toBe(1);
        done();
      });
    });

    it('should throw an error when updating a non-existent product', () => {
      expect(() => service.updateProduct(9999, { name: 'Ghost' })).toThrowError('Product not found');
    });
  });

  describe('deleteProduct()', () => {
    it('should remove the product from the list', (done) => {
      service.deleteProduct(1).subscribe(() => {
        service.getProducts().subscribe(products => {
          const found = products.find(p => p.id === 1);
          expect(found).toBeUndefined();
          done();
        });
      });
    });

    it('should return void on successful deletion', (done) => {
      service.deleteProduct(2).subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });
});
