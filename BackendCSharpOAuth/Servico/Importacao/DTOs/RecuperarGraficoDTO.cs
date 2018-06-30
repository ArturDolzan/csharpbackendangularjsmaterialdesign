using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public class RecuperarGraficoDTO
    {
        public string DataLeitura { get; set; }
        public decimal ValorLeitura { get; set; }
        public int CodigoImportacao { get; set; }
        public int Sequencial { get; set; }
        public int TipoImportacao { get; set; }
        public int CodigoImportacaoPrincipal { get; set; }
        public int CodigoImportacaoSecundaria { get; set; }
    }
}