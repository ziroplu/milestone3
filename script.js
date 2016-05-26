jQuery.noConflict();

(function( $ ) {
  $(function() {

    // var state = localStorage.getItem('issueTacker');

    // if(state != null){
    // 	    $('body').empty();
    // 		$('body').append(state);
    // 		$('.todoItem.done').find('input:checkbox').attr('checked', true);
    // }

    //$('.datepicker').datepicker('option', {dateFormat: 'yy-mm-dd' });
    $('#datepicker').datepicker({dateFormat: 'yy-mm-dd' });
  	var formArray = [];

    loadIssue(214);

  	$('#createIssue').on('submit', function(e){
      formArray = $(this).serializeArray();

  		var issue = {done:false};
      var noOfIssues = localStorage.getItem("noOfIssues");
      issue.id = noOfIssues++;
      localStorage.setItem("noOfIssues", noOfIssues);

      issue.project_id = 214;
      issue.client_id = guid();
      issue.done = false;

      // ugly
      issue.title = String(formArray[1]['value']);
      issue.priority = "2"; // TODO
      issue.due_date = String(formArray[0]['value']);

      console.log("1 createIssue");
      console.log(issue);
      console.log(JSON.stringify(issue));
      postCreate(issue);


  		e.preventDefault();
  	});

  function loadIssue (projectId) {
    $.ajax
   ({
       type: "GET",
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/'+projectId+'/issues',
       dataType: 'json',
       contentType: 'application/json',
       async: true,
       success: function (response) {
         localStorage.setItem("noOfIssues", response.length);
         for (var i in response) {
           var issue = response[i];
           printIssue(issue);
           localStorage.setItem("n"+issue.id, JSON.stringify(issue));
         }
         console.log('issues created. n=' + response.length);
       }
   });
  }

  function postCreate(issue) {
    $.ajax
   ({
       type: "POST",
       //url: 'http://zhaw-weng-api.herokuapp.com/api/project/' + issue.project_id + '/issues',
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/214/issues',
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
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/214/issues/' + issue.id,
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
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/214/issues/' + issue.id,
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
	  	$( ".todoItem input:checkbox" ).on('click',
        function(){
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

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

})(jQuery);
