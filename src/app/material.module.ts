import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatToolbarModule, MatMenuModule, MatIconModule, MatDividerModule,
  MatExpansionModule, MatSidenavModule, MatListModule, MatBottomSheetModule, MatSlideToggleModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatBottomSheetModule,
    MatSlideToggleModule
  ],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatBottomSheetModule,
    MatSlideToggleModule
  ],
})

export class CustomMaterialModule { }
