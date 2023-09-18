import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curso } from 'src/app/model/curso.model';
import { CursoService } from 'src/app/service/curso.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-cadastrar-curso',
  templateUrl: './cadastrar-curso.component.html',
  styleUrls: ['./cadastrar-curso.component.scss']
})
export class CadastrarCursoComponent implements OnInit {

  formularioCadastroCurso!: FormGroup;
  curso: Curso;
  btnCadastrar = true;

  selectedFile: File | undefined;

  @Output() fileSelected = new EventEmitter<File | undefined>();

  constructor(private localStorageService: LocalStorageService, private formBuilder: FormBuilder,
    private cursoService: CursoService, private snackBar: MatSnackBar) { 

      this.criarFormularioCadastroCurso(new Curso());
  }

  ngOnInit(): void {
  }

  criarFormularioCadastroCurso(curso: Curso){
    this.formularioCadastroCurso = this.formBuilder.group({
      nome: [curso.nome, [Validators.required]],
      instituicao: [curso.instituicao, [Validators.required]],
      logoPath: [curso.logoPath, [Validators.required]],
    })
  }

  setFormularioCadastrorCurso(){
    this.formularioCadastroCurso.patchValue(this.curso); 
  }

  onFileSelected(event: any) {
    const selectedFileLabel = document.getElementById('selectedFileLabel');
    if (selectedFileLabel) {
      const fileName = event.target.files[0].name;
      selectedFileLabel.textContent = `Logotipo selecionado: ${fileName}`;
    }
    
    this.selectedFile = event.target.files[0];
  }

  cadastrar(){
    this.curso = this.formularioCadastroCurso.value;

    this.cursoService.cadastrarCurso(this.curso).subscribe(curso => {
      this.uploadLogo(this.selectedFile, curso.id);
      this.showMessage('Curso cadastrado com sucesso!')
      this.formularioCadastroCurso.disable(); 
      this.btnCadastrar = false;
    }, erro => {
      this.showMessage(erro.error.message)
    });
  }

  uploadLogo(selectedFile: File, idCurso: number) {
    if (selectedFile) {
  
      this.cursoService.uploadCursoLogo(selectedFile, idCurso).subscribe(
        response => {
        },
        error => {
          console.error('Error uploading logo:', error);
        }
      );
    }
  }
  
  showMessage(msg: string): void{
    this.snackBar.open(msg,'X',{
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "top"
    })
  }

}
