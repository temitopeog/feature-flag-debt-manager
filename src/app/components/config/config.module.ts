import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigComponent } from './config.component';
import { ConfigRoutingModule } from './config-routing.module';

import { MatTableModule } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule} from '@angular/material/paginator';
import { EditDialogComponentComponent } from '../../dialogs/edit-dialog-component/edit-dialog-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConfigComponent,
    EditDialogComponentComponent
  ],
  imports: [
    CommonModule,
    ConfigRoutingModule,

    MatTableModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule,
    MatSortModule,
    MatButtonModule
  ]
})
export class ConfigModule { }
