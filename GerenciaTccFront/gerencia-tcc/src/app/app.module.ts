import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from  '@angular/common';

import { HeaderComponent } from "./components/template/header/header.component";
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/template/menu/menu.component';
import { PropostaComponent } from './components/proposta/proposta/proposta.component';
import { AplicacaoComponent } from './components/aplicacao/aplicacao.component';
import { ListarAlunosComponent } from './components/aluno/listar-alunos/listar-alunos.component';
import { ListarProfessoresComponent } from './components/professor/listar-professores/listar-professores.component';
import { AppContent } from './components/template/content/content.component';
import { ListarPropostasComponent } from './components/proposta/listar-propostas/listar-propostas.component';
import { EnvioColegiadoComponent } from './components/proposta/etapas/envio-colegiado/envio-colegiado.component';
import { DesenvolvimentoComponent } from './components/proposta/etapas/desenvolvimento/desenvolvimento.component';
import { QualificacaoComponent } from './components/proposta/etapas/qualificacao/qualificacao.component';
import { DefesaComponent } from './components/proposta/etapas/defesa/defesa.component';
import { FinalizacaoComponent } from './components/proposta/etapas/finalizacao/finalizacao.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { ConsultarAlunoComponent } from './components/aluno/consultar-aluno/consultar-aluno.component';
import { ConsultarProfessorComponent } from './components/professor/consultar-professor/consultar-professor.component';
import { ListarCursosComponent } from './components/curso/listar-cursos/listar-cursos.component';
import { ConsultarCursoComponent } from './components/curso/consultar-curso/consultar-curso.component';
import { ListarAreasComponent } from './components/area/listar-areas/listar-areas.component';
import { ConsultarAreaComponent } from './components/area/consultar-area/consultar-area.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CadastrarCursoComponent } from './components/curso/cadastrar-curso/cadastrar-curso.component';
import { CadastrarAreaComponent } from './components/area/cadastrar-area/cadastrar-area.component';
import { MatRadioModule } from '@angular/material/radio';
import { PerfilProfessorComponent } from './components/professor/perfil-professor/perfil-professor.component';
import { PerfilAlunoComponent } from './components/aluno/perfil-aluno/perfil-aluno.component';


const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    CadastroComponent,
    HomeComponent,
    MenuComponent,
    PropostaComponent,
    AplicacaoComponent,
    ListarProfessoresComponent,
    ListarAlunosComponent,
    AppContent,
    ListarPropostasComponent,
    EnvioColegiadoComponent,
    DesenvolvimentoComponent,
    QualificacaoComponent,
    DefesaComponent,
    FinalizacaoComponent,
    ConsultarAlunoComponent,
    ConsultarProfessorComponent,
    ListarCursosComponent,
    ConsultarCursoComponent,
    ListarAreasComponent,
    ConsultarAreaComponent,
    CadastrarCursoComponent,
    CadastrarAreaComponent,
    PerfilProfessorComponent,
    PerfilAlunoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSnackBarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(maskConfig),
    MatSidenavModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule, 
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    CommonModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
