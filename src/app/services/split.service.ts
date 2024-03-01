import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, splitGeneric } from '../models/splitAPI.model';


@Injectable({
  providedIn: 'root'
})
export class SplitService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getWorkspaces(): Observable<splitGeneric> {
    return this.http.get<splitGeneric>(`${this.apiUrl}/workspaces`);
  }

  //Lists feature flags.
  listFFs(workspaceId: string, offset: number): Observable<splitGeneric> {
    return this.http.get<splitGeneric>(`${this.apiUrl}/list-feature-flags?workspaceId=${workspaceId}&offset=${offset}`);
  }

  // Retrieves the feature flag.
  getUserInfo(id: string) {
    return this.http.get<User>(`${this.apiUrl}/get-user?uid=${id}`);
  }

  // Retrieves the feature flag.
  getGroupInfo(id: string) {
    return this.http.get<User>(`${this.apiUrl}/get-group?uid=${id}`);
  }
}
