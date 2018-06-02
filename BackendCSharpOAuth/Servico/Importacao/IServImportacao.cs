using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using BackendCSharpOAuth.Models.DTOs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public interface IServImportacao
    {
        List<RecuperarGraficoPizzaDTO> RecuperarGraficoPizza();
        List<RecuperarNomesColunasDTO> RecuperarNomeColunas(RecuperarNomesColunasCargaDTO dto);
        List<Importacao> PesquisarImportacao(PesquisaDTO dto);
        TotalPaginacaoDTO RecuperarTotalRegistros();
        List<Importacao> Listar(QueryPaginacaoDTO dto);
        Importacao Salvar(Importacao importacao, string caminhoArquivo);
        Importacao RecuperarPorId(CodigoPadraoDTO dto);
        List<Carros> ListarCarros();
        void Remover(CodigoPadraoDTO dto);
        TotalPaginacaoDTO RecuperarTotalRegistrosFiltro(PesquisaDTO dto);
        List<RecuperarGraficoDTO> RecuperarGrafico(RecuperarGraficoCargaDTO dto);
    }
}