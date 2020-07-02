
  /* Initial variables */
  var timeline = [];
  var preloadimages = [];
  var prolificID = jsPsych.data.getURLVariable("prolificID"); // Need to add ?prolificID={{%PROLIFIC_PID%}} at the end of the prolific survey link!

  var githubCIs = 'cis/'; 

//avg CIs
  var CIs_avg = [
    "ci_avg_AppBlack.jpeg",
    "ci_avg_AvBlack.jpeg",
    "ci_avg_Cont.jpeg"
  ];


  CIs_avg = CIs_avg.map(function(e) {return githubCIs + e}); // add URL path
  preloadimages.push(CIs_avg);
  CIs_avg = CIs_avg.map(function(e) {return {imgHtml: "<img class='imgJudge' src='" + e + "'>"}});
  CIs_avg = _.shuffle(CIs_avg); // randomize order

  // EXPERIMENT --------------------------------------------------------------------------------------------------------

  /* FULL SCREEN MODE */
  var activeFullscreen = {
    message: "",
    button_label: "I give my free and informed consent to take part in this study",
    type: 'fullscreen',
    fullscreen_mode: true,
    delay_after: 200,
  };

  /* PREVIEW CIS INSTRUCTIONS */
  var previewCIinst_avg = {
    type: "html-keyboard-response",
    post_trial_gap: 300,
    choices: [32],
    stimulus: function() {
      var html = "";
      html += "<h1>Faces rating</h1>";
      html += "<p class='justify'>In this study, you task is to <b>evaluate 3 faces</b>. You will indicate, "
      html += "for each face, to what extent this face looks <b>aggressive, trustworthy</b> and ";
      html += "<b>criminal</b> (from 0 = not at all to 100 = totally). </br> ";
      html += "As you will see, these faces have been <b>blurred</b> to make the task more challenging. </br></br>";
      html += "Note that it is extremely important for you to <b>answer as honestly and as spontaneously as possible.</b> "
      html += "The first answer that comes to mind is usually the best answer.</br></br> ";
      html += "Before the evaluation task, <b>we will briefly display the 3 faces</b> ";
      html += "for you to better gauge the similarities and differences between them. </br> ";
      html += "Faces will be automatically paced during 2 second each. Pleace remain concentrated.</br></br>";
      html += "<p></br>Press <span class='light-keys'><kbd>space</kbd></span> to begin</p>";
      return html;
    },
  };

  /* PREVIEW CIS */
  var previewCI_avg = {
    timeline_variables: CIs_avg,
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    post_trial_gap: 100,
    timeline: [{
      type: 'html-keyboard-response',
      stimulus: function() {return jsPsych.timelineVariable('imgHtml', true)},
    }]
  };
  // Judgments

  var scaleAggressiveness = ["0</br>Not aggressive at all", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100</br>Totally aggressive"];
  var scaleTrustworthiness = ["0</br>Not trustworthy at all", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100</br>Totally trustworthy"];
  var scaleCriminality = ["0</br>Not criminal at all", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100</br>Totally criminal"];

  var judgments_avg = [];
  CIs_avg.map(function(ciImg){
    var likert_trial = {
        type: 'survey-likert',
        preamble: ciImg.imgHtml,
        questions: [
          {prompt: "", labels: scaleAggressiveness, required: true},
          {prompt: "", labels: scaleTrustworthiness, required: true},
          {prompt: "", labels: scaleCriminality, required: true},
        ],
        button_label: 'Continue',
        on_load: function() {
          $(".jspsych-content").css("max-width", "100%");
          $(".jspsych-survey-likert-statement").css("margin", "0px");
          $(".jspsych-survey-likert-statement").css("padding", "0px");
          $(".jspsych-survey-likert-opts").css("padding", "0 0 10px");
          $("#jspsych-survey-likert-next").css("margin-top", "10px");
          $("#jspsych-survey-likert-form").css("width", "800px");
          $("li").css("width", "9%");
        //   $("li:first-of-type").css("width", "110px");
        //   $("li:last-of-type").css("width", "110px");
        },
        on_finish: function(data) {
          var parsed_response  = JSON.parse(data.responses);
          data.aggressiveness     = parsed_response.Q0 * 10;
          data.trustworthiness = parsed_response.Q1 * 10;
          data.criminality     = parsed_response.Q2 * 10;
          data.ci              = ciImg.imgHtml;
        },
    };
    judgments_avg.push(likert_trial);
  });

  /* AGE */
  var age = {
      timeline: [{
        type: 'survey-text',
        questions: [{prompt: "How old are you?", rows: 1, columns: 10}],
        button_label: "Continue",
      }],
      loop_function: function(data){ 
        var age = data.values()[0].responses;
        var age = JSON.parse(age).Q0; 
        if(age == ""){
          alert("Please indicate your age"); 
          return true; 
        }
      },
      on_finish: function(data) {
          jsPsych.data.addProperties({
              age: JSON.parse(data.responses)["Q0"],
          });
      },
  };

  var gender = {
      type: 'survey-multi-choice',
      questions: [{prompt: "Please indicate your gender:", options: ['Male', 'Female', 'Other'], required: true}],
      button_label: "Continue",
      on_finish: function(data) {
          jsPsych.data.addProperties({
              gender: JSON.parse(data.responses)["Q0"],
          });
      },
  };

  var languageOptions = ['Fluently', 'Very good', 'Good', 'Average', 'Bad', 'Very bad'];
  var language = {
        type: 'survey-multi-choice',
        questions: [{ prompt: "How well do you speak english?", options: languageOptions, required: true }],
        button_label: "continue",
        on_finish: function (data) {
            jsPsych.data.addProperties({
                language: JSON.parse(data.responses).Q0,
            });
            console.log(data);
        },
    };

  var RaceOptions = ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'White'];
  var Race = {
        type: 'survey-multi-choice',
        questions: [{ prompt: "Please indicate your racial/ethnic category:", options: RaceOptions, required: true }],
        button_label: "continue",
        on_finish: function (data) {
            jsPsych.data.addProperties({
                Race: JSON.parse(data.responses).Q0,
            });
            console.log(data);
        },
      };

  var Prolific_reported = {
        timeline: [{
            type: 'survey-text',
            questions: [{ prompt: 'Please indicate your Prolific ID:', rows: 3, columns: 60 }],
            button_label: "continue",
        }],
        loop_function: function (data) {
            var res = data.values()[0].responses;
            var res = JSON.parse(res).Q0;
            if (res == "") {
                alert("Please answer the question");
                return true;
            }
        },
        on_finish: function (data) {
            jsPsych.data.addProperties({
                Prolific_reported: JSON.parse(data.responses).Q0,
            });
        },
    };

  /* EXIT FULLSCREEN MODE */
  var exitFullscreen = {
    type: 'fullscreen',
    fullscreen_mode: false
  };

  /* DEBRIEF */
  var debrief = [];
  debrief += "<p class='justify'>Thank you for your participation! You are automatically redirected toward Prolific Academic. </p>";
  debrief += "<a href='https://app.prolific.co/submissions/complete?cc=7C0ACADA' target='_blank'>click here</a>";


  // TIMELINE ----------------------------------------------------------------------------------------------------------
  timeline.push(activeFullscreen);
  timeline.push(previewCIinst_avg);
  timeline.push(previewCI_avg);
  timeline.push(judgments_avg);
  timeline.push(age);
  timeline.push(gender);
  timeline.push(language);
  timeline.push(Race);
  timeline.push(Prolific_reported);
  timeline.push(exitFullscreen);
  
  timeline = _.flattenDeep(timeline); // do not remove this!

  // INITIALISE EXP ----------------------------------------------------------------------------------------------------
  jsPsych.init({
    timeline: timeline,
    preload_images: preloadimages,
    max_load_time: 500*1000,
    exclusions: {
      min_width: 800,
      min_height: 600,
    },
    on_finish: function(data) { 

      /* Initialize Firebase */
      var config = {
        apiKey: "AIzaSyBwDr8n-RNCbBOk1lKIxw7AFgslXGcnQzM",
        databaseURL: "https://aatblack.firebaseio.com/"
      };

      firebase.initializeApp(config);
      var database = firebase.database();
      id = jsPsych.randomization.randomID(15); // short ID

      /* jsPsych: add data to every trial */
      jsPsych.data.addProperties({
        prolificID: prolificID,
        id: id,
        totalTime: jsPsych.totalTime()
      });

      var subdata = data.filter({trial_type: 'survey-likert'}).csv();

      /* Send data to Firebase and redirect to Prolific */
      database.ref("eval_faces_Black_AAT_2/" + id + "/").update({subdata}).then(function() { 
        console.log("data sent!");
        $("#jspsych-content").html(debrief);
        window.location = "https://app.prolific.co/submissions/complete?cc=7C0ACADA";
      });
    }
  });

