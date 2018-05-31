using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Models
{
    public class ImportacaoColunas
    {
        public int Id { get; set; }
        public string NomeColuna { get; set; }
        public DateTime DataLeitura { get; set; }
        public decimal ValorLeitura { get; set; }

        public int CodigoImportacao { get; set; }        

        public Importacao Importacao { get; set; }
    }
}