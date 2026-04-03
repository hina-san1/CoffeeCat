using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Tables
{
    public class tbl_statuses_model
    {
        public int status_id { get; set; } = 1;

        public string status_name { get; set; }
    }
}