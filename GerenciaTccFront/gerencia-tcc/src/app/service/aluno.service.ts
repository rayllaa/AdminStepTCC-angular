import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Aluno } from '../model/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  url = "http://localhost:8090/alunos"

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  consultarAlunoPorUsuario(usuario: String | any): Observable<Aluno>{
    var aluno = `${this.url}/consultar?usuario=${usuario}`;
    return this.http.get<Aluno>(aluno);
  }

  cadastrarAluno(aluno: Aluno): Observable<Aluno>{
    return this.http.post<Aluno>(this.url, aluno);
  }

  listarAlunos(): Observable<Aluno[]>{
    return this.http.get<Aluno[]>(this.url)
  }

  atualizarAluno(aluno: Aluno): Observable<Aluno>{
    return this.http.put<Aluno>(`${this.url}/${aluno.id}`, aluno);
  }
}
