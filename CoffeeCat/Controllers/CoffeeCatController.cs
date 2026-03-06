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
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Signup()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Menu()
        {
            return View();
        }

        public ActionResult Admin()
        {
            return View();
        }
    }
}