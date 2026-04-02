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

        [HttpPost]
        public JsonResult UpsertUsers(tbl_users_model userInfo)
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    // Optional: Check if email already exists before creating
                    var existingUser = connect.tbl_users.Any(u => u.email == userInfo.email);
                    if (existingUser)
                    {
                        return Json(new { success = false, message = "Email is already registered." });
                    }

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

                    return Json(new { success = true, message = "Account created successfully!" });
                }
            }
            catch (Exception ex)
            {
                var errorMsg = ex.InnerException?.InnerException?.Message ?? ex.Message;
                return Json(new { success = false, message = "Database Error: " + errorMsg });
            }
        }

        [HttpPost]
        public JsonResult LoginUser(tbl_users_model loginInfo)
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    var user = connect.tbl_users.FirstOrDefault(u =>
                        u.email == loginInfo.email &&
                        u.password == loginInfo.password);

                    if (user != null)
                    {
                        // Store the username in the Session
                        Session["Username"] = user.username;
                        Session["UserID"] = user.user_id;

                        return Json(new { success = true, message = "Login Successful" });
                    }
                    return Json(new { success = false, message = "Invalid email or password." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Database error: " + ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetSession()
        {
            if (Session["Username"] != null)
            {
                return Json(new { loggedIn = true, username = Session["Username"].ToString() }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { loggedIn = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LogoutUser()
        {
            Session.Clear();
            return Json(new { success = true });
        }
    }
}