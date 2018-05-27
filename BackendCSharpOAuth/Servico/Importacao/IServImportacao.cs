using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public interface IServImportacao
    {
        List<Importacao> PesquisarImportacao(PesquisaDTO dto);
        TotalPaginacaoDTO RecuperarTotalRegistros();
        List<Importacao> Listar(QueryPaginacaoDTO dto);
        Importacao Salvar(Importacao importacao);
    }
}