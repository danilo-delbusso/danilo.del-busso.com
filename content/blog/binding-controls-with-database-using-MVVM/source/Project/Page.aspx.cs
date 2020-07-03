using Project.BL;
using Project.DL;
using System;
using System.Configuration;
using System.Web.UI.WebControls;

namespace Project
{
    public partial class Page : System.Web.UI.Page
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["CS"].ConnectionString.ToString();
        private PageBL businessLogic;
        private PageDL dataLayer;
        protected void Page_Init(object sender, EventArgs e)
        {
            dataLayer = new PageDL(connectionString);
            businessLogic = new PageBL(dataLayer);
        }
        protected void odsDDL_ObjectCreating(object sender, ObjectDataSourceEventArgs e)
        {
            e.ObjectInstance = businessLogic;
        }
    }
}