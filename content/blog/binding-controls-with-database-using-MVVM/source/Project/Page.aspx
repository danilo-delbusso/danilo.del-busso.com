<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Page.aspx.cs" Inherits="Project.Page" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:DropDownList runat="server" ID="ddl" DataSourceID="odsDDL" DataTextField="NAME" DataValueField="ID">
            </asp:DropDownList>
        </div>
        <div>
            <asp:ObjectDataSource ID="odsDDL" runat="server"
                SelectMethod="GetDropDownData"
                TypeName="Projet.BL.ProjectBL"
                OnObjectCreating="odsDDL_ObjectCreating">              
            </asp:ObjectDataSource>
        </div>
    </form>
</body>

</html>
