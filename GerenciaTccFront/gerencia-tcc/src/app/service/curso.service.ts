import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../model/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  url = "http://localhost:8090/cursos"

  constructor(private http: HttpClient) { }

  listarCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.url)
  }

  consultarCurso(id: String | any): Observable<Curso> {
    var curso = `${this.url}/${id}`;
    return this.http.get<Curso>(curso);
  }

  cadastrarCurso(curso: any): Observable<Curso> {
    return this.http.post<Curso>(this.url, curso);
  }

  uploadCursoLogo(file: File, idCurso: any): Observable<ArrayBuffer> {
    const url = `${this.url}/upload-logo?id=${idCurso}`;

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ArrayBuffer>(url, formData);
  }

  getLogo(idCurso: any): Observable<ArrayBuffer> {
    const url = `${this.url}/logo/${idCurso}`;

    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  atualizarCurso(curso: Curso): Observable<Curso> {
    return this.http.patch<Curso>(`${this.url}/${curso.id}`, curso);
  }

  excluirCurso(curso: Curso): Observable<Curso> {
    return this.http.delete<Curso>(`${this.url}/${curso.id}`);
  }
}
