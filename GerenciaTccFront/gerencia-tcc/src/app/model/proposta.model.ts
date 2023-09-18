import { Aluno } from "./aluno.model";
import { Professor } from "./professor.model";

export class Proposta{
    id?: number;
    //Envio Colegiado
    numeroProcesso?: string;
    aluno?: Aluno;
    professor?: Professor;
    tema?: string;
    dataEnvioColegiado?: string;
    dataAvaliacaoColegiado?: string;
    statusParecerColegiado?: string;
    observacaoColegiado?: string;
    linkAta?: string;
    statusEtapaEnvioProposta?: Boolean;

    //Desenvolvimento TCC
    dataInicioDesenvolvimento?: string;
    dataFinalDesenvolvimento?: string;
    statusEtapaDesenvolvimento?: Boolean;

    //Qualificação
    dataQualificacao?: string;
    horarioQualificacao?: string;
    localQualificacao?: string;
    //integrantesBancaQualificacao?: Array<Professor>;
    integrantesBancaQualificacao?: any;
    modalidadeQualificacao?: string;
    statusParecerQualificacao?: string;
    statusEtapaQualificacao?: Boolean;

    //Defesa
    dataDefesa?: string;
    horarioDefesa?: string;
    localDefesa?: string;
    integrantesBancaDefesa?: any;
    modalidadeDefesa?: string;
    statusParecerDefesa?: string;
    statusEtapaDefesa?: Boolean;

    //Finalização
    dataEntregaDocumentosFinais?: string;
    statusEtapaFinalizacao?: Boolean;

    statusProposta?: string;

    dataBanca: any;
    local: any;

}