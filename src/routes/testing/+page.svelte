<!DOCTYPE html>
<html lang="eng">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="js/autotag/jquery-autotag-1.3.min.js"></script>
  <link rel="stylesheet" type="text/css" href="css/autotag/jquery-autotag.css">

  <!-- The styles below are for the demo only. -->
  <style type="text/css">

    body {
      background-color: #EEE;
      font-family: Arial, Helvetica, sans-serif;
    }
    .hash-autotag { color: blue; }
    .at-autotag { color: green; }    
    .snippet-area {
      box-sizing: border-box;
      background-color: #FFF;
      border: 1px solid #AAA;
      border-radius: 5px;
      height: 100%;
      width: 500px;
      padding: 20px;
    }
    .snippet-wrapper {
      width: 500px;
      height: 200px;
      /* Position close to the center of the screen. */
      position: absolute;
      top: 30%;
      left: 50%;
      margin-left: -250px;
    }
    .instructions {
      text-align: center;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
</style>    
</head>
<body>
  <div class="snippet-wrapper">
    <div class="instructions">
      Type some text into the box below. <br/>
      You can use <strong>#</strong> and <strong>@</strong> before a word
      and see it change color.
    </div>
    <!--
      Use this div as an editable area. In practice, you would probably want to
      save the contents into a textarea that is hidden, prior to POST.
     -->
    <p id="autotag-demo" class="snippet-area" contentEditable="true"></p>
  </div>
  <script type="text/javascript">
    $(document).ready(function(){
      // By default, the plugin does not set focus on the editable element.
      // You can either uncomment the line in plugin or just call focus().
      $('#autotag-demo').autotag().focus();
    });
  </script>
</body>
</html>

