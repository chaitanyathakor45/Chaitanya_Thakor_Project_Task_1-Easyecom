import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];
  isLoading: boolean = false;

  filters = {
    name: '',
    species: '',
    status: '',
    gender: ''
  };

  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchCharacters(this.baseUrl);
  }

  fetchCharacters(url: string) {
    this.isLoading = true;

    this.http.get<any>(url).subscribe(
      data => {
        this.characters = data.results || [];
        this.isLoading = false;

        if (this.characters.length === 0) {
          this.snackBar.open('No characters found.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      },
      error => {
        console.error(error);
        this.isLoading = false;
        this.characters = [];
        this.snackBar.open('Failed to fetch characters. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    );
  }

  searchCharacters() {
    let queryParams: string[] = [];

    if (this.filters.name) {
      queryParams.push(`name=${encodeURIComponent(this.filters.name)}`);
    }
    if (this.filters.species) {
      queryParams.push(`species=${encodeURIComponent(this.filters.species)}`);
    }
    if (this.filters.status) {
      queryParams.push(`status=${encodeURIComponent(this.filters.status)}`);
    }
    if (this.filters.gender) {
      queryParams.push(`gender=${encodeURIComponent(this.filters.gender)}`);
    }

    let url = this.baseUrl;
    if (queryParams.length > 0) {
      url += `/?${queryParams.join('&')}`;
    }

    this.fetchCharacters(url);
  }
}
