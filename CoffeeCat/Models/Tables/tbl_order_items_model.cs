using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Tables
{
    public class tbl_order_items_model
    {
        public int order_item_id { get; set; }

        public int order_id { get; set; }

        public int drink_id { get; set; }

        public int quantity { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}