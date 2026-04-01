using CoffeeCat.Models.Context;
using CoffeeCat.Models.Tables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CoffeeCat.Controllers
{
    public class CoffeeCatController : Controller
    {
        // GET: CoffeeCat

        public ActionResult Signup()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Home()
        {
            return View();
        }

        public ActionResult Menu()
        {
            return View();
        }

        public ActionResult AdminDashboard()
        {
            return View();
        }

        public ActionResult UserOrder()
        {
            return View();
        }

        public string UpsertUsers()
        {
            using (var connect = new OrderingContext())
            {
                var userData = new tbl_users_model()
                {
                    first_name = "RC",
                    last_name = "Jimenez",
                    username = "rcjimenez",
                    email = "rcjimenez@gmail.com",
                    password = "rcjimenez123",
                    contact = "09123456789",
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now
                };
                connect.tbl_users.Add(userData);
                connect.SaveChanges();

                return "Success";
            }
        }
    }
}