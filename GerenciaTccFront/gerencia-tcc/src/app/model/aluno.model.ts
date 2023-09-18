import { Curso } from "./curso.model";
import { Usuario } from "./usuario.model";

export class Aluno extends Usuario{
    anoIngresso?: string;
    semestreAtual?: string;
    curso?: any;
    nomeCurso?: string;
    areasInteresse?: any;
    cargo?: string;
    statusProposta?: string;
}