<%-- _lcid="1046" _version="16.0.8713" _dal="1" --%>
<%-- _LocalBinding --%>
<%@ Page language="C#" MasterPageFile="~masterurl/default.master"    Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document"  %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
	<style>
	  .dropbox { width: 600px; height: 100px; border: 3px dashed #efefef; }
      .labelArea { color: #bfbfbf; font-size: 20px; top: 35%; left: 27%; position: relative; }
      .arquivos span { padding: 0 15px 0 0 }
      select { margin: 0 15px 0 0 }
      .typeOther{ display: none; }
  	</style>
  	
  	<script src="../../Style Library/_custom/js/library/jquery-3.1.1.min.js" type="text/javascript" ></script>
  	<script src="testFile.js" type="text/javascript" ></script>
 
 	<div id="container">
 	
	 	<div id="dropContainer" class="dropbox"><span class="labelArea">ARRASTE OS ARQUIVOS AQUI</span></div>
	 	<div><ul class="arquivos"></ul></div>
 	
 	</div>
</asp:Content>
