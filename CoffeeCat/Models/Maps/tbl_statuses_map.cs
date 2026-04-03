using System;
using CoffeeCat.Models.Tables;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Maps
{
    public class tbl_statuses_map : EntityTypeConfiguration<tbl_statuses_model>
    {
        public tbl_statuses_map()
        {
            HasKey(i => i.status_id);
            ToTable("tbl_statuses");
        }
    }
}