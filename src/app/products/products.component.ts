import {Component, inject, OnInit} from '@angular/core';
import {Product, ProductsService} from './service/products.service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  private readonly productsService = inject(ProductsService);

  protected products: Product[] | undefined = undefined

  ngOnInit() {
    this.productsService.getProducts().subscribe({
        next: (products) => {
          console.log(products);
          this.products = products;
        },
        error: (error) => {
          console.log(error);
        },
      }
    )
  }
}
