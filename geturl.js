function geturl()
{
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		var newsurls = tabs[0].url;
		var url = "http://10.42.0.1:8000/api";
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.onreadystatechange = function(){
			if (xhttp.readyState === 4 && xhttp.status == 201){
				var jsonz = JSON.parse(xhttp.responseText);
				console.log(xhttp.responseText)
			}else{
				console.log(xhttp.responseText)
			}
		}

		xhttp.send(JSON.stringify({"news_type":"url", "news_url":newsurls}));

	});
}

document.addEventListener('DOMContentLoaded', function () 	
	{

		document.getElementById('link').addEventListener('click', geturl);

	}
);
