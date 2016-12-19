'use strict';

console.info('require modal module');
require("bootstrap");

exports.OpenModal = OpenModal;
exports.OpenUrlModal = OpenUrlModal;
exports.CloseModal = CloseModal;

var GT_CommonModal_ID = "GT_CommonModal";

function getCommonModal(){
	var commonModal = $("#"+GT_CommonModal_ID);
	if (commonModal.size() <= 0) {
		var html = '';
		html += '<div class="modal fade" id="GT_CommonModal">';
		html += ' <div class="modal-dialog">';
		html += '<div class="modal-content">';
		html += '</div><!-- /.modal-content -->';
		html += ' </div><!-- /.modal-dialog -->';
		html += '</div><!-- /.modal -->';
		$("body").append(html);
		commonModal = $("#GT_CommonModal");
	}
	return commonModal;
}

function OpenModal (content, width) {
	var commonModal = getCommonModal();
	if (!width) {
		width = 600;
	}

	$(".modal-content", commonModal).html(content);
	$(".modal-dialog", commonModal).width(width);

	commonModal.modal({
		show : true
	});

	commonModal.on("hidden.bs.modal", function() {
		$(this).removeData("bs.modal");
	});
}

function OpenUrlModal (url, width) {
	var commonModal = getCommonModal();
	if (!width) {
		width = 600;
	}

	$(".modal-dialog", commonModal).width(width);
	commonModal.modal({
		remote : url,
		show : true
	});

	commonModal.on("hidden.bs.modal", function() {
		$(this).removeData("bs.modal");
	});
}


function CloseModal(callback) {
	var commonModal = $("#"+GT_CommonModal_ID);
	var fn = function() {
		callback();
		commonModal.off("hidden.bs.modal",fn);
	}
	
	if(callback){
		commonModal.on("hidden.bs.modal",fn);
	}
	
	commonModal.modal('hide');
}
