using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using BackendCSharpOAuth.Models.DTOs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Data.Entity;
using System.Web;
using PostgreSQLCopyHelper;
using Npgsql;
using Npgsql.Bulk;

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

        public List<RecuperarGraficoDTO> RecuperarGrafico(RecuperarGraficoCargaDTO dto)
        {
            var retorno = _db.ImportacaoColunas.Where(x => x.CodigoImportacao == dto.CodigoImportacao && x.NomeColuna == dto.NomeColuna).Select(p => new
            {
                p.DataLeitura,
                p.ValorLeitura
            }).OrderBy(p => p.DataLeitura).ToList();

            var listRecuperarGraficoDTO = new List<RecuperarGraficoDTO>();

            foreach (var item in retorno)
            {
                var recuperarGraficoDTO = new RecuperarGraficoDTO()
                {
                    DataLeitura = item.DataLeitura.ToString("dd/MM/yyyy HH:mm:ss"),
                    ValorLeitura = item.ValorLeitura
                };

                listRecuperarGraficoDTO.Add(recuperarGraficoDTO);
            }

            return listRecuperarGraficoDTO;
        }

        public List<Carros> ListarCarros()
        {
            return _servCarros.ListarSearchField();
        }

        public List<Importacao> PesquisarImportacao(PesquisaDTO dto)
        {
            return _db.Importacao.Include("Carros").Where(x => x.Descricao.ToUpper().Contains(dto.ValorPesquisa.ToUpper())).OrderBy(x => x.Id).Skip((dto.Page - 1) * dto.Limit).Take(dto.Limit).ToList();
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

        

        public Importacao Salvar(Importacao importacao, string caminhoArquivo)
        {
            var registro = _db.Importacao.FirstOrDefault(x => x.Id == importacao.Id);

            if (registro == null)
            {
                if (caminhoArquivo != null)
                {
                    using (var stream = new FileStream(caminhoArquivo, FileMode.Open, FileAccess.Read))
                    {
                        using (var reader = new BinaryReader(stream))
                        {
                            importacao.Arquivo = reader.ReadBytes((int)stream.Length);
                        }
                    }
                }

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

                try
                {
                    ImportarDados(caminhoArquivo, importacao.Id);
                }
                catch (Exception e)
                {                    
                    throw new Exception("Erro ao importar arquivo. Erro: " + e.Message);
                }

                importacao.ImportacaoColunas = null;

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

        public void ImportarDados(string arquivo, int codigoImportacao)
        {
            //-- Primeira linha, logo deve verificar as colunas...
            var colunas = File.ReadAllLines(arquivo).Select(x => x.Split(';')).FirstOrDefault();

            var valor = File.ReadAllLines(arquivo).Select(x => x.Split(';')).ToList();
            var listImportacaoColunas = new List<ImportacaoColunas>();

           
            foreach (var itemValor in valor.ToList().Skip(1))
            {
                var dado = itemValor;

                string data = dado[0];
                int controle = 1;
                foreach (var valores in dado.Skip(1).ToList())
                {
                    var coluna = colunas[controle];
                    var dataV = data.Substring(0, data.IndexOf(","));

                    DateTime d = new DateTime();
                    Decimal v = 0M;

                    try
                    {
                        d = Convert.ToDateTime(dataV);
                        v = Convert.ToDecimal(valores);
                    }
                    catch (Exception)
                    {
                        continue;
                    }

                    var importacaoColunas = new ImportacaoColunas
                    {
                        CodigoImportacao = codigoImportacao,
                        DataLeitura = d,
                        NomeColuna = coluna,
                        ValorLeitura = v
                    };

                    listImportacaoColunas.Add(importacaoColunas);

                    controle = controle + 1;
                }
            }


            _db.Database.BeginTransaction();

            foreach (var item in listImportacaoColunas)
            {
                
                var sql = "insert into \"ImportacaoColunas\" (\"NomeColuna\", \"DataLeitura\", \"ValorLeitura\", \"CodigoImportacao\")";
                sql = sql + " values ('" + item.NomeColuna + "', '" + item.DataLeitura + "', " + item.ValorLeitura.ToString().Replace(",", ".") + ", " + item.CodigoImportacao + ") ";

                _db.Database.ExecuteSqlCommand(sql);
            }

            _db.Database.CurrentTransaction.Commit();
           
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

        public void Remover(CodigoPadraoDTO dto)
        {           
            var registro = RecuperarPorId(dto);

            try
            {
                _db.Importacao.Remove(registro);
                _db.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.InnerException.InnerException.Message);
            }

        }

        public TotalPaginacaoDTO RecuperarTotalRegistrosFiltro(PesquisaDTO dto)
        {
            return new TotalPaginacaoDTO
            {
                Quantidade = _db.Importacao.Where(x => x.Descricao.ToUpper().Contains(dto.ValorPesquisa.ToUpper())).Count()
            };
        }
    }
}