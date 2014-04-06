///<reference path="c:\DefinitelyTyped\jquery\jquery.d.ts"/>
///<reference path=".\jquery.form.d.ts"/>
$('textarea[name="notes"]').change(function (e) {
    var form_id = $(this).attr('form')
    // get the data from the textarea into the hidden form
    $('#' + form_id + ' input[name="notes"]').val($(this).val())
    $.post('/addNote', $('#' + form_id).serialize(), function (data, stat) {
        console.log(data)
    })
})