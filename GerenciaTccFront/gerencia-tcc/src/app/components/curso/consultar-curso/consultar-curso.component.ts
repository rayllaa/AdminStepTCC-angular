import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curso } from 'src/app/model/curso.model';
import { CursoService } from 'src/app/service/curso.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-consultar-curso',
  templateUrl: './consultar-curso.component.html',
  styleUrls: ['./consultar-curso.component.scss']
})
export class ConsultarCursoComponent implements OnInit {

  formularioConsultaCurso!: FormGroup;
  curso: Curso;

  btnEditar = 'editar';

  selectedFile: File | undefined;

  @Output() fileSelected = new EventEmitter<File | undefined>();

  constructor(private localStorageService: LocalStorageService, private formBuilder: FormBuilder,
    private cursoService: CursoService, private snackBar: MatSnackBar) {
    this.curso = this.localStorageService.get('consultar-curso');
    this.criarFormularioConsultaCurso(new Curso());
    this.setFormularioConsultarCurso();
  }

  ngOnInit(): void {
  }

  criarFormularioConsultaCurso(curso: Curso) {
    this.formularioConsultaCurso = this.formBuilder.group({
      id: [curso.id, [Validators.required]],
      nome: [curso.nome, [Validators.required]],
      instituicao: [curso.instituicao, [Validators.required]],
      logoPath: [curso.logoPath, [Validators.required]],
      logo: [curso.logo, [Validators.required]]
    })
  }

  setFormularioConsultarCurso() {
    this.formularioConsultaCurso.patchValue(this.curso);
    this.formularioConsultaCurso.disable();
  }

  editar(formulario: FormGroup<any>) {
    if (this.btnEditar == 'salvar') {
      this.atualizarCurso(formulario)
    }

    if (this.btnEditar == 'editar') {
      formulario.enable();
      formulario.get('id').disable()
      this.btnEditar = 'salvar'
    }
  }

  atualizarCurso(formulario: FormGroup<any>) {
    var curso = { ...this.curso, ...formulario.value };

    this.cursoService.atualizarCurso(curso).subscribe(c => {
      this.uploadLogo(this.selectedFile, this.curso.id);
      this.formularioConsultaCurso.disable();
      this.btnEditar = 'editar'
      this.showMessage('Curso atualizado com sucesso!')
    }, erro => {
      this.showMessage(erro.error.message)
    });

  }

  uploadLogo(selectedFile: File, idCurso: number) {
    if (selectedFile) {
      this.cursoService.uploadCursoLogo(selectedFile, idCurso).subscribe(
        response => {
          this.atualizarFormulario(idCurso)

          console.log('Logo uploaded successfully:', response);
        },
        error => {
          console.error('Error uploading logo:', error);
        }
      );
    }
  }

  atualizarFormulario(id: any) {
    this.curso = null;
    this.cursoService.consultarCurso(id).subscribe(curso => {
      this.curso = curso;
      this.cursoService.getLogo(curso.id).subscribe(imgBytes => {
        var imageSrc = `data:image/jpeg;base64,${this.arrayBufferToBase64(imgBytes)}`;
        this.curso.logo = imageSrc;
      })
    }, erro => {
      this.showMessage(erro.error.message)
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = new Uint8Array(buffer);
    const bytes = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
    return btoa(bytes);
  }

  onFileSelected(event: any) {
    const selectedFileLabel = document.getElementById('selectedFileLabel');
    if (selectedFileLabel) {
      const fileName = event.target.files[0].name;
      selectedFileLabel.textContent = `Logotipo selecionado: ${fileName}`;
    }

    this.selectedFile = event.target.files[0];

    this.formularioConsultaCurso.get('logoPath').setValue(this.selectedFile.name)
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }

}
