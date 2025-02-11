import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
       if (!token) {
      console.error('Authentication token not found'); 
      return new HttpHeaders();
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  authenticateWithToken(token: string): Observable<any> {
    const url = `https://payments.kmf.coop/kmfSquad/api/v1/login/authenticate?token=${token}`;
    console.log("Final API URL:", url); 
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, null, { headers });
  }
  

  getRequest<T>(endpoint: string): Observable<T> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return new Observable(observer => observer.error('Authentication token missing!'));
    }

    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get<T>(url, { headers });
  }

  getVisits(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return new Observable(observer => observer.error('Authentication token missing!'));
    }

    const url = `${this.baseUrl}/visits/sheduleVisit`;
    return this.http.get<any>(url, { headers });
  }

  getVisitDetails(sl_no: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return new Observable(observer => observer.error('Authentication token missing!'));
    }

    const url = `${this.baseUrl}/visits/sheduleVisit?sl_no=${sl_no}`;
    return this.http.get<any>(url, { headers });
  }

  postRequest<T>(endpoint: string, payload: any): Observable<T> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return new Observable(observer => observer.error('Authentication token missing!'));
    }
  
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post<T>(url, payload, { headers });
  }
  
  putRequest<T>(endpoint: string, payload: any): Observable<T> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return new Observable(observer => observer.error('Authentication token missing!'));
    }

    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.put<T>(url, payload, { headers });
  }
  
}
