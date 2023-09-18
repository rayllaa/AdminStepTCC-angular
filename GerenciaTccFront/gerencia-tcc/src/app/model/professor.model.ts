import { Usuario } from "./usuario.model";

export class Professor extends Usuario{
    areaAtuacao?: string;
    areasInteresse?: any;
    disciplinasMinistradas?: string;
    cargo?: string;
}