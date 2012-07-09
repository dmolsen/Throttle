function fillForm() {
	
	var bandwidthUpInput     = document.getElementById("bandwidthup");
	var bandwidthDownInput   = document.getElementById("bandwidthdown");
	var latencyInput         = document.getElementById("latency");
	
	bandwidthUpInput.value   = this.getAttribute("data-bu");
	bandwidthDownInput.value = this.getAttribute("data-bd");
	latencyInput.value       = this.getAttribute("data-l");
	
	return false;
}

function buildPresets() {
	var presets = document.getElementsByClassName("preset");
	for (var i = 0; i < presets.length; i++) {
		presets[i].onclick = fillForm;
	}
}

window.onload = buildPresets;