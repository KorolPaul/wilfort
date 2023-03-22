<?php
    $url = "https://api.herowarsportal.com/api/site-info";
    $cacheFile = "cache.json";
    $cacheTime = 180;//3 минуты
    $needUpdate = true;
    if(file_exists($cacheFile))
    {
        $content = file_get_contents($cacheFile);
        $data = json_decode($content);
        if($data->time + $cacheTime > time())
        {
            $needUpdate = false;
        }
    }
    if($needUpdate)
    {
        $content = file_get_contents($url);
        $data = json_decode($content);
        $data->time = time();
        file_put_contents($cacheFile, json_encode($data));
    }
    $siteContent = file_get_contents("index.html");
    $pos = mb_strpos($siteContent, "</head>");
    $jsondata = json_encode($data);
    $jsContent = <<<EOT
<script>
    var cachedInfo = $jsondata;
</script>
EOT;
    $siteContent = substr_replace($siteContent, $jsContent, $pos, 0);
    echo $siteContent;



