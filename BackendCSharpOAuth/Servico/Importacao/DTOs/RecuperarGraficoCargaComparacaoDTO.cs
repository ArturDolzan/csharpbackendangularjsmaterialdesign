using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Servico
{
    public class RecuperarGraficoCargaComparacaoDTO
    {
        public int CodigoImportacaoPrincipal { get; set; }
        public int[] CodigoImportacao { get; set; }
        public string NomeColuna { get; set; }
    }
}