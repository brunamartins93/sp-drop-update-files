$(document).ready(function(){

	var files;
	$("#dropContainer").on("dragover", function(evt) {
	    evt.preventDefault();
	}).on("dragenter", function(evt) {
	    evt.preventDefault();
	});

	$("#dropContainer").on("drop", function(evt) {
	  	evt.preventDefault();
	  	files = evt.originalEvent.dataTransfer.files;
	  	buildListFiles(files);
	});
	
	$("#container").on("click", "#sendFiles", function(e){
		$("#actionFile").html("<div><img src='Spinner.svg'/></div>");
		upload("BrunaTeste", 0, files);
	});
	
	$("#container").on("change", ".typeFile", function(e){
		if($(this).val() == "Outros"){
			$(this).siblings(".typeOther").show();
		}else{
			$(this).siblings(".typeOther").val("");
			$(this).siblings(".typeOther").hide();
		}
	});

	$("#container").on("click", ".removeFile", function(e){
		var list = $(this).parent();
		var nameFile = list.children(".nameFile").text();
		
		for(var i=0; i < files.length; i++){
			if(nameFile == files[i].name){
				files = Array.from(files)
				files.splice(i, 1);
				break;
			}
		}
		
		if(list.parent().children("li").length < 2){
			list.remove();
			$("#sendFiles").remove();
		}else{
			list.remove();
		}
	});
	
});

function buildListFiles(files){
	$(".arquivos").html("");
	for (i = 0; i < files.length; i++) {
	    var selectType = getFieldChoices("BrunaTeste", "TipoDocumento");
	    var lineFile = "";
	    lineFile += "<li>";
	    lineFile += "<span nameFile='"+files[i].name +"' class='nameFile'>"+ files[i].name +"</span>"; 
	    lineFile += "<span>Tipo Documento: </span>";
	    lineFile += selectType;
	    lineFile += "<input type='button' value='Remover' class='removeFile'/>";
	    lineFile += "</li>"; 			   
		
		$(".arquivos").append(lineFile);     	           			    
    }
    $(".arquivos").append("<div id='actionFile'><input id='sendFiles' type='button' value='Enviar Arquivos' /></div>");
}


function getFieldChoices(listName, fieldName){
	var html = "";
	
	$.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+listName+"')/fields?$filter=EntityPropertyName eq '"+fieldName+"'",
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
            var arrayChoices = data.d.results[0].Choices.results;
            html += "<select class='typeFile'>";
            for(var i=0; i < arrayChoices.length; i++){
            	html += "<option value='"+arrayChoices[i]+"'>"+arrayChoices[i]+"</option>";
            }
            html += "</select>";
            html += "<input type='text' class='typeOther' />";
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    
    return html;
} 

function upload(listName, fileIndice, files) {

	if(fileIndice < files.length){		
		getFileBuffer(files[fileIndice]).done(function(buffer){
			uploadFile(listName, files[fileIndice], buffer).done(function (file, status, xhr) {
				getListItem(file.d.ListItemAllFields.__deferred.uri).done(function (listItem, status, xhr) {
            		var tipoDoc = $("span[namefile='"+files[fileIndice].name+"']").siblings(".typeFile").val();
            		var outros  = $("span[namefile='"+files[fileIndice].name+"']").siblings(".typeOther").val();
            		updateMetadata("BrunaTeste", listItem.d.ID, tipoDoc, outros).done(function (data, status, xhr) {
            			fileIndice++;
	        			upload("BrunaTeste", fileIndice, files);
            		}).fail(function(err){
            			console.log(err);
            		});
            	}).fail(function(err){
        			console.log(err);
        		});
	    	}).fail(function(err){
    			console.log(err);
    		});    	
	    }).fail(function(err){
			console.log(err);
		});
	}else{
		$("#actionFile").html("<span>Arquivos Enviados.</span>")
	}	
	
}

function getListItem(fileListItemUri) {
    return jQuery.ajax({
        url: fileListItemUri,
        type: "GET",
        headers: { "accept": "application/json;odata=verbose" }
    });
}

function uploadFile(listName, file, buffer){
	var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('" + listName + "')/RootFolder/Files/Add(url='"+file.name+"', overwrite=true)";

	return jQuery.ajax({
		        url: url,
		        type: "POST",
		        data: buffer,
		        processData: false,
		        headers: {
		            Accept: "application/json;odata=verbose",
		            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
		            "Content-Length": buffer.byteLength
		        }
		    });	
}

function getFileBuffer(file) {
    var deferred = jQuery.Deferred();
    var reader = new FileReader();
    reader.onloadend = function (e) {
        deferred.resolve(e.target.result);
    }
    reader.onerror = function (e) {
        deferred.reject(e.target.error);
    }
    reader.readAsArrayBuffer(file);
    return deferred.promise();
}

function updateMetadata(listName, id, tipoDoc, outros){
	
	var url = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('BrunaTeste')/Items(" + id + ")";
	var body = JSON.stringify({"__metadata": { type: "SP.Data.BrunaTesteItem" },   TipoDocumento: tipoDoc, Title: outros });
	
	return jQuery.ajax({
        url: url,
        type: "POST",
        data: body,
        headers: {
			'accept': 'application/json;odata=verbose',
            'content-type': 'application/json;odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'X-Http-Method': 'PATCH',
            "If-Match": "*"      
        }
    });

}

