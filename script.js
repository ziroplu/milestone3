jQuery.noConflict();

(function( $ ) {
  $(function() {

    // var state = localStorage.getItem('issueTacker');
    loadIssue(212);

    // if(state != null){
    // 	    $('body').empty();
    // 		$('body').append(state);
    // 		$('.todoItem.done').find('input:checkbox').attr('checked', true);
    // }

    $('.datepicker').datepicker('option', {dateFormat: 'yy-mm-dd' });
  	var formArray = [];

	bindDone();
	bindDelete()

  	$('#createIssue').on('submit', function(e){
      formArray = $(this).serializeArray();

  		var issue = {done:false};
      var noOfIssues = localStorage.getItem("noOfIssues");
      if (noOfIssues==null) {
        noOfIssues=1; // TODO replace with 0
      }
      issue.id = noOfIssues++;
      localStorage.setItem("noOfIssues", noOfIssues);

      issue.project_id = 212;
      issue.client_id = "a75e9a4c-22d1-11e6-b67b-9e71128cae77";
      issue.done = false;

      // ugly
      issue.title = String(formArray[1]['value']);
      issue.priority = "2"; // TODO
      issue.due_date = String(formArray[0]['value']);
      //issue.due_date = ddate + "T01:01:01.44.1Z"

      console.log("1 createIssue");
      console.log(issue);
      console.log(JSON.stringify(issue));
      postCreate(issue);


//      console.log(document.body.innerHTML);

  		e.preventDefault();
  	});

  function postCreate(issue) {
    $.ajax
   ({
       type: "POST",
       //url: 'http://zhaw-weng-api.herokuapp.com/api/project/' + issue.project_id + '/issues',
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/212/issues',
       dataType: 'json',
       contentType: 'application/json',
       async: false,
       //json object to sent to the authentication url
       data: JSON.stringify(issue),
       success: function (responseIssue) {
         console.log( 'issue created. original id='+ issue.id);
         console.log(responseIssue);
         localStorage.setItem("n"+responseIssue.id, JSON.stringify(responseIssue));
         printIssue(responseIssue);
       }
   })
  }

  function putUpdate(issue) {
    $.ajax
   ({
       type: "PUT",
       //url: 'http://zhaw-weng-api.herokuapp.com/api/project/' + issue.project_id + '/issues',
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/212/issues/' + issue.id,
       dataType: 'json',
       contentType: 'application/json',
       async: false,
       //json object to sent to the authentication url
       data: JSON.stringify(issue),
       success: function () {
         console.log( 'issue updated. id='+ issue.id);
       }
   })
  }

  function deleteRest(issue) {
    $.ajax
   ({
       type: "DELETE",
       //url: 'http://zhaw-weng-api.herokuapp.com/api/project/' + issue.project_id + '/issues',
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/212/issues/' + issue.id,
       dataType: 'json',
       contentType: 'application/json',
       async: false,
       //json object to sent to the authentication url
       data: JSON.stringify(issue),
       success: function () {
         console.log( 'issue deleted. id='+ issue.id);
       }
   })
  }

function printIssue (issue) {
    console.log("print " + issue.title);
    var issueRow = '<tr class="todoItem"> <td><input type="checkbox" name="bla" id=' + issue.id + ' /></td> <td>' + issue.title + '</td> <td>' + issue.due_date + '</td> <td><img id="bin" class="delete" src="bin.png"></td> </tr>';
    $('.tabelle tbody').prepend(issueRow);
    if (!issue.done) {
      $( ".todoItem input:checkbox" ).unbind();
    }
    $( ".todoItem .delete" ).unbind();

    bindDone();
    bindDelete();

    $(this).trigger("reset");
}

  	function bindDone(){
	  	$( ".todoItem input:checkbox" ).on('click', function(){
			$(this).parents('.todoItem').toggleClass('done');
      var issue = JSON.parse(localStorage.getItem("n"+this.id));
      issue.done = !issue.done;
      // update localStorage
      localStorage.setItem("n"+issue.id, JSON.stringify(issue));
      // call REST to update
      putUpdate(issue);

      console.log("2-bind Done");
		});
  	}


  	function bindDelete(){
		$( ".todoItem .delete" ).on('click', function(){
      // get id
      var id = this.parentNode.parentNode.getElementsByTagName("input")[0].id;

      // get issue
      var issue = JSON.parse(localStorage.getItem("n"+id));
      // call REST to delete
      deleteRest(issue);
      // remove from page
      $(this).parents('.todoItem').remove();
      // remove in local Storage
      localStorage.removeItem("n"+id);

      console.log("3- bind Delete");
		});
  	}

  });

  function loadIssue (projectId) {
    $.ajax
   ({
       type: "GET",
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/'+projectId+'/issues',
       dataType: 'json',
       contentType: 'application/json',
       async: false,
       success: function (response) {
         for (var i in response) {
           console.log(response[i]);
           // printIssue(response[i]);
         }
         console.log( 'issues created.');
       }
   })
  }

})(jQuery);


  function clickSave() {
    loadIssue(212);
  }
