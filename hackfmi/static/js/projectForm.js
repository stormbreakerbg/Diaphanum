$(document).ready(function(){
  console.log("I am here");
  var
    attachmentsCount = 0,
    maxAttachments = 10,
    setAddMoreFilesButtonState,
    textAreaValidationReq = window.Diaphanum.appConfig.textAreaValidationReq;

  setAddMoreFilesButtonState = function(numberOfFiles){
    var
      $oneMoreFileButton = $("#addOneMoreFile");

    if(numberOfFiles >= maxAttachments){
      $oneMoreFileButton
        .attr("disabled", "disabled")
        .html($("#maxFilesReachedTemplate").html());
    } else {
      $oneMoreFileButton
        .removeAttr("disabled")
        .html($("#addOneMoreFileTemplate").html());
    }
  };

  $(".projectForm")
    .on("click", "#addMemberButton", function(){
      var newTeamMemberHtml = $("#newTeamMemberTemplate").html();
      // use underscore if any placeholders
      $(newTeamMemberHtml).insertBefore("#addMemberControl");
    })
    .on("click", ".removeTeamMember", function(){
      $(this).parent().remove();
    })
    .on("click", "#addOneMoreFile", function(){
      var newAttachmentHtml = $("#newAttachmentTemplate").html();
      // use underscore if any placeholders
      $(newAttachmentHtml).insertBefore("#addOneMoreButtonContainer");
      attachmentsCount += 1;
      setAddMoreFilesButtonState(attachmentsCount);
    })
    .on("click", ".removeAttachment", function(){
      $(this).parent().remove();
      attachmentsCount -= 1;
      setAddMoreFilesButtonState(attachmentsCount);
    });

  $(".projectForm").validate({
    // TODO: Fix the bug here
    errorElement : "div",
    errorPlacement: function(error, element){
      var elementClasses = element.attr("class").split(" ");

      if(_.contains(elementClasses , "projectTeam")){
        console.log(error, element);
        $("#membersError")
          .html("")
          .append(error);
      }
      else{
        error.addClass("alert");
        error.insertAfter(element);
      }
    },
    rules: {
      name: {
        required: true,
        minlength: 2
      },
      mol:{
        required: true,
        minlength: 5
      },
      description: textAreaValidationReq,

      targets:textAreaValidationReq,
      tasks: textAreaValidationReq,
      target_group: textAreaValidationReq,
      schedule: textAreaValidationReq,
      resources: textAreaValidationReq,
      finance_description: textAreaValidationReq
    }
  });

  var teamMembersTypeAhead = $("input.autocomplete").typeahead({
      name : "names",
      valueKey : "full_name",
      remote: {
          url : "http://localhost:8000/search/%QUERY/",
          filter : function(parsedResponse) {
            _.map(parsedResponse, function(item) {
              console.log(item);
              item.full_name = item.full_name + " " + item.faculty_number;
            });
            return parsedResponse;
          }
      },
      template : [
        '<p class="teamMemberName"><%= full_name %></p>'
      ].join(""),
      engine : {
        compile : function(template) {
          var compiled = _.template(template);
          return {
            render : function(context) {
              return compiled(context);
            }
          };
        }
      }
  });
  
  teamMembersTypeAhead.on('typeahead:selected',function(evt, data){
      console.log(data); //selected datum object
  });

  // waiting for the autocomplete API from the backend
  // $(".projectTeam").rules("add", {
  //   required: true,
  //   minlength: 2
  // });
});