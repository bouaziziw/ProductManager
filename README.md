# Angular Product CRUD implementation

I have successfully built a robust Product CRUD application in Angular following Clean Architecture principles.

## 🚀 Accomplishments

### 🎨 Design & UI

- Integrated **Tailwind CSS v3** for a modern, responsive, and premium look.
- Implemented a **Global Layout** with a shared [HeaderComponent](file:///d:/formations/angular/tuto-projet/src/app/shared/components/header/header.component.ts#4-32).
- Created aesthetic and user-friendly views:
  - **Product List**: Grid view with loading states, empty states, and stock status indicators.
  - **Product Form**: Reactive forms with validation for creating and editing products.
  - **Product Detail**: A dedicated view for singular product information with action buttons.

### 🏗️ Architecture & Logic

- **Clean Architecture**: Organized into `core` (interceptors), `shared` (reusable components), and `features/products` (domain logic).
- **Zoneless Mode**: Configured the app to use `provideZonelessChangeDetection()`, removing the dependency on `zone.js` for better performance and smaller bundles.
- **State Management**: Implemented a [ProductStore](file:///d:/formations/angular/tuto-projet/src/app/features/products/store/product.store.ts#13-100) using **Angular Signals** for reactive state handling.
- **API Simulation**: Built a [ProductService](file:///d:/formations/angular/tuto-projet/src/app/features/products/services/product.service.ts#6-55) that mocks CRUD operations with delayed observables to simulate real-world backend behavior.

### 🛡️ Routing & Server

- **Lazy Loading**: Configured routes to lazy-load feature components for optimal initial bundle size.
- **SSR/Hydration Fix**: Resolved hydration mismatch errors (`NG0500`) by syncing [main.server.ts](file:///d:/formations/angular/tuto-projet/src/main.server.ts) with [AppComponent](file:///d:/formations/angular/tuto-projet/src/app/app.component.ts#5-26) and removing legacy boilerplate files.
- **Server Routing**: Optimized [app.routes.server.ts](file:///d:/formations/angular/tuto-projet/src/app/app.routes.server.ts) to use `RenderMode.Server`, resolving build issues with dynamic route parameters.

## 🧪 Verification Results

### Automated Tests

- **ProductService**: 100% test coverage for all CRUD operations ([getProducts](file:///d:/formations/angular/tuto-projet/src/app/features/products/services/product.service.ts#22-26), [getProductById](file:///d:/formations/angular/tuto-projet/src/app/features/products/services/product.service.ts#27-33), [createProduct](file:///d:/formations/angular/tuto-projet/src/app/features/products/services/product.service.ts#34-40), [updateProduct](file:///d:/formations/angular/tuto-projet/src/app/features/products/store/product.store.ts#69-84), [deleteProduct](file:///d:/formations/angular/tuto-projet/src/app/features/products/store/product.store.ts#85-99)).
- **ProductStore**: Verified state transitions for loading, success, and error scenarios.

### Build Verification

- Successfully generated browser and server bundles.
- **Tailwind CSS** successfully compiled into [styles.css](file:///d:/formations/angular/tuto-projet/src/styles.css) (verified bundle size).
- Prerendering completed for static routes.

## 🛠️ How to run

1. To start the development server:
   ```bash
   npm start
   ```
2. To run the test suite:
   ```bash
   npm test
   ```
