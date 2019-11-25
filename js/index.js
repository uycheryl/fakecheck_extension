$(document).ready(function () {

	$(document).ajaxStart(() => {

		$('#sendData').attr("disabled", true);

	}).ajaxStop(() => {

		$('#sendData').attr("disabled", false);

	})

	renderDefault();
	
	$("#bodyInfo").on('click','#checkNews', function () {

		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function (tabs) {
			var news_url = tabs[0].url;

			url = "http://127.0.0.1:8000/api/urls/check/";
			post_data = { news_url: news_url };

			let ajax_data = $.ajax(url, {
				type: 'POST',
				data: post_data,
				beforeSend: renderLoading,
			})
				.done((data, status, xhr) => {
					renderReport(data, xhr.status);
				}).fail(err => {
					console.log(err);
				})
		});
	});

	$("#cancelInfo").on('click', '#cancelReport', function(){

		clearElements();
	
	});

});


function renderLoading() {

	$("#reportInfo").html('<div class="spinner"></div>');

}

function renderReport(data, status_code) {

	var validated_str;
	var report_available = false;
	var info_available = 'The article has already been reported';
	var modified_probability = data.model_probability/100;


	if (status_code == 206) {
		validated_str = "Not yet verified";
	} else if (status_code == 200) {
		validated_str = (data.url.url_valid ? "REAL" : "FAKE");
	} else {
		report_available = true;
		info_available = "Click again to report the article"
		validated_str = "Not yet reported";
	}
	var url_valid = '<div class="input-group mb-3"><div class="input-group-prepend"><span class="font-weight-bold input-group-text" id="basic-addon3">Status</span></div><input type="text" disabled value="'+ validated_str +'" class="form-control"></div>'
	var probability = '<span class="text-muted">Probability and Prediction</span><div id="bar"></div>';
	var cancel = '<button class="btn btn-outline-secondary" id="cancelReport">Click here to cancel the report</button>'

	$(".reportInfo").hide();
	
	$("#buttonLabel").text(info_available);
	$("#checkNews").replaceWith('<button type="button" id="reportNews"'+ (report_available ? "" : ' disabled ') +'class="btn btn-red btn-danger">Report News Article</button>');
	
	$("#validityInfo").html(url_valid);
	$("#probabilityInfo").html(probability);
	$("#cancelInfo").html(cancel);

	$("#validityInfo").addClass("validityBoxVis");
	
	$("#bodyInfo").hide();
	$("#validityInfo").hide();
	$("#probabilityInfo").hide();	
	$("#cancelInfo").hide();
	
	$("#bodyInfo").fadeIn(500);
	$("#validityInfo").fadeIn(500);
	$("#probabilityInfo").fadeIn(500);
	$("#cancelInfo").fadeIn(500);

	var bar = new RadialProgress(document.getElementById("bar"), { colorFg: "#aa0f0f", colorBg: "#585858", colorText: "#202020", round: true, thick: 2, progress: 0.0 });
	// // bar.noPercentage = !bar.noPercentage
	// bar.setText("Real")
	bar.draw(true);
	bar.setValue(modified_probability);
	
	$(".rp_text").click(function(){
		bar.noPercentage = !bar.noPercentage
		bar.setText(data.model_prediction)
		$(".rp_text").hide()
		$(".rp_text").fadeIn(500);
		bar.draw(true);
	});

	$("#bodyInfo").on('click', '#reportNews', function(){

		url = "http://127.0.0.1:8000/api/urls/report/";
		post_data = {
			news_url: data.url.news_url,
			article_content: data.article_content,
			pred: data.model_prediction,
			prob: data.model_probability
		};
		let ajax_data = $.ajax(url, {
			type: 'POST',
			data: post_data,
			beforeSend: renderLoading,
		})
		.done((data, status, xhr) => {
			clearElements();
		}).fail(err => {
			console.log(err);
		})

	});

}

function clearElements(){

	$("#validityInfo").fadeOut(300, ()=>{$("#validityInfo").html("");});
	$("#probabilityInfo").fadeOut(300,()=>{$("#probabilityInfo").html("");});
	$("#cancelInfo").fadeOut(300,()=>{$("#cancelInfo").html("");});
	$("#buttonLabel").fadeOut(300, ()=>{
		$("#buttonLabel").text("Click to check Fakescore!")
	});
	$("#reportNews").fadeOut(300, ()=>{
		$("#reportNews").replaceWith('<button type="button" id="checkNews" class="btn btn-red btn-danger">Check Fakescore</button>');		
		$("#reportNews").fadeIn(300);
		$("#reportInfo").html('<img src="static/circul.png" class="placeholder">');
		$("#buttonLabel").fadeIn(300);
		$("#reportInfo").fadeIn(300);
	});

}

function renderDefault(){

	$("#reportInfo").fadeIn(300);
	$("#bodyInfo").fadeIn(300);
	
}

function renderError() {

}