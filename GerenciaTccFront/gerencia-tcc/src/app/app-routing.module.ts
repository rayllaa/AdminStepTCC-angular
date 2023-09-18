import { AplicacaoComponent } from './components/aplicacao/aplicacao.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PropostaComponent } from './components/proposta/proposta/proposta.component';
import { ListarAlunosComponent } from './components/aluno/listar-alunos/listar-alunos.component';
import { ListarProfessoresComponent } from './components/professor/listar-professores/listar-professores.component';
import { ListarPropostasComponent } from './components/proposta/listar-propostas/listar-propostas.component';
import { ConsultarAlunoComponent } from './components/aluno/consultar-aluno/consultar-aluno.component';
import { ConsultarProfessorComponent } from './components/professor/consultar-professor/consultar-professor.component';
import { ConsultarCursoComponent } from './components/curso/consultar-curso/consultar-curso.component';
import { ListarCursosComponent } from './components/curso/listar-cursos/listar-cursos.component';
import { ListarAreasComponent } from './components/area/listar-areas/listar-areas.component';
import { ConsultarAreaComponent } from './components/area/consultar-area/consultar-area.component';
import { CadastrarAreaComponent } from './components/area/cadastrar-area/cadastrar-area.component';
import { CadastrarCursoComponent } from './components/curso/cadastrar-curso/cadastrar-curso.component';
import { PerfilProfessorComponent } from './components/professor/perfil-professor/perfil-professor.component';
import { PerfilAlunoComponent } from './components/aluno/perfil-aluno/perfil-aluno.component';

const routes: Routes = [
  {
    path:"",
    component: LoginComponent
  },
  {
    path:"app",
    component: AplicacaoComponent
  },
  {
    path:"cadastro",
    component: CadastroComponent
  },
  {
    path:"home",
    component: HomeComponent
  },
  {
    path:"proposta",
    component: PropostaComponent
  },
  {
    path:"propostas",
    component: ListarPropostasComponent
  },
  {
    path:"professores",
    component: ListarProfessoresComponent
  },
  {
    path:"consultar-professor",
    component: ConsultarProfessorComponent
  },
  {
    path:"perfil-professor",
    component: PerfilProfessorComponent
  },
  {
    path:"alunos",
    component: ListarAlunosComponent
  },
  {
    path:"consultar-aluno",
    component: ConsultarAlunoComponent
  },
  {
    path:"perfil-aluno",
    component: PerfilAlunoComponent
  },
  {
    path:"cursos",
    component: ListarCursosComponent
  },
  {
    path:"consultar-curso",
    component: ConsultarCursoComponent
  },
  {
    path:"cadastrar-curso",
    component: CadastrarCursoComponent
  },
  {
    path:"areas",
    component: ListarAreasComponent
  },
  {
    path:"consultar-area",
    component: ConsultarAreaComponent
  },
  {
    path:"cadastrar-area",
    component: CadastrarAreaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
