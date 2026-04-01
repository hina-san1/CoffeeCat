using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Tables
{
    public class tbl_drinks_model
    {
        public int drink_id { get; set; }

        public string drink_name { get; set; }

        public decimal price { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}