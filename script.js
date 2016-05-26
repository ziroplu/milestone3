jQuery.noConflict();

(function( $ ) {
  $(function() {

    //$('.datepicker').datepicker('option', {dateFormat: 'yy-mm-dd' });
    $('#datepicker').datepicker({dateFormat: 'yy-mm-dd' });

    bindSaveProject();
    bindLoadProject();

    var project =  JSON.parse(localStorage.getItem("project"));
    if (project != null) {
      document.getElementById("eingabefeld").value=project.title;
      loadIssue(project.id);
    }

  	$('#createIssue').on('submit', function(e){

  		var issue = {done:false};

      var project =  JSON.parse(localStorage.getItem("project"));
      issue.project_id = project.id;
      issue.client_id = guid();
      issue.done = false;

      issue.title = document.getElementById("issueText").value;
      issue.priority = document.getElementById("issueSelect").value;
      issue.due_date = document.getElementById("datepicker").value;

      console.log("createIssue " + issue.id);
      console.log(issue);
      console.log(JSON.stringify(issue));
      postCreate(issue);

  		e.preventDefault();
      this.reset();
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
//         document.getElementById("todolist").children[0].children[0].children[0].remove();
        $("#issueTable tr").remove();

         for (var i in response) {
           var issue = response[i];
           printIssue(issue);
           localStorage.setItem(issue.client_id, JSON.stringify(issue));
         }
         console.log('issues loaded. n=' + response.length);
       }
   });
  }

  function createProject(project) {
    $.ajax
   ({
       type: "POST",
       url: 'http://zhaw-weng-api.herokuapp.com/api/projects/',
       dataType: 'json',
       contentType: 'application/json',
       async: false,
       //json object to sent to the authentication url
       data: JSON.stringify(project),
       error: function () {
         console.log('.');
       },
       success: function (responseIssue) {
         project = responseIssue;
         console.log('project created. ' + JSON.stringify(project));
         localStorage.setItem("project", JSON.stringify(project));
         document.getElementById("projectId").innerHTML = "id:" + project.id;
       }
   })
  }

  function getProject(id) {
    $.ajax
   ({
       type: "GET",
       url: 'http://zhaw-weng-api.herokuapp.com/api/projects/' + id,
       dataType: 'json',
       contentType: 'application/json',
       async: false,
       //json object to sent to the authentication url
       data: JSON.stringify(project),
       error: function () {
         console.log('project not available ' + id);
       },
       success: function (responseIssue) {
         project = responseIssue;
         console.log('project loaded. ' + JSON.stringify(project));
         localStorage.setItem("project", JSON.stringify(project));
         document.getElementById("projectId").innerHTML = "id:" + project.id;
         document.getElementById("eingabefeld").innerHTML = project.title;
         loadIssue(id);
       }
   })
  }

  function postCreate(issue) {
    $.ajax
   ({
       type: "POST",
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/' + issue.project_id + '/issues',
       dataType: 'json',
       contentType: 'application/json',
       async: false,
       //json object to sent to the authentication url
       data: JSON.stringify(issue),
       success: function (responseIssue) {
         console.log( 'issue created. original id='+ issue.id);
         console.log(responseIssue);
         localStorage.setItem(responseIssue.client_id, JSON.stringify(responseIssue));
         printIssue(responseIssue);
       }
   })
  }

  function putUpdate(issue) {
    $.ajax
   ({
       type: "PUT",
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/' + issue.project_id + '/issues/' + issue.id,
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
       url: 'http://zhaw-weng-api.herokuapp.com/api/project/' + issue.project_id + '/issues/' + issue.id,
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
    var issueRow = '<tr id="' + issue.client_id + '" class="todoItem '+ (issue.done ? "done" : "" ) + ' "> <td><input id="' + issue.client_id + '" type="checkbox" name="bla"/></td> <td>' + issue.title + '</td> <td>' + issue.due_date + '</td> <td><img id="bin" class="delete" src="bin.png"></td> </tr>';
    $('.tabelle tbody').prepend(issueRow);

    $( ".todoItem input:checkbox" ).unbind();
    $( ".todoItem .delete" ).unbind();

    bindDone();
    bindDelete();

}

  	function bindDone(){
	  	$( ".todoItem input:checkbox" ).on('click',
        function () {
          $(this).parents('.todoItem').toggleClass('done');

          var issue = JSON.parse(localStorage.getItem(this.id));
          issue.done = !issue.done;

          // update localStorage
          localStorage.setItem(issue.client_id, JSON.stringify(issue));
          // call REST to update
          putUpdate(issue);

          console.log("2-Done");
    		});
  	}

  	function bindDelete(){
		$( ".todoItem .delete" ).on('click', function () {
      // get id
      //var id = this.parentNode.parentNode.getElementsByTagName("input")[0].id;

      var id = this.parentNode.parentElement.id;
      // get issue
      var issue = JSON.parse(localStorage.getItem(id));

      // remove from page
      // $(this).parents('.todoItem').remove();
      this.parentNode.parentElement.remove();

      // remove in local Storage
      localStorage.removeItem(id);

      // call REST to delete
      deleteRest(issue);

      console.log("Delete Item " + issue.title);
		});
  	}

    function bindSaveProject () {
      $("#buttonProjectNameSave").on('click',
      function () {
        var project = {id:0};
        project.title = document.getElementById("eingabefeld").value;
        createProject(project);
      });
    }

    function bindLoadProject () {
      $("#buttonProjectNameLoad").on('click',
      function () {
        var projectId = document.getElementById("eingabefeld").value;
        getProject(projectId);
        document.getElementById("eingabefeld").value=JSON.parse(localStorage.getItem("project")).title;
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
