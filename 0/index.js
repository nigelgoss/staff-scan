(() => {

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
	
	[
		["FASolid", "resources/fa-solid-900.woff2"],
	].forEach($v => {
		let font = new FontFace($v[0], "url('"+$v[1]+"')");
		font.load().then(() => { document.fonts.add(font); });
	});

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
	
	const throttle = {};
	Object.defineProperties(HTMLElement.prototype, {

		"ngpointerdown": {
			"set": function ($d) {
				this.style.cursor = "pointer";
				if (this._ngX === undefined) this._ngX = {}; 
				if (this.onpointerdown === null) this.onpointerdown = () => {
					if (throttle.ele === this && new Date() - throttle.date < (this.ngthrottle ?? 333)) return;
					throttle.date = new Date();
					throttle.ele = this;
					this._ngX.pointerdown();
				};
				if (this.ontouchstart === null) this.ontouchstart = () => {}; // iOS
				this._ngX.pointerdown = $d;
			},
			"get": function () {
				return this?._ngX?.pointerdown;
			},
		},

		"ngthrottle": {
			"set": function ($d) {
				if (this._ngX === undefined) this._ngX = {}; 
				this._ngX.throttle = $d;
			},	
			"get": function () {
				return this?._ngX?.throttle;
			},
		},
					
		"ngstyle": {
			"set": function ($d) {
				Object.keys($d).forEach($v => { this.style.setProperty($v, $d[$v]); });
			},
		},

	});

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
	
	let style = document.createElement("style"); document.head.appendChild(style);
	style.textContent = [
		".faS { font-family:FASolid; font-size:1.1em; }",
		"fieldset div { border-top:1px solid grey; padding:10px; }",
	].join("\n");
	
	document.body.ngstyle = {"font-family":"Arial", "font-size":"10pt"};
	
	const header = document.createElement("header"); document.body.appendChild(header);
	header.ngstyle = {"display":"grid", "grid-template-columns":"1fr auto"};
	
	let button = document.createElement("button"); header.appendChild(button);
	button.ngstyle = {"background-color":"#00a499", "color":"#FFFFFF", "border":"2px solid #FFFFFF", "border-radius":"10px"};
	let span = document.createElement("span"); button.appendChild(span); 
	span.className = "faS";
	span.textContent = "";
	button.appendChild(document.createTextNode(" Scan"));
	button.ngpointerdown = () => { scan(); };
	
	let img = document.createElement("img"); header.appendChild(img);
	img.src = "resources/logo.png";
	
	const main = document.createElement("main"); document.body.appendChild(main);

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
	
	const barcode = ($success, $failure) => { return $success({"text":1234}); };

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
	
	const query = ($employeeno, $success) => {

		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) return;
			if (xhr.status == 200) $success(JSON.parse(xhr.responseText));
			spinner(false);
		};
		xhr.open("GET", "$/api.json?employeeno=" + $employeeno, true);
		xhr.send();
		spinner(true);
		
	};
	
	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	const spinner = ($status) => {
		if ($status === true) {
			document.body.appendChild(spinnerDiv);
		} else {
			spinnerDiv.remove();
		};
	};

	const spinnerDiv = document.createElement("div");
	spinnerDiv.ngstyle = {"position":"absolute", "top":"0", "left":"0", "width":"100%", "height":"100%", "place-items":"center", "display":"grid"};
	img = document.createElement("img"); spinnerDiv.appendChild(img);
	img.src = "resources/spinner.png";
	img.ngstyle = {"animation":"transformRotate 2s infinite linear"};

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
	
	const build = ($d) => {
	
		main.textContent = "";
		
		let section = document.createElement("section"); main.appendChild(section);
		section.ngstyle = {"margin":"5px 0 5px 0", "padding":"5px", "background-color":"#005EB8", "color":"#FFFFFF", "display":"grid", "grid-template-columns":"auto 1fr", "grid-gap":"10px", "place-items":"center"};
		
		let img = document.createElement("img"); section.appendChild(img);
		img.ngstyle = {"grid-row":"span 3", "width":"80px", "border-radius":"100%", "border":"2px solid #FFFFFF"};
		img.src = "resources/user.jpg";
		
		let div = document.createElement("div"); section.appendChild(div);
		div.textContent = $d[0][0].Name;
		div.ngstyle = {"font-size":"1.2em", "text-align":"center", "font-weight":"bold"};
		
		div = document.createElement("div"); section.appendChild(div);
		div.textContent = $d[0][0].Role;
		div.ngstyle = {"text-align":"center"};
		
		div = document.createElement("div"); section.appendChild(div);
		div.textContent = $d[0][0].Department;
		div.ngstyle = {"text-align":"center"};
		
		// ----- -----
		
		let fieldset = document.createElement("fieldset"); main.appendChild(fieldset);
		fieldset.ngstyle = {"border":"2px solid #005EB8", "margin":"2px"};
		let legend = document.createElement("legend"); fieldset.appendChild(legend); legend.textContent = "Fit Mask Testing";
		section = document.createElement("section"); fieldset.appendChild(section);
		section.ngstyle = {"display":"grid", "grid-template-columns":"repeat(3, auto)"};
		
		Object.keys($d[1][0]).forEach($v => {
			let div = document.createElement("div"); section.appendChild(div);
			div.textContent = $v;
			div.ngstyle = {"font-weight":"bold"};
			Object.keys($d[1][0][$v]).forEach($v2 => {
				let div = document.createElement("div"); section.appendChild(div);
				let em = document.createElement("em"); div.appendChild(em); em.textContent = $v2;
				div.appendChild(document.createTextNode(" " + $d[1][0][$v][$v2]));
			});
		});
		
		// ----- -----
		
	};
	
	// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
	
	const scan = () => {
		barcode($d => { query($d.text, $d => { build($d); }); });
	};

})();
