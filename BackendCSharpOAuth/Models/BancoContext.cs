﻿using BackendCSharpOAuth.Models.Configuracao;
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
        public DbSet<Importacao> Importacao { get; set; }
        public DbSet<ImportacaoColunas> ImportacaoColunas { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            
            modelBuilder.HasDefaultSchema("public");

            modelBuilder.Configurations.Add(new CarrosConfig());
            modelBuilder.Configurations.Add(new ImportacaoConfig());
            modelBuilder.Configurations.Add(new ImportacaoColunasConfig());

            base.OnModelCreating(modelBuilder);
           
        }

    }
}