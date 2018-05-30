using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Configuration;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Models.Configuracao
{
    public class ImportacaoConfig : EntityTypeConfiguration<Importacao>
    {
        public ImportacaoConfig()
        {
            this.ToTable("Importacao");

            this.HasKey<int>(s => s.Id);

            this.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnOrder(0)
                .IsRequired();

            this.Property(x => x.Descricao)
                .HasColumnName("Descricao")
                .HasColumnOrder(1)
                .HasMaxLength(500)
                .IsRequired();

            this.Property(x => x.DataImportacao)
                .HasColumnName("DataImportacao")
                .HasColumnOrder(2)
                .IsRequired();

            this.Property(x => x.Observacao)
                .HasColumnName("Observacao")
                .HasColumnOrder(3)
                .IsOptional()
                .HasMaxLength(4000);

            //this.Property(x => x.Carros_Id)
            //    .HasColumnName("Carros_Id")
            //    .HasColumnOrder(4)
            //    .IsRequired();

            this.HasRequired(x => x.Carros);

            this.HasMany(x => x.ImportacaoColunas)
                .WithOptional()
                .HasForeignKey(x => x.CodigoImportacao);
          
        }
    }
}