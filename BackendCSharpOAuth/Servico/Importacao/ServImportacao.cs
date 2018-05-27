using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using BackendCSharpOAuth.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public class ServImportacao: IServImportacao
    {
        private readonly BancoContext _db;
        private readonly IServCarros _servCarros;

        public ServImportacao(IServCarros servCarros)
        {
            _db = new BancoContext();
            _servCarros = servCarros;
        }

        public List<Carros> ListarCarros()
        {
            return _servCarros.ListarSearchField();
        }

        public List<Importacao> PesquisarImportacao(PesquisaDTO dto)
        {
            return _db.Importacao.Where(x => x.Descricao.ToUpper().Contains(dto.ValorPesquisa.ToUpper())).OrderBy(x => x.Id).Skip((dto.Page - 1) * dto.Limit).Take(dto.Limit).ToList();
        }

        public TotalPaginacaoDTO RecuperarTotalRegistros()
        {
            return new TotalPaginacaoDTO
            {
                Quantidade = _db.Importacao.Count()
            };
        }

        public List<Importacao> Listar(QueryPaginacaoDTO dto)
        {
            return _db.Importacao.Include("Carros").OrderBy(x => x.Id).Skip((dto.Page - 1) * dto.Limit).Take(dto.Limit).ToList();
        }

        public Importacao Salvar(Importacao importacao)
        {
            var registro = _db.Importacao.FirstOrDefault(x => x.Id == importacao.Id);

            if (registro == null)
            {
                try
                {
                    _db.Importacao.Add(importacao);
                    _db.Carros.Attach(importacao.Carros);
                    _db.SaveChanges();
                }
                catch (Exception e)
                {
                    throw new Exception(e.InnerException.InnerException.Message);
                }

                return importacao;
            }

            registro.Descricao = importacao.Descricao;
            registro.Carros = importacao.Carros;
            registro.DataImportacao = importacao.DataImportacao;
            registro.Observacao = importacao.Observacao;
            

            try
            {
                _db.Carros.Attach(registro.Carros);
                _db.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.InnerException.InnerException.Message);
            }

            return registro;
        }

        public Importacao RecuperarPorId(CodigoPadraoDTO dto)
        {
            var registro = _db.Importacao.Include("Carros").FirstOrDefault(x => x.Id == dto.Id);

            if (registro == null)
            {
                throw new Exception("Registro " + dto.Id + " não encontrado! ");
            }

            return registro;
        }
    }
}