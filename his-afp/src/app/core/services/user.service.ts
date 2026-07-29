import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, CreateUserDTO, CheckUsernameResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  public users = signal<User[]>([]);
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);

  
  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Errore nel recupero dello staff');
        this.loading.set(false);
      }
    });
  }

  /**
   * Verifica disponibilità dello username per AsyncValidator
   */
  checkUsername(username: string): Observable<CheckUsernameResponse> {
    return this.http.get<CheckUsernameResponse>(`${this.apiUrl}/check/${username}`);
  }

  /**
   * Crea un nuovo utente dello staff
   */
  createUser(newUser: CreateUserDTO): Observable<User> {
    return this.http.post<User>(this.apiUrl, newUser).pipe(
      tap(() => this.loadUsers())
    );
  }

  
  updateRole(userId: number, role: UserRole): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/editrole`, { role }).pipe(
      tap(() => this.loadUsers())
    );
  }
}