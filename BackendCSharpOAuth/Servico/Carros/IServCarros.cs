using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using BackendCSharpOAuth.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public interface IServCarros
    {
        List<Carros> PesquisarCarro(PesquisaDTO dto);
        TotalPaginacaoDTO RecuperarTotalRegistros();
        TotalPaginacaoDTO RecuperarTotalRegistrosFiltro(PesquisaDTO dto);
        List<Carros> Listar(QueryPaginacaoDTO dto);
        Carros Salvar(Carros carros);
        Carros RecuperarPorId(CodigoPadraoDTO dto);
        void Remover(CodigoPadraoDTO dto);
    }
}