import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { Observable, Subscription, map, take } from 'rxjs';
import { URN, splitGeneric } from 'src/app/models/splitAPI.model';
import { DataService } from 'src/app/services/data.service';
import { SplitService } from 'src/app/services/split.service';

@Component({
  selector: 'app-flags',
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.scss']
})
export class FlagsComponent {
  workspaces: Observable<URN[]> | undefined;
  environments: Observable<URN[]> | undefined;
  wid: string = "";
  envid: string = "";
  dataSource = new MatTableDataSource<any>();
  dataStore: any;
  length:number | undefined;
  flagsSubscription: Subscription | undefined
  displayedColumns: string[] = ['name', 'lastUpdateTime', 'status', 'creator'];
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatTableDataSourcePaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  constructor(private splitService: SplitService, public dataService: DataService) {
    this.workspaces = this.splitService.getWorkspaces().pipe(take(1),map((workspace: splitGeneric) => workspace.objects));
  }

  async selectWorkspace(wsid: string){
    this.wid = wsid;
    this.environments = this.splitService.getEnv(wsid).pipe(take(1), map((env: URN[]) => env));
  }

  setEnv(env: URN){
    let offset = 0;
    this.envid = env.id;
    let featureFlags : any = [];
    let limit = 30;
    const fetchBatchData = () =>{
      this.flagsSubscription = this.splitService.getSplitDef(this.wid, this.envid, offset).pipe(
        take(1),
        map((flagDef: any) =>
          flagDef)).subscribe((res: any) => {
            if(res && res.flags) {
              res.flags.map((flag: any) => {
                featureFlags.push(flag);
              })
            }
            this.dataSource = new MatTableDataSource(featureFlags);
            this.table.renderRows();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.length = this.dataSource.data.length;
            const totalCount = res.totalCount;
            if (featureFlags.length < totalCount) {
              offset += limit;
              fetchBatchData();
            } else {
              this.dataStore = featureFlags;
            }
          })
    }
    fetchBatchData();
  }

  enrich(){

  }
}
