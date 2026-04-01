using CoffeeCat.Models.Tables;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Maps
{
    public class tbl_order_items_map : EntityTypeConfiguration<tbl_order_items_model>
    {
        public tbl_order_items_map()
        {
            HasKey(i => i.order_id);
            ToTable("tbl_orders");
        }
    }
}