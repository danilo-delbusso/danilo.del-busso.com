[MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) is a popular design pattern amongst .NET developers to achieve a clear separation of concerns and facilitate test driven development (TDD).

While MVVM is mainly used together with really powerful databinding mechanisms (like the ones in [WPF](https://en.wikipedia.org/wiki/Windows_Presentation_Foundation)), it is possible to use it and take advantage of it while developing for the web.

This may be useful in teams that support different kinds of applications using the .NET framework, that do not want to use multiple design patterns.

## Create a ASP.NET control using MVVM

For the purposes of this tutorial, we will only explore how to bind and update a `<asp:DropDownList/>` to a Oracle Database, using an `<asp:ObjectDataSource />` object for data binding and update.

This approach will work with any other databound controls and is therefore quite flexible.

### The Data Layer (Binder)

We will be fetching data using the [OLE DB](https://docs.microsoft.com/en-us/dotnet/api/system.data.oledb?view=dotnet-plat-ext-3.1) Data Provider.

Our query will return a `DataTable` object in this format:

| ID  | NAME     |
| --- | -------- |
| 1   | London   |
| 2   | Rome     |
| 3   | New York |

<br/>

Let's add it to our `PageDL.cs` file in the `Project.DL` namespace:

```csharp
namespace Project.DL
{
    public class PageDL
    {
        private string ConnectionString { get; }

        public PageDL(string connectionString)
        {
            ConnectionString = connectionString;
        }

    }
}
```

we will be adding a `GetDropDownData()` method which will return the data as such:

```csharp
public DataTable GetDropDownData()
        {
            string query = @"SELECT ID, NAME FROM TABLE_NAME";
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
```

### The Business Logic (View Model)

Now we just need to add a small method to the View Model which will be called by the View.

```csharp
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
```

### The View

Now on to the juciest part. We will create a `<asp:DropDownList />` control and bind it to an instance of `PageBL.cs` via a `<asp:ObjectDataSource />`.

#### Connect the View with its View Model

In `Page.aspx.cs`

```csharp
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
    }
}
```

Let's add the `<asp:ObjectDataSource />` to the `Page.aspx` file

```xml
<asp:ObjectDataSource runat="server"
                ID="odsDDL"
                SelectMethod="GetDropDownData"
                TypeName="Projet.BL.ProjectBL"
                OnObjectCreating="odsDDL_ObjectCreating">
            </asp:ObjectDataSource>
```

When the `OnObjectCreating` method is called, we will be assigning an instanciated object of `PageBL` so that the View can call the View Model object.

To do so we add the event method to `Page.aspx.cs` like so:

```csharp
 protected void odsDDL_ObjectCreating(object sender, ObjectDataSourceEventArgs e)
        {
            e.ObjectInstance = businessLogic;
        }
```

#### Bind the Control

We can now bind the `<asp:DropDownList />` control to the ViewModel and populate it using the MVVM pattern.

```xml
<asp:DropDownList runat="server"
                ID="ddl"
                DataSourceID="odsDDL"
                DataTextField="NAME"
                DataValueField="ID">
            </asp:DropDownList>
```

You can find the source code [HERE](https://github.com/danilo-delbusso/blog/blob/master/content/blog/binding-controls-with-database-using-MVVM/source)
