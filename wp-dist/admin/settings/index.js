function drawForm(obj, form){
    var input = ""
    for(var prop in obj){
        var { value, type, label} = obj[prop]
        switch (obj[prop].type) {
            case "boolean":
                //Draw checkbox
                

                input = `<select id="${prop}" name="${prop}">
                    <option value="true" ${value ? "selected" : ""}>Yes</option>
                    <option value="false">No</option>
                </select>`
                break;
        
            default:
                break;
        }

        const output = `<label for="${prop}">${label}</label>  ${input} 
        `
        jQuery(form).append(output)
    }
}


jQuery(document).ready( ($) => {

   const form = jQuery("form#settings")
    $.ajax({
        url : myAjax.ajax_url,
        data : {
            action : 'settings'
        },
        method : 'GET',
        dataType: "json",
        success : function( response ){
            
            //jQuery("#php").html(response)
            console.log(response);
            drawForm(response, "form#settings")
            
        },
        error : function(error){ console.log(error, 'ERROR') }
    })
    const fileList = $("#saved_files")

    jQuery("form#settings").submit( function(e) {
        var form = $(this);
        e.preventDefault()
        jQuery.ajax({
            url : myAjax.ajax_url,
            data : {
                action : 'settings',
                form: form.serialize(),
            },
            method : 'POST',
            dataType: "text",
            success : function( response ){
                
                //jQuery("#php").html(response)
                console.log(response);
                
            },
            error : function(error){ console.log(error, 'ERROR') }
        })
    })
})