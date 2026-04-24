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

        public ActionResult AdminOrders()
        {
            return View();
        }

        public ActionResult AdminUsers()
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
                        Session["Username"] = user.username;
                        Session["UserID"] = user.user_id;
                        Session["UserRole"] = user.user_role;

                        return Json(new
                        {
                            success = true,
                            message = "Login Successful",
                            role = user.user_role 
                        });
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
                return Json(new
                {
                    loggedIn = true,
                    username = Session["Username"].ToString(),
                    role = Session["UserRole"]?.ToString() 
                }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { loggedIn = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LogoutUser()
        {
            Session.Clear();
            return Json(new { success = true });
        }

        [HttpPost]
        public JsonResult AddOrder(decimal subtotal, decimal tax, decimal total, List<tbl_order_items_model> order_items)
        {
            try
            {
                if (Session["UserID"] == null)
                    return Json(new { success = false, message = "Please login to checkout." });

                int current_user_id = (int)Session["UserID"];

                using (var connect = new OrderingContext())
                {
                    var orderData = new tbl_orders_model()
                    {
                        user_id = current_user_id,
                        subtotal = subtotal,
                        tax = tax,
                        total = total,
                        order_status_id = 1, 
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now
                    };

                    connect.tbl_orders.Add(orderData);
                    connect.SaveChanges(); 

                    foreach (var item in order_items)
                    {
                        var itemData = new tbl_order_items_model()
                        {
                            order_id = orderData.order_id,
                            drink_id = item.drink_id,
                            quantity = item.quantity,
                            created_at = DateTime.Now,
                            updated_at = DateTime.Now
                        };
                        connect.tbl_order_items.Add(itemData);
                    }

                    connect.SaveChanges();
                    return Json(new { success = true, message = "Order successfully placed!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Checkout Error: " + ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetUserOrders()
        {
            try
            {
                if (Session["UserID"] == null) return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                int user_id = (int)Session["UserID"];

                using (var connect = new OrderingContext())
                {
                    var orders = connect.tbl_orders
                        .Where(o => o.user_id == user_id)
                        .OrderByDescending(o => o.created_at)
                        .Select(o => new
                        {
                            order_id = o.order_id,
                            items_summary = connect.tbl_order_items
                                .Where(oi => oi.order_id == o.order_id)
                                .Join(connect.tbl_drinks, oi => oi.drink_id, d => d.drink_id, (oi, d) => new { d.drink_name, oi.quantity })
                                .Select(x => x.drink_name + " (x" + x.quantity + ")")
                                .ToList(),
                            total_price = o.total,
                            status = connect.tbl_statuses.Where(s => s.status_id == o.order_status_id).Select(s => s.status_name).FirstOrDefault(),
                            created_at = o.created_at
                        }).ToList();

                    var result = orders.Select(o => new {
                        o.order_id,
                        drink_name = string.Join(", ", o.items_summary),
                        total_price = o.total_price,
                        status = o.status,
                        created_at = o.created_at.ToString("MMM dd, yyyy hh:mm tt")
                    });

                    return Json(new { success = true, data = result }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetDashboardStats()
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    return Json(new
                    {
                        success = true,
                        data = new
                        {
                            totalUsers = connect.tbl_users.Count(),
                            totalOrders = connect.tbl_orders.Count(),
                            pendingOrders = connect.tbl_orders.Count(o => o.order_status_id == 1),
                            completedOrders = connect.tbl_orders.Count(o => o.order_status_id == 3)
                        }
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpdateOrderStatus(int order_id, string action)
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    var order = connect.tbl_orders.FirstOrDefault(o => o.order_id == order_id);
                    if (order == null) return Json(new { success = false, message = "Order not found." });

                    if (action == "Approve")
                    {
                        order.order_status_id = 2; 
                    }
                    else if (action == "Complete")
                    {
                        order.order_status_id = 3; 
                    }
                    else if (action == "Decline")
                    {
                        order.order_status_id = 4;
                    }

                    order.updated_at = DateTime.Now;
                    connect.SaveChanges();

                    return Json(new { success = true, message = "Order updated successfully!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetAllOrders()
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    var orders = (from o in connect.tbl_orders
                                  join u in connect.tbl_users on o.user_id equals u.user_id
                                  join s in connect.tbl_statuses on o.order_status_id equals s.status_id
                                  orderby o.created_at descending
                                  select new
                                  {
                                      o.order_id,
                                      customer_name = u.first_name + " " + u.last_name,
                                      total_price = o.total,
                                      status = s.status_name,
                                      status_id = o.order_status_id,
                                      created_at = o.created_at,
                                      items = (from oi in connect.tbl_order_items
                                               join d in connect.tbl_drinks on oi.drink_id equals d.drink_id
                                               where oi.order_id == o.order_id
                                               select d.drink_name + " (x" + oi.quantity + ")").ToList()
                                  }).ToList();

                    var result = orders.Select(o => new {
                        o.order_id,
                        o.customer_name,
                        o.total_price,
                        o.status,
                        o.status_id,
                        drink_summary = string.Join(", ", o.items),
                        date = o.created_at.ToString("MMM dd, hh:mm tt")
                    });

                    return Json(new { success = true, data = result }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetAllCustomers()
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    var customers = connect.tbl_users
                        .Where(u => u.user_role == "Customer")
                        .OrderByDescending(u => u.created_at)
                        .Select(u => new
                        {
                            u.user_id,
                            u.first_name,
                            u.last_name,
                            u.username,
                            u.email,
                            u.contact,
                            created_at = u.created_at
                        }).ToList();

                    var result = customers.Select(u => new {
                        u.user_id,
                        u.first_name,
                        u.last_name,
                        u.username,
                        u.email,
                        u.contact,
                        created_at = u.created_at.ToString("MMM dd, yyyy")
                    });

                    return Json(new { success = true, data = result }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetRevenueData()
        {
            try
            {
                using (var connect = new OrderingContext())
                {
                    var currentYear = DateTime.Now.Year;

                    var revenueByMonth = connect.tbl_orders
                        .Where(o => o.created_at.Year == currentYear && o.order_status_id == 3) 
                        .GroupBy(o => o.created_at.Month)
                        .Select(g => new
                        {
                            Month = g.Key,
                            Total = g.Sum(o => o.total)
                        })
                        .ToList();

                    var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
                    var data = new decimal[12];

                    foreach (var item in revenueByMonth)
                    {
                        data[item.Month - 1] = item.Total;
                    }

                    return Json(new
                    {
                        success = true,
                        labels = months,
                        data = data
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}