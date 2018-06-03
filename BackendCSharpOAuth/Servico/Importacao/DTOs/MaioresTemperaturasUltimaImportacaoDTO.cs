using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public class MaioresTemperaturasUltimaImportacaoDTO
    {
        public string NomeColuna { get; set; }
        public decimal MaxValorLeitura { get; set; }
        public decimal MinValorLeitura { get; set; }
    }
}