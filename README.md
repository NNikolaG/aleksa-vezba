# AleksaVezba

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.14.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

# Uputstvo za početnike (srpski)

Ovaj projekat je primer Angular aplikacije koja koristi standalone komponente, rutiranje (Angular Router), i HTTP klijent za dohvat podataka. U nastavku su sažete najvažnije informacije: kako pokrenuti projekat, kako je organizovano rutiranje, gde se nalazi konfiguracija, kako se podaci dohvaćaju i prikazuju, i kako da proširite projekat.

## 1. Pokretanje i instalacija

- Instalacija zavisnosti:
  ```bash
  npm install
  ```
- Pokretanje dev servera:
  ```bash
  npm start
  # ili
  ng serve
  ```
- Otvorite http://localhost:4200 u pregledaču.

## 2. Struktura projekta (sa fokusom na ključne fajlove)

- `src/main.ts` – ulazna tačka aplikacije; pokreće aplikaciju preko `bootstrapApplication(AppComponent, appConfig)`.
- `src/app/app.config.ts` – globalna konfiguracija aplikacije (standalone pristup):
  - `provideRouter(routes)` – registruje rute iz `app.routes.ts`.
  - `provideHttpClient()` – omogućava injektovanje `HttpClient` u servisima/komponentama.
- `src/app/app.routes.ts` – definicija ruta aplikacije:
  - `/home` → `HomeComponent`
  - `/about` → `AboutComponent`
  - `/products` → `ProductsComponent`
  - `/contact` → `ContactComponent`
  - prazna ruta (`''`) preusmerava na `/home`, i wildcard (`**`) takođe.
- `src/environments/environment.ts` – konfiguracija okruženja (npr. `apiUrl` za backend).
- Komponente:
  - `AppComponent` – korenska komponenta, sadrži navigaciju i `<router-outlet>`.
  - `HomeComponent`, `AboutComponent`, `ContactComponent` – statične stranice.
  - `ProductsComponent` – prikaz liste proizvoda dohvaćenih sa API-ja.
- Servis:
  - `ProductsService` – koristi `HttpClient` za poziv REST endpoint-a.

## 3. Rutiranje (Routing)

Fajl: `src/app/app.routes.ts`

Primer definicija ruta:
```ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsComponent },
  { path: '**', redirectTo: '/home' }
];
```

Korišćenje u šablonu (navigacija):
```html
<nav class="nav">
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a routerLink="/about" routerLinkActive="active">About</a>
  <a routerLink="/products" routerLinkActive="active">Products</a>
  <a routerLink="/contact" routerLinkActive="active">Contact</a>
</nav>
<router-outlet></router-outlet>
```

## 4. Konfiguracija (Environment)

Fajl: `src/environments/environment.ts`
```ts
export const environment = {
  production: false,
  apiUrl: 'https://68a70e4a639c6a54e9a0d231.mockapi.io/api/v1'
};
```
- `apiUrl` je baza za sve HTTP pozive. Po potrebi promenite URL na svoj backend.
- Za produkciju, tipično postoji i `environment.prod.ts` (ovde ga nema); možete ga dodati po potrebi uz Angular build konfiguraciju.

## 5. Dohvatanje podataka (HTTP)

Servis: `src/app/products/service/products.service.ts`
```ts
@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }
}
```
Napomena: Endpoint je `/products` (ispravljeno). Ako menjate backend, vodite računa da ruta postoji i vraća listu proizvoda u formatu koji odgovara interfejsu `Product`.

Registracija `HttpClient` je već obezbeđena u `app.config.ts` preko `provideHttpClient()`.

## 6. Prikaz podataka u komponenti

Komponenta: `src/app/products/products.component.ts`
- U `ngOnInit()` se pretplaćujemo na `getProducts()` i punimo lokalno stanje `products`.
- Šablon koristi Angular novu kontrolu toka `@for` za iteraciju.

Šablon: `src/app/products/products.component.html`
```html
<div class="product-grid">
  @for (product of products; track product.id) {
    <div class="product-card">
      <h3>{{ product?.name }}</h3>
      <p>{{ product?.material }}</p>
      <small>{{ product?.description }}</small>
      <div class="image">
        <img [src]="product?.image" alt="product" />
      </div>
    </div>
  }
</div>
```

Saveti:
- U realnim aplikacijama, razmotrite `async` pajp sa `signals`/`toSignal()` ili `RxJS` operatorima, umesto ručnog `subscribe`, kako biste olakšali upravljanje memorijom.
- Dodajte stanja učitavanja i greške (npr. `isLoading`, `errorMessage`) za bolji UX.

## 7. Dodavanje nove stranice (primer)

1) Generišite komponentu:
```bash
ng generate component features/orders
```
2) Dodajte rutu u `app.routes.ts`:
```ts
import { Routes } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';

export const routes: Routes = [
  // ... postojeće rute
  { path: 'orders', component: OrdersComponent }
];
```
3) Dodajte link u navigaciju (`app.component.html`):
```html
<a routerLink="/orders" routerLinkActive="active">Orders</a>
```

## 8. Česte greške i rešavanje problema

- 404 na API pozivu: proverite `environment.apiUrl` i tačnu putanju endpoint-a (`/products`).
- CORS greške: omogućite CORS na backendu ili koristite proxy konfiguraciju u Angular-u.
- `HttpClient` nije dostupan: proverite da li je `provideHttpClient()` u `app.config.ts`.
- Prazna stranica: proverite da li je `<router-outlet>` prisutan i rute pravilno definisane.

## 9. Korisne skripte

- Pokretanje development servera: `npm start`
- Produkcioni build: `npm run build` ili `ng build`

## 10. Verzije i tehnologije

- Angular (standalone komponente)
- Angular Router
- HttpClient
- TypeScript

Srećan rad! Ako vam treba detaljnija pomoć (guard-ovi, lazy loading moduli, interceptori, forme), ovo se lako može proširiti na osnovu postojeće strukture.
