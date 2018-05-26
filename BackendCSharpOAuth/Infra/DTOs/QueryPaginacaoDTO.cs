using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Infra.DTOs
{
    public class QueryPaginacaoDTO
    {
        public int Page { get; set; }
        public int Start { get; set; }
        public int Limit { get; set; }
    }
}