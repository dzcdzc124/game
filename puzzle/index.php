<!doctype html>
<html lang="cn" style="font-size: 10px;">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">
    <meta name="apple-touch-fullscreen" content="YES">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta http-equiv="Expires" content="-1">
    <meta http-equiv="pragram" content="no-cache">
    
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <title>九宫格拼图</title>
</head>
<body>

<div class="bg" style=""></div>
<div class="table">
    <div id="puzzle"></div>
</div>
<div class="list">
    <div class="item" bg="./img/1.jpg" puzzle="./img/puzzle_1.jpg"><img src="./img/thumb_1.jpg"></div>
    <div class="item" bg="./img/2.jpg" puzzle="./img/puzzle_2.jpg"><img src="./img/thumb_2.jpg"></div>
    <div class="item" bg="./img/3.jpg" puzzle="./img/puzzle_3.jpg"><img src="./img/thumb_3.jpg"></div>
    <div class="item" bg="./img/4.jpg" puzzle="./img/puzzle_4.jpg"><img src="./img/thumb_4.jpg"></div>
    <div class="item" bg="./img/5.jpg" puzzle="./img/puzzle_5.jpg"><img src="./img/thumb_5.jpg"></div>
</div>

<script src="js/zepto.min.js"></script>
<script src="js/mobile.js"></script>

<?php if (strpos($_SERVER["HTTP_HOST"],"toucanz")!==false){ 
    include_once "../baidu_js_push.php";
?>
<div class="none">
    <script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1259908850'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s95.cnzz.com/z_stat.php%3Fid%3D1259908850' type='text/javascript'%3E%3C/script%3E"));</script>
</div>
<?php } ?>
</body>
</html>