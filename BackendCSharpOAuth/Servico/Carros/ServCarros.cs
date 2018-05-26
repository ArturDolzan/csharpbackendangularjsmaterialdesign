using BackendCSharpOAuth.Infra.DTOs;
using BackendCSharpOAuth.Models;
using BackendCSharpOAuth.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public class ServCarros : IServCarros
    {
        private readonly BancoContext _db;

        public ServCarros()
        {
            _db = new BancoContext();
        }

        public List<Carros> PesquisarCarro(PesquisaDTO dto)
        {
            return _db.Carros.Where(x => x.Descricao.ToUpper().Contains(dto.ValorPesquisa.ToUpper())).OrderBy(x => x.Id).ToList();
        }

        public TotalPaginacaoDTO RecuperarTotalRegistros()
        {
            return new TotalPaginacaoDTO
            {
                Quantidade = _db.Carros.Count()
            };
        }

        public List<Carros> Listar(QueryPaginacaoDTO dto)
        {
            return _db.Carros.OrderBy(x => x.Id).Skip((dto.Page - 1) * dto.Limit).Take(dto.Limit).ToList();
        }

        public Carros Salvar(Carros carros)
        {
            var registro = _db.Carros.FirstOrDefault(x => x.Id == carros.Id);

            if (registro == null)
            {
                try
                {
                    _db.Carros.Add(carros);
                    _db.SaveChanges();
                }
                catch (Exception e)
                {
                    throw new Exception(e.InnerException.InnerException.Message);
                }                

                return carros;
            }

            registro.Descricao = carros.Descricao;
            registro.Ativo = carros.Ativo;

            try
            {
                _db.SaveChanges();
            }
            catch (Exception e)
            {
               throw new Exception(e.InnerException.InnerException.Message);
            }            

            return registro;
        }

        public Carros RecuperarPorId(CodigoPadraoDTO dto)
        {
            var registro = _db.Carros.FirstOrDefault(x => x.Id == dto.Id);

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
                _db.Carros.Remove(registro);
                _db.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.InnerException.InnerException.Message);
            }            

        }

    }
}