﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Models
{
    public class Importacao
    {
        public int Id { get; set; }
        public DateTime DataImportacao { get; set; }
        public string Descricao { get; set; }
        public string Observacao { get; set; }

        public int TipoImportacao { get; set; }

        public byte[] Arquivo { get; set; }
     
        public Carros Carros { get; set; }

        public List<ImportacaoColunas> ImportacaoColunas { get; set; }
    }
}