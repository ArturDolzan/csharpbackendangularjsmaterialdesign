using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using BackendCSharpOAuth.Models.DTOs;
using BackendCSharpOAuth.Servico;
using System;
using System.Collections.Generic;
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

        public HttpResponseMessage Salvar(Importacao importacao)
        {
            try
            {
                var retorno = _servImportacao.Salvar(importacao);

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
    }
}