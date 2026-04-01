using CoffeeCat.Models.Tables;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Maps
{
    public class tbl_orders_map :EntityTypeConfiguration<tbl_orders_model>
    {
        public tbl_orders_map()
        {
            HasKey(i => i.order_id);
            ToTable("tbl_orders");
        }
    }
}