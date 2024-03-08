import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { URN, User, splitGeneric } from '../models/splitAPI.model';


@Injectable({
  providedIn: 'root'
})
export class SplitService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  // Connect to the server & get all workspaces information
  getWorkspaces(): Observable<splitGeneric> {
    return this.http.get<splitGeneric>(`${this.apiUrl}/workspaces`);
  }

  // Connect to the server & get all environments information
  getEnv(workspace: string): Observable<URN[]> {
    console.log('getEnv', workspace);
    return this.http.get<URN[]>(`${this.apiUrl}/envs?workspace=${workspace}`);
  }

  // Connect to the server & get all environments information
  getSplitDef(workspace: string, environment: string, offset: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/splitDefs?workspace=${workspace}&offset=${offset}&environment=${environment}`);
  }

  // Connect to the server & lists feature flags.
  listFFs(workspaceId: string, offset: number): Observable<splitGeneric> {
    return this.http.get<splitGeneric>(`${this.apiUrl}/list-feature-flags?workspaceId=${workspaceId}&offset=${offset}`);
  }

  // Connect to the server & retrieves the user info that created the feature flag.
  getUserInfo(id: string) {
    return this.http.get<User>(`${this.apiUrl}/get-user?uid=${id}`);
  }

  // Connect to the server & retrieves the group info that created the feature flag.
  getGroupInfo(id: string) {
    return this.http.get<User>(`${this.apiUrl}/get-group?uid=${id}`);
  }
}
