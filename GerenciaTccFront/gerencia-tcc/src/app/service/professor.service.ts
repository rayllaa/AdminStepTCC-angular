import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Professor } from '../model/professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  url = "http://localhost:8090/professores"

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  consultarProfessorPorUsuario(usuario: String | any): Observable<Professor>{
    var professor = `${this.url}/consultar?usuario=${usuario}`;
    return this.http.get<Professor>(professor);
  }

  cadastrarProfessor(professor: Professor): Observable<Professor>{
    return this.http.post<Professor>(this.url, professor);
  }

  listarProfessores(): Observable<Professor[]>{
    return this.http.get<Professor[]>(this.url)
  }

  atualizarProfessor(professor: Professor): Observable<Professor>{
    return this.http.put<Professor>(`${this.url}/${professor.id}`, professor);
  }
}
