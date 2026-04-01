using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Tables
{
    public class tbl_orders_model
    {
        [Key]
        public int order_id { get; set; }

        public int user_id { get; set; }

        public decimal subtotal { get; set; }

        public decimal tax { get; set; }

        public decimal total { get; set; }

        public string order_status { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}