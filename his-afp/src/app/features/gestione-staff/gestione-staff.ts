import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { usernameAvailableValidator } from '../../core/validators/username.validator';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-gestione-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestione-staff.html',
  styleUrls: ['./gestione-staff.scss']
})
export class GestioneStaffComponent implements OnInit {
  public userService = inject(UserService);
  private fb = inject(FormBuilder);

  staffForm!: FormGroup;
  roles: UserRole[] = ['DOC', 'INF', 'AMM'];
  successMessage: string | null = null;

  ngOnInit(): void {
    this.userService.loadUsers();

    this.staffForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(3)],
        [usernameAvailableValidator(this.userService)]
      ],
      role: ['DOC' as UserRole, [Validators.required]]
    });
  }

  get usernameControl() {
    return this.staffForm.get('username');
  }

  onSubmit(): void {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    this.userService.createUser(this.staffForm.value).subscribe({
      next: () => {
        this.successMessage = 'Utente creato con successo!';
        this.staffForm.reset({ role: 'DOC' });
        setTimeout(() => (this.successMessage = null), 4000);
      }
    });
  }

  onRoleChange(userId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value as UserRole;

    this.userService.updateRole(userId, newRole).subscribe();
  }

  trackById(index: number, item: User): number {
    return item.id ?? index;
  }

  trackByRole(index: number, item: UserRole): string {
    return item;
  }
}