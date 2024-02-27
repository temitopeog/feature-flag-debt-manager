import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { EditDialogComponentComponent } from 'src/app/dialogs/edit-dialog-component/edit-dialog-component.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  records: any[] = [];
  displayedColumns = ['id', 'tag', 'slack', 'teams', 'actions'];
  dataSource: any | null;
  index: number | undefined;
  id: number  | undefined;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatTableDataSourcePaginator;
  @ViewChild(MatTable) table!: MatTable<any>;


  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  @ViewChild('filter', { static: true })
  filter!: ElementRef;

  constructor(private crudService: DataService,  public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.records = this.crudService.getAllRecords('records');
    console.log(this.records);
    this.dataSource = new MatTableDataSource(this.records);
  }

  startEdit(i: number, tag: string, slack: string, teams: string) {
    this.id = i;
    console.log({id: this.id, tag: tag, slack: slack, teams: teams});
    const dialogRef = this.dialog.open(EditDialogComponentComponent, {
      data: {id: this.id, tag: tag, slack: slack, teams: teams}
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.records[i] = res;
        this.dataSource = new MatTableDataSource(this.records);
        this.table.renderRows();
      }
    });
  }
}
