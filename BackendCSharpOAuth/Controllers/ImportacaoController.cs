using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using BackendCSharpOAuth.Models.DTOs;
using BackendCSharpOAuth.Servico;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace BackendCSharpOAuth.Controllers
{
    public class ImportacaoController : ApiController
    {
        private readonly IServImportacao _servImportacao;

        public ImportacaoController(IServImportacao servImportacao)
        {
            _servImportacao = servImportacao;
        }

        public HttpResponseMessage RecuperarNomeColunas(RecuperarNomesColunasCargaDTO dto)
        {
            try
            {

                var grafico = _servImportacao.RecuperarNomeColunas(dto);

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = grafico, Mensagem = "Colunas grafico recuperadas com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage RecuperarGrafico(RecuperarGraficoCargaDTO dto)
        {
            try
            {

                var grafico = _servImportacao.RecuperarGrafico(dto);

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = grafico, Mensagem = "Grafico recuperado com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage Pesquisar(PesquisaDTO dto)
        {
            try
            {

                var importacao = _servImportacao.PesquisarImportacao(dto);
                var totalRegistros = _servImportacao.RecuperarTotalRegistrosFiltro(dto);

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = importacao, Quantidade = totalRegistros, Mensagem = "Registros recuperados com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage ListarCarros()
        {
            try
            {
                var carros = _servImportacao.ListarCarros();

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = carros, Mensagem = "Registros recuperados com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage Listar(QueryPaginacaoDTO dto)
        {
            try
            {

                var importacao = _servImportacao.Listar(dto);
                var totalRegistros = _servImportacao.RecuperarTotalRegistros();

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = importacao, Quantidade = totalRegistros, Mensagem = "Registros recuperados com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage SalvarImportacao()
        {
            try
            {
                // var retorno = _servImportacao.Salvar(importacao);

                var arquivo = HttpContext.Current.Request.Files[0];
                string fileSavePath = null;

                if (arquivo != null)
                {
                    var di = new DirectoryInfo(HttpContext.Current.Server.MapPath("~/UploadedFiles"));

                    foreach (FileInfo file in di.GetFiles())
                    {
                        file.Delete();
                    }
                    foreach (DirectoryInfo dir in di.GetDirectories())
                    {
                        dir.Delete(true);
                    }

                    fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/UploadedFiles"), arquivo.FileName);

                    if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/UploadedFiles")))
                    {
                        Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/UploadedFiles"));
                    }

                    arquivo.SaveAs(fileSavePath);
                }

                var importacao = new Importacao
                {
                    Carros = new Carros { Id = Convert.ToInt32(HttpContext.Current.Request.Form[4]) },
                    DataImportacao = Convert.ToDateTime(HttpContext.Current.Request.Form[1]).Date,
                    Descricao = Convert.ToString(HttpContext.Current.Request.Form[0]),
                    Id = Convert.ToInt32(HttpContext.Current.Request.Form[2]),
                    Observacao = Convert.ToString(HttpContext.Current.Request.Form[3])
                };

                var retorno = _servImportacao.Salvar(importacao, fileSavePath);

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = retorno, Mensagem = "Registro salvo com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage Salvar(Importacao importacao)
        {
            try
            { 
                var retorno = _servImportacao.Salvar(importacao, null);

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = retorno, Mensagem = "Registro salvo com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage RecuperarPorId(CodigoPadraoDTO dto)
        {
            try
            {
                var retorno = _servImportacao.RecuperarPorId(dto);

                return Request.CreateResponse(HttpStatusCode.OK, new { Content = retorno, Mensagem = "Registro recuperado com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }

        public HttpResponseMessage Remover(CodigoPadraoDTO dto)
        {
            try
            {
                _servImportacao.Remover(dto);

                return Request.CreateResponse(HttpStatusCode.OK, new { Mensagem = "Registro removido com sucesso!" });
            }
            catch (System.Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { Mensagem = e.Message });
            }
        }
    }
}