using System.Data.Entity;

namespace BackendCSharpOAuth.Models
{
    public class BancoContext : DbContext
    {
        public BancoContext()
            : base("BancoContext")
        {

        }

        public DbSet<Carros> Carros { get; set; }        

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("public");
            base.OnModelCreating(modelBuilder);
        }

    }
}