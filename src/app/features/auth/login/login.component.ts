import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private erpToken: string | null = null;
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.erpToken = params['token'] || null;  
      if (this.erpToken) {
        this.authenticateAndNavigate();
      } else {
        console.error('Token is missing in the URL!');
        this.loading = false;
      }
    });
  }
  authenticateAndNavigate(): void {
    if (!this.erpToken) {
      console.error('Cannot authenticate without a token!');
      this.loading = false;
      return;
    }
    
    this.apiService.authenticateWithToken(this.erpToken).subscribe({
      next: (response) => {  
        if (response && response.data) {
          localStorage.setItem('authToken', response.data.token);
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
  
          localStorage.setItem('userId', response.data.id.toString()); 
          localStorage.setItem('userName', response.data.name);
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Authentication response does not contain a token.');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Authentication failed:', err);
        this.loading = false;
      }
    });
  }
  
}
