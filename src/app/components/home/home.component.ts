import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { Observable, map, take, Subscription } from 'rxjs';
import { TagsObject, URN, featureFlag, ownersObject, splitGeneric } from '../../models/splitAPI.model';
import { SplitService } from '../../services/split.service';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, AfterViewInit {
  wsId: string = '';
  dataSource = new MatTableDataSource<featureFlag>();
  dataStore: any;
  workspaces: Observable<URN[]>;
  environments: Observable<URN[]> | undefined;
  flags: Observable<featureFlag[]> | undefined;
  flagsSubscription: Subscription | undefined
  length:number | undefined;
  mergeAllTags: TagsObject[] = [];
  mergeAllOwners: ownersObject[] = [];

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatTableDataSourcePaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  // Configurable properties for filtering flags active days
  daysActive = [
  {key: " > 7 days", value: 7},
  {key: " > 15 days", value: 15},
  {key: " > 30 days ", value: 30},
  {key: " > 60 days", value: 60},
  {key: " > 90 days", value: 90},
  {key: " > 100 days", value: 100}];
  displayedColumns: string[] = ['name', 'rolloutStatus', 'rolloutStatusTimestamp', 'tags', 'owners'];
  uniqueTags: string[] = [];
  uniqueGroups: string[] = [];

  constructor(private splitService: SplitService, public dataService: DataService) {
    this.workspaces = this.splitService.getWorkspaces().pipe(take(1),map((workspace: splitGeneric) => workspace.objects));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this.flagsSubscription?.unsubscribe();
  }

  async selectWorkspace(wsid: string){
    let offset = 0;
    const limit = 20; // Batch size
    let featureFlags: featureFlag[] = []; // To store concatenated results
    this.wsId = wsid;
    this.mergeAllTags = []; this.mergeAllOwners = [];

    const fetchBatchData = () =>{
      this.flagsSubscription = this.splitService.listFFs(this.wsId, offset).pipe(
        take(1),
        map((flagDef: splitGeneric) =>
          flagDef)).subscribe((flags: splitGeneric) => {
            if(flags && flags.objects) {
              let filteredFlags  = flags.objects.filter((el: featureFlag) =>
              el.rolloutStatus.name === "Ramping" || el.rolloutStatus.name === "100% Released" ||
              el.rolloutStatus.name === "Removed from Code" || el.rolloutStatus.name === "Killed");
              featureFlags.push(...filteredFlags);
            }
            this.dataSource = new MatTableDataSource(featureFlags);
            this.table.renderRows(); // Ramping, 100% Released, Removed from Code, Killed
            featureFlags.map((flag: featureFlag) => {
              if(flag.tags && flag.tags.length > 0) {
                this.mergeAllTags.push(...flag.tags);
              }
              if(flag.owners && flag.owners.length > 0) {
                this.mergeAllOwners.push(...flag.owners);
              }
            });
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.length = this.dataSource.data.length;
            const totalCount = flags.totalCount;
            if (featureFlags.length < totalCount) {
              offset += limit;
              fetchBatchData();
            } else {
              this.dataStore = featureFlags;
              localStorage.setItem('workspaces', JSON.stringify(featureFlags));
              this.calculateTags();
              this.calculateOwners();
            }
          })
    }
    fetchBatchData();
  }

  // function to update the table
  async tableUpdater(flags: featureFlag[]){
    this.dataSource = new MatTableDataSource(flags);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.length = this.dataSource.data.length;
    this.table.renderRows();

    flags.map((flag: featureFlag) => {
      if(flag.tags && flag.tags.length > 0) {
        this.mergeAllTags.push(...flag.tags);
      }
      if(flag.owners && flag.owners.length > 0) {
        this.mergeAllOwners.push(...flag.owners);
      }
    })
    await this.calculateTags();
    await this.calculateOwners();
  }

  filterByTags(tagValue: string){
    let filteredObjects: featureFlag[] = this.dataStore.filter((obj: any) => {
      if(obj.tags && obj.tags.length > 0) return obj.tags.some((tag: any) => tag.name === tagValue);
    });
    this.tableUpdater(filteredObjects);
    this.dataService.changeMessage(tagValue);
    console.log(filteredObjects);
    localStorage.setItem('selectedTag', JSON.stringify(filteredObjects));
  }

  filterByDate(value: any){
    this.mergeAllTags = []; this.mergeAllOwners = [];
    // re-run calculation based on dates selected
    let filteredResults = this.dataStore.filter((el :any) => this.dataService.calculateDiff(el.rolloutStatusTimestamp) > value);
    this.dataSource = new MatTableDataSource(filteredResults);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.length = this.dataSource.data.length;
    this.table.renderRows();

    filteredResults.map((flag: featureFlag) => {
      if(flag.tags && flag.tags.length > 0) {
        this.mergeAllTags.push(...flag.tags);
      }
      if(flag.owners && flag.owners.length > 0) {
        this.mergeAllOwners.push(...flag.owners);
      }
    })
    this.calculateTags();
    this.calculateOwners();
  }

  async calculateTags(){
    this.uniqueTags = [];
    this.mergeAllTags.map((tag: TagsObject) => tag.name)
    .filter((value, index, current_value) => {
      if(current_value.indexOf(value) === index) {
        this.uniqueTags.push(value);
      }
    });
   await this.persistTagsInLocalStorage('records');
  }
  calculateOwners(){
    this.uniqueGroups = [];
    this.mergeAllOwners.map((owner: ownersObject) => owner.type)
      .filter((value, index, current_value) => {
        if(current_value.indexOf(value) === index) {
          this.uniqueGroups.push(value);
        }
      });
  }

  // create JSON object for local storage
  persistTagsInLocalStorage(key: string){
      if(!this.dataService.getAllRecords(key) || this.dataService.getAllRecords(key).length < 1) {
        this.uniqueTags.map((obj: any) => this.dataService.createRecord('records', {tag: obj, slack: '', teams: ''}))
      }
  }
}
