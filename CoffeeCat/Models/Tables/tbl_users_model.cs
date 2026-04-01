using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Tables
{
    public class tbl_users_model
    {
        [Key]
        public int user_id { get; set; }

        public string user_role { get; set; }

        public string first_name { get; set; }

        public string last_name { get; set; }
        
        public string username { get; set; }

        public string email { get; set; }

        public string password { get; set; }

        public string contact { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}