using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Infra.DTOs
{
    public class PesquisaDTO : QueryPaginacaoDTO
    {
        public string ValorPesquisa { get; set; }
    }
}