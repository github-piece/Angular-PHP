import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule,
    MatIconModule, MatListModule, MatSidenavModule,
    MatToolbarModule, MatCardModule, MatGridListModule, MatMenuModule,
    MatFormFieldModule, MatOptionModule, MatSelectModule, MatTreeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatDialogModule, MatInputModule, MatExpansionModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
@NgModule({

    imports:
        [   MatButtonModule,
            MatCheckboxModule,
            MatIconModule,
            MatListModule,
            MatSidenavModule,
            MatToolbarModule,
            MatCardModule,
            MatGridListModule,
            MatMenuModule,
            MatFormFieldModule,
            MatOptionModule,
            MatSelectModule,
            MatTreeModule,
            MatTableModule,
            MatPaginatorModule,
            MatSortModule,
            MatExpansionModule],
    exports: [
        MatCheckboxModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatCardModule,
        MatGridListModule,
        MatMenuModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatTreeModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatExpansionModule
    ],

})
export class MaterialModule { }

