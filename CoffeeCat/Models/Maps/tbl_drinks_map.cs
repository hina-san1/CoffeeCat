using CoffeeCat.Models.Tables;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Maps
{
    public class tbl_drinks_map :EntityTypeConfiguration<tbl_drinks_model>
    {
        public tbl_drinks_map()
        {
            HasKey(i => i.drink_id);
            ToTable("tbl_drinks");
        }
    }
}