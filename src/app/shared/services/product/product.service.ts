import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../../interfacees/product/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3000/products';
  }

  getJSONProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.url);
  }

  postJSONProduct(product: IProduct): Observable<void> {
    return this.http.post<void>(this.url, product);
  }

  deleteJSONProduct(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  updateJSONProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.url}/${product.id}`, product);
  }
}
