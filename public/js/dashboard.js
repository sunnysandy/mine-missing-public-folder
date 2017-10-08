$(document).ready(function(){
});
  var Userqualifications=[], Userskills=[];
function getvalues(){
  var obj={}
  obj.name=$("#name").val();
  obj.dob=$("#dob").val();
  obj.address=$("#address").val();
  obj.mobile=$("#mobile").val();
  obj.skype=$("#skype").val();
  /*
  obj.skill= $('#tags').on('autocompleteselect', function (e, ui) {
          $('#tagsname').html('You selected: ' + ui.item.value);
      });
      */

      Userqualifications.push($("#bachlordegree").val())
      Userqualifications.push($("#intermidate").val());
      Userqualifications.push($("#ssc").val());


      obj.skills="skills";
      obj.projects=$("#project").val()
      obj.companyname=$("#companyname").val()
      obj.startdate=$("#firstdate").val()
      obj.enddate=$("#lastdate").val()
      obj.projectdescription=$("#textarea").val()
      obj.addprojectname=$("input[name='project']").val()
      obj.addcompanyname=$("input[name='company']").val()
      obj.addstartdate=$("input[name='startdate']").val()
      obj.addenddate=$("input[name='enddate']").val()
      obj.addprojectdescription=$("input[name='project1']").val();
      obj.services="services";
      obj.qualifications="Btch"
      obj.aboutme="aboutme"
      obj.testmonial="testmonial"

          var projects=[];
          $("#projectsWrap").find('.projects').each(function (i) {
              var objyyy={};
              var $fieldset = $(this);
              obj.projectname =$('input[name="project"]', $fieldset).val();
              obj.companyname = $('input[name="company"]', $fieldset).val();
              obj.startdate = $('input[name="startdate"]', $fieldset).val();
              obj.enddate =$('input[name="enddate"]', $fieldset).val();
              obj.projectdescription =$('input[name="description"]', $fieldset).val();
              projects.push(objyyy);
          });
// services
          var services=[];
          $("#servicewrap").find('.services').each(function (i) {
              var obj={};
              var $fieldset = $(this);
              obj.head =$('input[name="heading"]', $fieldset).val();
              obj.Description = $('input[name="description"]', $fieldset).val();
              services.push(obj);
          });
            console.log(services);
      //var skills=[]
    //  skills.push("companyname","firstdate","lastdate","project1");

      obj.head=$("#head").val();
      obj.description=$("#description").val();
      $.ajax({
          url: "/addUser",
          contentType: "application/json; charset=utf-8",
          type: 'POST',
          data: JSON.stringify(obj),
          dataType: "json",
          cache: false,
          success: function (resp) {
              console.log(resp)
              if(resp.status=="OK"){
                window.location.href="/dashboard"
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
              alert("Oops! Something went wrong. Try again later.");
          }
      });
        console.log(obj);
}

//  skills rating functionalituy
function bindskillsRating(skills){
$("#skillratings").empty();
  for (var i = 0; i < skills.length; i++) {
    $("#skillratings").append("<label>"+skills[i]+"</label> <div class='slider' id='slider"+i+"'><div  class='ui-slider-handle custom-handle'></div></div>");
  }
  $( ".slider" ).slider({
    create: function() {
      $( ".custom-handle" ).text( $( this ).slider( "value" ) );
     },
        value:100,
        min: 0,
        max: 500,
        step: 50,
        slide: function( event, ui ) {
            $("#"+event.target.id+" .custom-handle" ).text( ui.value );

        console.log(ui.value)
        }
      });

}
