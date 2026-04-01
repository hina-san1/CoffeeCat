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

        public string ErrorHandling(string eMessage, string eStackTrace, string eInnerException)
        { 
            var errorMessage = $"Error has been encountered: {eMessage} | {eStackTrace} | {eInnerException}";
            return "Unable to process request. Please try again later.";
        }

        public string UpsertUsers(tbl_users_model userInfo)
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    var userData = new tbl_users_model()
                    {
                        first_name = userInfo.first_name,
                        last_name = userInfo.last_name,
                        username = userInfo.username,
                        email = userInfo.email,
                        password = userInfo.password,
                        contact = userInfo.contact,
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now
                    };
                    connect.tbl_users.Add(userData);
                    connect.SaveChanges();

                    return "Success";
                }
            } 
            catch (Exception ex)
            {
                var msg = ex.Message;
                if (ex.InnerException != null)
                {
                    msg += " | INNER: " + ex.InnerException.Message;
                    if (ex.InnerException.InnerException != null)
                        msg += " | DEEP: " + ex.InnerException.InnerException.Message;
                }
                return msg;
            }
        }
    }
}