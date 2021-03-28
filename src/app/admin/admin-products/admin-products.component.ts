import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/app/shared/interfacees/category/category.interface';
import { IProduct } from 'src/app/shared/interfacees/product/product.interface';
import { Product } from 'src/app/shared/models/product/product.model';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  modalRef: BsModalRef;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  category: ICategory;
  name: string;
  description: string;
  price: number;
  image: string;
  productID: string | number;
  adminCategories: ICategory[] = [];
  adminProducts: IProduct[] = [];

  field: string;
  currentProduct: IProduct;
  isAddButton: boolean;
  isSuccess: boolean;
  isFieldEmpty: boolean;

  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.getAdminCategories();
    this.getAdminProducts();
    this.checkEmptyField();
  }

  private getAdminCategories(): void {
    this.categoryService.getJSONCategories().subscribe(
      arrCategories => {
        this.adminCategories = arrCategories;
      },
      error => {
        console.log(error);
      }
    );
  }

  private getAdminProducts(): void {
    this.productService.getJSONProducts().subscribe(
      arrProducts => {
        this.adminProducts = arrProducts;
      },
      error => {
        console.log(error);
      }
    );
  }

  addAdminProducts(): void {
    const NEW_PRODUCT = new Product(this.category, this.name, this.description, this.price, this.image);
    this.productService.postJSONProduct(NEW_PRODUCT).subscribe(
      () => {
        this.getAdminProducts();
      },
      error => {
        console.log(error);
      }
    );
    this.closeModalWithInputs();
  }

  deleteAdminProduct(id: string | number): void {
    this.productService.deleteJSONProduct(id).subscribe(
      () => {
        this.getAdminProducts();
      },
      error => {
        console.log(error);
      }
    );
  }

  editAdminProduct(): void {
    const EDITED_PRODUCT = new Product(this.category, this.name, this.description, this.price, this.image, this.productID);
    this.productService.updateJSONProduct(EDITED_PRODUCT).subscribe(
      () => {
        this.getAdminProducts();
      },
      error => {
        console.log(error);
      }
    );
    this.closeModalWithInputs();
  }

  saveCurrentProduct(product: IProduct): void {
    this.currentProduct = product;
    this.category = product.category;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.image = product.image;
    this.productID = product.id;
  }

  resetField(): void {
    this.category = null;
    this.name = '';
    this.description = '';
    this.price = null;
    this.image = '';
    this.productID = '';
    this.isSuccess = false;
    this.isFieldEmpty = true;
  }

  checkEmptyField(): void {
    if (!this.category || !this.name || !this.description || !this.price) {
      this.isFieldEmpty = true;
      return;
    }
    this.isFieldEmpty = false;
  }

  openModalWithInputs(template: TemplateRef<any>, editStatus: boolean = false) {
    this.modalRef = this.modalService.show(template);
    if (!editStatus) {
      this.isAddButton = true;
      return;
    }
    this.isAddButton = false;
  }

  closeModalWithInputs(): void {
    this.modalRef.hide();
    this.resetField();
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.image = url;
        this.uploadPercent = null;
        this.isSuccess = true;
      });
    });
  }

  openConfirmModal(confirmation: TemplateRef<any>) {
    this.modalRef = this.modalService.show(confirmation, {
      class: 'modal-dialog-centered modal-sm',
    });
  }

  closeConfirmModal(): void {
    this.modalRef.hide();
    this.resetField();
  }
}
