import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-edit-dialog-component',
  templateUrl: './edit-dialog-component.component.html',
  styleUrls: ['./edit-dialog-component.component.scss']
})
export class EditDialogComponentComponent {

  editedForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder,
  public dialogRef: MatDialogRef<EditDialogComponentComponent>, private dataService: DataService) {
    this.editedForm = this.fb.group({
      slack: data.slack,
      teams: data.teams,
      id: data.id,
      tag: data.tag
    });
  }

  get slack(): any {
    return this.editedForm.get('slack');
  }

  get teams(): any {
    return this.editedForm.get('teams');
  }

  updateForm(): any {
    if (this.editedForm.invalid) {
      return;
    }
    // make call to DataService to persist data.
    this.dataService.updateRecord('records', this.data.id, this.editedForm.value)
    // response to parent component.
    this.dialogRef.close(this.editedForm.value);
  }


}
