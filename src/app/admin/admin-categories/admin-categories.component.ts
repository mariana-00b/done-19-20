import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/app/shared/interfacees/category/category.interface';
import { Category } from 'src/app/shared/models/category/category.model';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {
  modalRef: BsModalRef;

  name: string;
  categoryID: string | number;
  adminCategories: ICategory[] = [];

  field: string;
  currentCategory: ICategory;
  isAddButton: boolean;
  isFieldEmpty: boolean;

  constructor(
    private modalService: BsModalService,
    private categoryService: CategoryService
    ) {}

  ngOnInit(): void {
    this.getAdminCategories();
    this.checkEmptyField(this.name);
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

  addAdminCategory(): void {
    const NEW_CATEGORY = new Category(this.name);
    this.categoryService.postJSONCategory(NEW_CATEGORY).subscribe(
      () => {
        this.getAdminCategories();
      },
      error => {
        console.log(error);
      }
    );
    this.closeModalWithInputs();
  }

  deleteAdminCategory(id: string | number): void {
    this.categoryService.deleteJSONCategory(id).subscribe(
      () => {
        this.getAdminCategories();
      },
      error => {
        console.log(error);
      }
    );
  }

  editAdminCategory(): void {
    const EDITED_CATEGORY = new Category(this.name, this.categoryID);
    this.categoryService.updateJSONCategory(EDITED_CATEGORY).subscribe(
      () => {
        this.getAdminCategories();
      },
      error => {
        console.log(error);
      }
    );
    this.closeModalWithInputs();
  }

  saveCurrentCategory(category: ICategory): void {
    this.currentCategory = category;
    this.name = category.name;
    this.categoryID = category.id;
  }

  resetField(): void {
    this.name = '';
    this.categoryID = '';
  }

  checkEmptyField(value: string): void {
    if (!value) {
      this.isFieldEmpty = true;
      return;
    }
    this.isFieldEmpty = false;
  }
  
  showEditButton(): void {
    this.isAddButton = false;
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
