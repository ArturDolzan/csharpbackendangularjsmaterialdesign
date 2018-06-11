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
using System.Globalization;

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

        public List<Importacao> RecuperarImportacoesComparacao(CodigoPadraoDTO dto)
        {
            var registros = _db.Importacao.Where(x=>x.Id != dto.Id);

            var listImportacao = new List<Importacao>();

            foreach (var item in registros)
            {
                var importacao = new Importacao()
                {
                    Carros = item.Carros,
                    DataImportacao = item.DataImportacao,
                    Descricao = item.Descricao,
                    Id = item.Id,
                    Observacao = item.Observacao
                };

                listImportacao.Add(importacao);
            }

            return listImportacao;
        }

        public List<MaioresTemperaturasUltimaImportacaoDTO> RecuperarGraficoBarra()
        {
            var maiorCodigoImportacao = _db.Importacao.Max(x => x.Id);

            var dados = _db.ImportacaoColunas.Where(x=>x.CodigoImportacao == maiorCodigoImportacao).GroupBy(x => new { x.NomeColuna }).Select(x => new
            {
                MaxValorLeitura = x.Max(m => m.ValorLeitura),
                MinValorLeitura = x.Min(m => m.ValorLeitura),
                x.Key.NomeColuna
            }).OrderBy(x => x.NomeColuna).ToList();

            var listMaioresTemperaturas = new List<MaioresTemperaturasUltimaImportacaoDTO>();

            foreach (var item in dados)
            {
                var maioresTemperaturasUltimaImportacaoDTO = new MaioresTemperaturasUltimaImportacaoDTO()
                {
                    NomeColuna = item.NomeColuna,
                    MaxValorLeitura = item.MaxValorLeitura,
                    MinValorLeitura = item.MinValorLeitura
                };

                listMaioresTemperaturas.Add(maioresTemperaturasUltimaImportacaoDTO);
            }

            return listMaioresTemperaturas;
        }

        public List<RecuperarGraficoPizzaDTO> RecuperarGraficoPizza()
        {
            var dados = _db.Importacao.GroupBy(x => new { x.Carros.Id, x.Carros.Descricao }).Select(x => new
            {
                Qtde = x.Count(),
                DescricaoCarro = x.Key.Descricao,
                CodigoCarro = x.Key.Id
            }).OrderBy(x => x.CodigoCarro).ThenBy(x => x.DescricaoCarro).ToList();

            var listRecuperarGraficoPizzaDTO = new List<RecuperarGraficoPizzaDTO>();

            foreach (var item in dados)
            {
                var recuperarGraficoPizzaDTO = new RecuperarGraficoPizzaDTO()
                {
                    CodigoCarro = item.CodigoCarro,
                    DescricaoCarro = item.DescricaoCarro,
                    Qtde = item.Qtde
                };

                listRecuperarGraficoPizzaDTO.Add(recuperarGraficoPizzaDTO);
            }

            return listRecuperarGraficoPizzaDTO;
        }

        public List<RecuperarNomesColunasDTO> RecuperarNomeColunas(RecuperarNomesColunasCargaDTO dto)
        {
            var registros = _db.ImportacaoColunas.Where(x => x.CodigoImportacao == dto.CodigoImportacao).GroupBy(g => g.NomeColuna).Select(x => x.FirstOrDefault()).ToList();

            var listRecuperarNomesColunasDTO = new List<RecuperarNomesColunasDTO>();

            foreach (var item in registros)
            {
                var recuperarNomesColunasDTO = new RecuperarNomesColunasDTO()
                {
                    NomeColuna = item.NomeColuna,
                    CodigoImportacao = item.CodigoImportacao
                };

                listRecuperarNomesColunasDTO.Add(recuperarNomesColunasDTO);
            }

            return listRecuperarNomesColunasDTO;

        }

        public List<RecuperarGraficoDTO> RecuperarGraficoComparacao(RecuperarGraficoCargaComparacaoDTO dto)
        {
            var retorno = _db.ImportacaoColunas.Where(x => x.CodigoImportacao == dto.CodigoImportacaoPrincipal && x.NomeColuna == dto.NomeColuna).Select(p => new
            {
                p.DataLeitura,
                p.ValorLeitura,
                p.CodigoImportacao
            }).OrderBy(p => p.DataLeitura).ToList();

            var listRecuperarGraficoDTO = new List<RecuperarGraficoDTO>();

            foreach (var item in retorno)
            {
                var recuperarGraficoDTO = new RecuperarGraficoDTO()
                {
                    DataLeitura = item.DataLeitura.ToString("dd/MM/yyyy HH:mm:ss"),
                    ValorLeitura = item.ValorLeitura,
                    CodigoImportacao = item.CodigoImportacao
                };

                listRecuperarGraficoDTO.Add(recuperarGraficoDTO);
            }

            foreach (var item in dto.CodigoImportacao)
            {
                var retornoComp = _db.ImportacaoColunas.Where(x => x.CodigoImportacao == item && x.NomeColuna == dto.NomeColuna).Select(p => new
                {
                    p.DataLeitura,
                    p.ValorLeitura,
                    p.CodigoImportacao
                }).OrderBy(p => p.DataLeitura).ToList();

                foreach (var itemRet in retornoComp)
                {
                    var recuperarGraficoCompDTO = new RecuperarGraficoDTO()
                    {
                        DataLeitura = itemRet.DataLeitura.ToString("dd/MM/yyyy HH:mm:ss"),
                        ValorLeitura = itemRet.ValorLeitura,
                        CodigoImportacao = itemRet.CodigoImportacao
                    };

                    listRecuperarGraficoDTO.Add(recuperarGraficoCompDTO);
                }
            }

            return listRecuperarGraficoDTO;
        }

        public List<RecuperarGraficoDTO> RecuperarGrafico(RecuperarGraficoCargaDTO dto)
        {
            var retorno = _db.ImportacaoColunas.Where(x => x.CodigoImportacao == dto.CodigoImportacao && x.NomeColuna == dto.NomeColuna).Select(p => new
            {
                p.DataLeitura,
                p.ValorLeitura,
                p.CodigoImportacao
            }).OrderBy(p => p.DataLeitura).ToList();

            var listRecuperarGraficoDTO = new List<RecuperarGraficoDTO>();

            foreach (var item in retorno)
            {
                var recuperarGraficoDTO = new RecuperarGraficoDTO()
                {
                    DataLeitura = item.DataLeitura.ToString("dd/MM/yyyy HH:mm:ss"),
                    ValorLeitura = item.ValorLeitura,
                    CodigoImportacao = item.CodigoImportacao
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
            var registros = _db.Importacao.Include("Carros").Where(x => x.Descricao.ToUpper().Contains(dto.ValorPesquisa.ToUpper())).OrderByDescending(x => x.Id).Skip((dto.Page - 1) * dto.Limit).Take(dto.Limit);

            var listImportacao = new List<Importacao>();

            foreach (var item in registros)
            {
                var importacao = new Importacao()
                {
                    Carros = item.Carros,
                    DataImportacao = item.DataImportacao,
                    Descricao = item.Descricao,
                    Id = item.Id,
                    Observacao = item.Observacao
                };

                listImportacao.Add(importacao);
            }

            return listImportacao;
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
            var registros = _db.Importacao.Include("Carros").OrderByDescending(x => x.Id).Skip((dto.Page - 1) * dto.Limit).Take(dto.Limit);

            var listImportacao = new List<Importacao>();

            foreach (var item in registros)
            {
                var importacao = new Importacao()
                {
                    Carros = item.Carros,
                    DataImportacao = item.DataImportacao,
                    Descricao = item.Descricao,
                    Id = item.Id,
                    Observacao = item.Observacao
                };

                listImportacao.Add(importacao);
            }

            return listImportacao;

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

            CultureInfo[] cultures = { new CultureInfo("en-US") };


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
                    Decimal v = 0.00M;

                    try
                    {
                        d = Convert.ToDateTime(dataV);
                        v = Convert.ToDecimal(valores.Replace(",", "."), cultures[0]);//Convert.ToDecimal(valores);
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
            var registro = _db.Importacao.Include("Carros").Select(x=> new {
                x.Carros,
                x.DataImportacao,
                x.Descricao,
                x.Id,
                x.Observacao
            }).FirstOrDefault(x => x.Id == dto.Id);

            if (registro == null)
            {
                throw new Exception("Registro " + dto.Id + " não encontrado! ");
            }

            var importacao = new Importacao()
            {
                Carros = registro.Carros,
                DataImportacao = registro.DataImportacao,
                Descricao = registro.Descricao,
                Id = registro.Id,
                Observacao = registro.Observacao
            };

            return importacao;
        }

        public void Remover(CodigoPadraoDTO dto)
        {
            var registro = _db.Importacao.FirstOrDefault(x => x.Id == dto.Id);

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