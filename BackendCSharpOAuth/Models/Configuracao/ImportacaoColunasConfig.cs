using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace BackendCSharpOAuth.Models.Configuracao
{
    public class ImportacaoColunasConfig : EntityTypeConfiguration<ImportacaoColunas>
    {
        public ImportacaoColunasConfig()
        {
            this.ToTable("ImportacaoColunas");

            this.HasKey<int>(s => s.Id);

            this.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnOrder(0)
                .IsRequired();

            this.Property(x => x.NomeColuna)
                .HasColumnName("NomeColuna")
                .HasColumnOrder(1)
                .HasMaxLength(50)
                .IsRequired();

            this.Property(x => x.DataLeitura)
                .HasColumnName("DataLeitura")
                .HasColumnOrder(2)
                .IsRequired();

            this.Property(x => x.ValorLeitura)
                .HasColumnName("ValorLeitura")
                .HasColumnOrder(3)
                .IsRequired();

            this.Property(x => x.CodigoImportacao)
                .HasColumnName("CodigoImportacao")
                .HasColumnOrder(4);

            HasRequired(x => x.Importacao)
                .WithMany()
                .HasForeignKey(x => x.CodigoImportacao);
        }
    }
}