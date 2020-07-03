using System.Data;
using Project.DL;
namespace Project.BL
{
    public class PageBL
    {
        private readonly PageDL _dataLayer;

        public PageBL(PageDL dataLayer)
        {
            _dataLayer = dataLayer;
        }

        public DataTable GetDropDownData()
        {
            return _dataLayer.GetDropDownData();
        }
    }
}