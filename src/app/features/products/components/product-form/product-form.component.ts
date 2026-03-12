import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
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
