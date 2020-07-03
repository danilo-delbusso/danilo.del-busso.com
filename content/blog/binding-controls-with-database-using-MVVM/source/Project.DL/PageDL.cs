using System;
using System.Data;
using System.Data.OleDb;

namespace Project.DL
{
    public class PageDL
    {
        private string ConnectionString { get; }

        public PageDL(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public DataTable GetDropDownData()
        {
            string query = @"SELECT NAME, ID FROM TABLE_NAME";
            var table = new DataTable();
            try
            {
                using (var conn = new OleDbConnection(ConnectionString))
                {
                    conn.Open();
                    using (var cmd = new OleDbCommand(query, conn))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            table.Load(reader);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                //error logging here
                throw;
            }

            return table;
        }
    }
}