using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendCSharpOAuth.Models
{
    [Table("Carros", Schema = "public")]
    public class Carros
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }
        [Column("Descricao")]
        public string Descricao { get; set; }
        [Column("Ativo")]
        public bool Ativo { get; set; }
    }

}