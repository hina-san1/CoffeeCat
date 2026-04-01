using CoffeeCat.Models.Maps;
using CoffeeCat.Models.Tables;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CoffeeCat.Models.Context
{
    public class OrderingContext : DbContext
    {
        static OrderingContext()
        {
            Database.SetInitializer<OrderingContext>(null);
        }

        public OrderingContext() : base("Name=ordering_system_db") { }

        public virtual DbSet<tbl_users_model> tbl_users { get; set; }

        public virtual DbSet<tbl_orders_model> tbl_orders { get; set; }

        public virtual DbSet<tbl_order_items_model> tbl_order_items { get; set; }

        public virtual DbSet<tbl_drinks_model> tbl_drinks { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new tbl_users_map());
            modelBuilder.Configurations.Add(new tbl_orders_map());
            modelBuilder.Configurations.Add(new tbl_order_items_map());
            modelBuilder.Configurations.Add(new tbl_drinks_map());
        }
    }
}